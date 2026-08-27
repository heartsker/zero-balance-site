# Russian mirror: `zerobalanceapp.ru`

## Why this exists

The global site `zerobalance.pro` runs on Cloudflare Workers. Since June 2025
Roskomnadzor has had Russian ISPs throttle Cloudflare-protected sites to the first
~16 KB of every asset, so the site is effectively unreachable in Russia without a
VPN. Most of the app's users are in Russia, so we serve them a separate mirror,
`zerobalanceapp.ru`, hosted **inside Russia** (Yandex Object Storage, Cloud Functions,
and API Gateway), which
is not throttled.

Nothing about the Cloudflare deployment changes. `zerobalance.pro` stays on the
Worker for the rest of the world; the `.ru` mirror is a second build of the same
source tree.

## How it works: one source, two builds

The domain and locale set are env-driven (`src/lib/siteConfig.ts` and
`astro.config.mjs`), so the same code produces two outputs:

| | Global build (Cloudflare) | Russian mirror (Yandex) |
|---|---|---|
| `PUBLIC_SITE_DOMAIN` | unset -> `https://zerobalance.pro` | `https://zerobalanceapp.ru` |
| `PUBLIC_SITE_LOCALES` | unset -> all 12 | `ru,en` |
| `PUBLIC_SITE_DEFAULT_LOCALE` | unset -> `en` | `ru` |
| Output dir | `dist/` (served by `wrangler.toml`) | `dist-ru/` (served through API Gateway) |
| Analytics | none | Yandex Metrika (consent-gated) |

Cross-build details handled in code:
- **Russian at the root, English under `/en/`.** The Yandex build includes only these
  two locales. `scripts/prepare-yandex-build.mjs` removes any other locale output,
  while preserving the English mirror for crawler and user parity.
- **No `/ru/` prefix.** After the build, `scripts/prepare-yandex-build.mjs`
  **flattens** `dist-ru/ru/*` up to `dist-ru/*` and
  rewrites every `/ru/` reference (links, canonical, OG, sitemap, JSON-LD, prose) to
  `/`. So pages live at `zerobalanceapp.ru/`, `/faq/`, `/blog/...` - not `/ru/...`.
  (Asset paths like `/screenshots/ru/*.png` are intentionally preserved.) `src/pages/index.astro`
  still emits a root stub but it is overwritten by the flattened home; on Cloudflare the
  Worker owns `/` so the stub is unused there.
- **Metrika is `.ru`-only.** `BaseLayout` renders `<ConsentAnalytics>` only when
  `IS_RU_SITE`; the global build ships no analytics, no consent banner, and no
  `/cdn-cgi/trace` call. The privacy page's Metrika disclosures are likewise gated.
- **Fonts are self-hosted** (`@fontsource-variable/inter`) on both builds, since
  Google Fonts is also throttled in Russia.
- **hreflang is cross-domain and identical on both builds:** `ru` -> the **root** of
  `zerobalanceapp.ru` (no `/ru/`), every other locale -> its prefix on `zerobalance.pro`.
  Canonical stays self-referential per host.
- **App Store campaign token** differs per build (`ct=zerobalanceapp-ru-site` vs
  `zerobalance-pro-site`) so installs are attributable per funnel in App Analytics.

## One-time setup

1. **Domain.** Register `zerobalanceapp.ru` with an accredited registrar
   (reg.ru / RU-CENTER); `.ru` requires passport/ID verification.
2. **Yandex Cloud.** The deploy script creates or updates the runtime resources:
   - Object Storage bucket named `zerobalanceapp.ru`, with **static website hosting**
     enabled (index document `index.html`).
   - A private Node.js 22 Cloud Function named `zerobalance-ru-agent-router` with a
     read-only bucket mount and a dedicated service account that has only
     `storage.viewer` plus permission to invoke the function.
   - API Gateway `zerobalance-ru-site`. Page requests go through the function so HTML,
     Markdown negotiation, HEAD, 406, and 404 share the Cloudflare HTTP contract.
     `/_astro/*` is served directly from Object Storage.
   - An issued Certificate Manager certificate named `zerobalanceapp-ru`, attached to
     the gateway custom domain. The apex DNS ANAME points to the gateway domain.
   - The former CDN resource is retained unchanged as a rollback reference.
   - A separate deployment service account + static access key (S3 credentials) scoped
     to the bucket for uploads.
