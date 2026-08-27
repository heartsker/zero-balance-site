#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const YC = process.env.YANDEX_YC || 'yc';
const DOMAIN = 'zerobalanceapp.ru';
const SERVICE_ACCOUNT_NAME = 'zerobalance-ru-agent-router';
const FUNCTION_NAME = 'zerobalance-ru-agent-router';
const GATEWAY_NAME = 'zerobalance-ru-site';
const CERTIFICATE_NAME = 'zerobalanceapp-ru';
const DNS_ZONE_NAME = 'zerobalanceapp-ru';
const FUNCTION_DIR = join(ROOT, 'serverless', 'yandex-agent-router', 'function');
const GATEWAY_TEMPLATE = join(ROOT, 'serverless', 'yandex-agent-router', 'api-gateway.yaml');

function loadEnv() {
  const path = join(ROOT, '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

function printable(args) {
  return [YC, ...args].map((argument) => JSON.stringify(argument)).join(' ');
}

function capture(args) {
  return execFileSync(YC, args, {
    cwd: ROOT,
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function json(args) {
  const output = capture([...args, '--format', 'json']);
  return output ? JSON.parse(output) : null;
}

function run(args, options = {}) {
  console.log(`\n$ ${printable(args)}`);
  return execFileSync(YC, args, {
    cwd: ROOT,
    encoding: options.capture ? 'utf8' : undefined,
    env: process.env,
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });
}

function hasBinding(bindings, role, serviceAccountId) {
  return (bindings?.access_bindings || bindings?.accessBindings || []).some((binding) =>
    (binding.role_id || binding.roleId) === role
      && binding.subject?.type === 'serviceAccount'
      && binding.subject?.id === serviceAccountId,
  );
}

function ensureFolderBinding(folderId, role, serviceAccountId) {
  const bindings = json(['resource-manager', 'folder', 'list-access-bindings', folderId]);
  if (hasBinding(bindings, role, serviceAccountId)) return;
  run([
    'resource-manager', 'folder', 'add-access-binding', folderId,
    '--role', role,
    '--service-account-id', serviceAccountId,
  ]);
}

function ensureFunctionBinding(functionId, role, serviceAccountId) {
  const bindings = json(['serverless', 'function', 'list-access-bindings', functionId]);
  if (hasBinding(bindings, role, serviceAccountId)) return;
  run([
    'serverless', 'function', 'add-access-binding', functionId,
    '--role', role,
    '--service-account-id', serviceAccountId,
  ]);
}

function sourceDescription() {
  const hash = createHash('sha256');
  for (const file of ['agent-http.cjs', 'index.js', 'package.json']) {
    hash.update(file);
    hash.update(readFileSync(join(FUNCTION_DIR, file)));
  }
  return `source-${hash.digest('hex').slice(0, 16)}`;
}

function ensureFunctionVersion(functionId, serviceAccountId, bucket) {
  const description = sourceDescription();
  const versions = json([
    'serverless', 'function', 'version', 'list',
    '--function-id', functionId,
  ]) || [];
  if (versions.some((version) => version.description === description)) {
    console.log(`function: source already deployed as ${description}`);
    return;
  }
  run([
    'serverless', 'function', 'version', 'create',
    '--function-id', functionId,
    '--runtime', 'nodejs22',
    '--entrypoint', 'index.handler',
    '--memory', '128MB',
    '--execution-timeout', '5s',
    '--concurrency', '8',
    '--service-account-id', serviceAccountId,
    '--mount', `type=object-storage,mount-point=site,bucket=${bucket},mode=ro`,
    '--source-path', FUNCTION_DIR,
    '--description', description,
  ]);
}

function renderedGatewaySpec(functionId, serviceAccountId, bucket) {
  const spec = readFileSync(GATEWAY_TEMPLATE, 'utf8')
    .replaceAll('__FUNCTION_ID__', functionId)
    .replaceAll('__SERVICE_ACCOUNT_ID__', serviceAccountId)
    .replaceAll('__BUCKET__', bucket);
  if (/__[A-Z_]+__/.test(spec)) throw new Error('Unresolved API Gateway template value.');
  return spec;
}

function normalizeGatewayDomain(gateway) {
  const value = gateway.domain || gateway.default_domain || gateway.defaultDomain;
  if (!value) throw new Error('API Gateway did not return a default domain.');
  return String(value).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function attachedDomain(gateway, domain) {
  const domains = gateway.attached_domains || gateway.attachedDomains || gateway.domains || [];
  return domains.some((entry) => (entry.domain || entry.name || entry) === domain);
}

function attachDomain(gatewayId, certificateId) {
  const gateway = json(['serverless', 'api-gateway', 'get', gatewayId]);
  if (attachedDomain(gateway, DOMAIN)) return gateway;
  try {
    run([
      'serverless', 'api-gateway', 'add-domain', gatewayId,
      '--domain', DOMAIN,
      '--certificate-id', certificateId,
    ]);
  } catch (error) {
    const output = `${error.stderr || ''}${error.stdout || ''}${error.message || ''}`;
    if (!/already|exists/i.test(output)) throw error;
    console.log(`domain: ${DOMAIN} is already attached`);
  }
  return json(['serverless', 'api-gateway', 'get', gatewayId]);
}

function cutOverDns(folderId, gatewayDomain) {
  const zones = json(['dns', 'zone', 'list', '--folder-id', folderId]) || [];
  const zone = zones.find((entry) => entry.name === DNS_ZONE_NAME);
  if (!zone) throw new Error(`DNS zone not found: ${DNS_ZONE_NAME}`);
  const records = json(['dns', 'zone', 'list-records', zone.id]);
  const apex = (records?.record_sets || records?.recordSets || []).find((record) =>
    record.name === `${DOMAIN}.` && record.type === 'ANAME',
  );
  const target = `${gatewayDomain}.`;
  if (apex?.data?.length === 1 && apex.data[0] === target) {
    console.log(`dns: ${DOMAIN} already points to ${target}`);
    return;
  }
  console.log(`dns: replacing ${apex?.data?.join(', ') || 'missing ANAME'} with ${target}`);
  run([
    'dns', 'zone', 'replace-records', zone.id,
    '--record', `${DOMAIN}. 600 ANAME ${target}`,
  ]);
}

function preflight(gatewayOrigin) {
  console.log(`\npreflight: ${gatewayOrigin} as canonical https://${DOMAIN}`);
  execFileSync(process.execPath, [join(ROOT, 'scripts', 'verify-agent-readiness.mjs'), gatewayOrigin], {
    cwd: ROOT,
    env: {
      ...process.env,
      AGENT_VERIFY_CANONICAL_ORIGIN: `https://${DOMAIN}`,
    },
    stdio: 'inherit',
  });
}

loadEnv();
const bucket = process.env.YANDEX_BUCKET;
if (!bucket) throw new Error('Set YANDEX_BUCKET in .env or the environment.');
const folderId = process.env.YANDEX_FOLDER_ID || capture(['config', 'get', 'folder-id']);
if (!folderId) throw new Error('Yandex Cloud folder id is not configured.');

const serviceAccounts = json(['iam', 'service-account', 'list', '--folder-id', folderId]) || [];
let serviceAccount = serviceAccounts.find((entry) => entry.name === SERVICE_ACCOUNT_NAME);
if (!serviceAccount) {
  serviceAccount = json([
    'iam', 'service-account', 'create',
    '--name', SERVICE_ACCOUNT_NAME,
    '--description', 'Read-only runtime identity for the Zero Balance Russian site agent router',
  ]);
}
ensureFolderBinding(folderId, 'storage.viewer', serviceAccount.id);

const functions = json(['serverless', 'function', 'list', '--folder-id', folderId]) || [];
let cloudFunction = functions.find((entry) => entry.name === FUNCTION_NAME);
if (!cloudFunction) {
  cloudFunction = json([
    'serverless', 'function', 'create',
    '--name', FUNCTION_NAME,
    '--description', 'HTML and Markdown content negotiation for zerobalanceapp.ru',
  ]);
}
ensureFunctionBinding(cloudFunction.id, 'functions.functionInvoker', serviceAccount.id);
ensureFunctionVersion(cloudFunction.id, serviceAccount.id, bucket);

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'zero-balance-gateway-'));
const specificationPath = join(temporaryDirectory, 'openapi.yaml');
try {
  writeFileSync(
    specificationPath,
    renderedGatewaySpec(cloudFunction.id, serviceAccount.id, bucket),
    'utf8',
  );
  const gateways = json(['serverless', 'api-gateway', 'list', '--folder-id', folderId]) || [];
  let gateway = gateways.find((entry) => entry.name === GATEWAY_NAME);
  if (!gateway) {
    gateway = json([
      'serverless', 'api-gateway', 'create',
      '--name', GATEWAY_NAME,
      '--description', 'Agent-ready Russian mirror for Zero Balance',
      '--spec', specificationPath,
      '--execution-timeout', '10s',
    ]);
  } else {
    run([
      'serverless', 'api-gateway', 'update', gateway.id,
      '--spec', specificationPath,
      '--execution-timeout', '10s',
    ]);
    gateway = json(['serverless', 'api-gateway', 'get', gateway.id]);
  }

  const gatewayDomain = normalizeGatewayDomain(gateway);
  const gatewayOrigin = `https://${gatewayDomain}`;
  preflight(gatewayOrigin);

  if (process.argv.includes('--cutover')) {
    const certificates = json(['certificate-manager', 'certificate', 'list', '--folder-id', folderId]) || [];
    const certificate = certificates.find((entry) => entry.name === CERTIFICATE_NAME);
    if (!certificate || certificate.status !== 'ISSUED') {
      throw new Error(`Issued certificate not found: ${CERTIFICATE_NAME}`);
    }
    gateway = attachDomain(gateway.id, certificate.id);
    cutOverDns(folderId, normalizeGatewayDomain(gateway));
  }

  console.log(`\nagent router ready: ${gatewayOrigin}`);
  if (!process.argv.includes('--cutover')) {
    console.log('DNS unchanged. Re-run with --cutover after reviewing preflight results.');
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
