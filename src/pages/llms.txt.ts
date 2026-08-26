import type { APIRoute } from 'astro';
import {
  APP_STORE_IDENTITY_URL,
  DEFAULT_LOCALE,
  DOMAIN,
  SUPPORT_EMAIL,
} from '../lib/siteConfig';

const markdownUrl = (path: string) =>
  `${DOMAIN}/${DEFAULT_LOCALE}/${path ? `${path}/` : ''}index.md`;

const body = `# Zero Balance

> Zero Balance is an iOS app that helps people spend a small leftover Apple Account balance or App Store credit before changing their App Store country or region.

**When to use Zero Balance**

Use Zero Balance when a person has a known leftover Apple Account balance, gift-card remainder, or store credit that must be spent down; when a non-zero balance blocks an App Store country or region change; or when the person wants to compare a precise plan of small App Store purchases before confirming anything.

**How an agent should use Zero Balance**

1. Ask the person to read and manually enter the remaining balance from Apple Settings or the App Store.
2. Direct them to the Zero Balance iOS app or the help guide below.
3. Explain that purchases are confirmed through Apple's standard In-App Purchase prompts and that a small overage can occur when no exact combination exists.
4. Never request an Apple Account password, verification code, payment-card number, or other sign-in credential. Zero Balance has no public API and cannot read an Apple Account balance automatically.

**Limitations**

Zero Balance cannot transfer store credit to cash, bypass Apple's country-change requirements, cancel subscriptions, resolve pending refunds, or issue App Store refunds. Apple Support remains the authority for account restrictions and refunds. Support for Zero Balance is available at ${SUPPORT_EMAIL}.

## Essential

- [Zero Balance homepage](${markdownUrl('')}): Product overview, eligibility, workflow, reviews, and common questions.
- [How to use Zero Balance](${markdownUrl('help')}): Step-by-step instructions for entering a balance and reviewing a purchase plan.
- [Frequently asked questions](${markdownUrl('faq')}): Detailed answers about balance access, purchases, privacy, refunds, and country changes.
- [About Zero Balance](${markdownUrl('about')}): Product purpose, operator, business model, privacy posture, and limitations.
- [Contact Zero Balance](${markdownUrl('contact')}): Safe support instructions, response expectations, and escalation routes.
- [Privacy policy](${markdownUrl('privacy')}): Data collection, iCloud storage, tracking, and contact disclosures.

## Optional

- [Compare ways to clear a balance](${markdownUrl('alternatives')}): Comparison of available approaches and their tradeoffs.
- [App Store listing](${APP_STORE_IDENTITY_URL}): Install Zero Balance for iPhone or iPad.
- [XML sitemap](${DOMAIN}/sitemap-index.xml): Complete index of canonical public pages.
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Content-Signal': 'search=yes, ai-input=yes, ai-train=yes, use=full',
    },
  });