3. **Local tooling.** Install the AWS CLI (`aws`) - the Yandex lane uses it for the
   S3-compatible sync.
4. **Secrets.** Create a gitignored `.env` in the repo root:
   ```sh
   YANDEX_BUCKET=zerobalanceapp.ru
   AWS_ACCESS_KEY_ID=<yandex static key id>
   AWS_SECRET_ACCESS_KEY=<yandex static key secret>
   # optional, defaults to https://storage.yandexcloud.net
   # YANDEX_S3_ENDPOINT=https://storage.yandexcloud.net
   ```
5. **Search (Yandex Webmaster).** At [webmaster.yandex.ru](https://webmaster.yandex.ru):
   add `zerobalanceapp.ru`, verify ownership (DNS TXT or the HTML-file method), then
   **Indexing -> Sitemap files** -> add `https://zerobalanceapp.ru/sitemap-index.xml`.
   Under **Indexing -> IndexNow**, Yandex auto-detects the key from the `*.txt` file at
   the site root (shipped from `public/`), so the per-deploy pings (below) show up there.
   The manual "recrawl" button is quota-limited; IndexNow is the uncapped path.

## Deploying

```sh
npm run deploy:cloudflare   # build + ship the global site (zerobalance.pro)
npm run deploy:yandex       # build RU+EN, sync, deploy router/gateway, verify, cut over
npm run deploy:all          # both, sequentially
```

All three are thin wrappers over `scripts/deploy.mjs`. The Yandex lane builds the
flattened mirror, syncs Object Storage, idempotently deploys the function and gateway,
verifies the gateway service domain, attaches the certificate, replaces the apex ANAME,
and runs the production verifier. Each lane ends with a
best-effort **IndexNow** ping (`scripts/indexnow.mjs`) that submits the URLs whose
content hash changed in that build - `zerobalanceapp.ru` from `dist-ru/` for the
Yandex lane, `zerobalance.pro` from `dist/` for the Cloudflare lane. IndexNow is a
shared protocol, so one ping reaches Yandex (and Bing, Seznam, ...). If a ping is
missed (e.g. transient network), re-run `npm run indexnow:ru` or `npm run indexnow`;
the ping never fails the deploy since the build has already shipped by then.

## Verify

- `dist-ru/` is served at the **root**: `index.html` is the real Russian home (not a
  redirect), pages sit at `/faq/`, `/blog/...` etc. (no `/ru/`), with self-hosted fonts
  (no `fonts.googleapis.com`), Metrika + consent banner, and canonical/OG on
  `zerobalanceapp.ru`. English pages remain under `/en/`. The only other surviving
  `/ru/` path is `/screenshots/ru/*.png`.
- `npm run verify:agents -- https://zerobalanceapp.ru` checks the sitemap URLs,
  negotiated HTML and Markdown, direct Markdown aliases, 404/406 behavior,
  machine-readable endpoints, static assets, and eight crawler user agents.
- `dist/` (global) has all 12 locales, no Metrika, and canonical/OG on `zerobalance.pro`.
- Decisive check: load `https://zerobalanceapp.ru/` from inside Russia - it must load
  fully and fast, not stall at ~16 KB.

## Rollback

The mirror is additive and does not touch Cloudflare. The previous Yandex CDN resource
is deliberately not deleted. To roll back, replace the apex ANAME with its previous CDN
target and confirm TLS plus the root page. Stop running `deploy:yandex` while the legacy
route is active because that command intentionally restores the API Gateway cutover.
The global site is unaffected at all times.
