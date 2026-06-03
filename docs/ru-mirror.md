# Russian mirror: `zerobalanceapp.ru`

## Why this exists

The global site `zerobalance.pro` runs on Cloudflare Workers. Since June 2025
Roskomnadzor has had Russian ISPs throttle Cloudflare-protected sites to the first
~16 KB of every asset, so the site is effectively unreachable in Russia without a
VPN. Most of the app's users are in Russia, so we serve them a separate mirror,
`zerobalanceapp.ru`, hosted **inside Russia** (Yandex Object Storage + CDN), which
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
| `PUBLIC_SITE_LOCALES` | unset -> all 12 | `ru` |
| `PUBLIC_SITE_DEFAULT_LOCALE` | unset -> `en` | `ru` |
| Output dir | `dist/` (served by `wrangler.toml`) | `dist-ru/` |
| Analytics | none | Yandex Metrika (consent-gated) |

Cross-build details handled in code:
- **Russian only.** Standard pages build ru-only because their `getStaticPaths()`
  maps over the env-filtered `LOCALES`. The en+ru blog hardcodes its locales, so its
  `/en/` pages are pruned from `dist-ru/` by the deploy script. The sitemap `filter`
  in `astro.config.mjs` drops non-ru URLs.
- **Served at the root, no `/ru/` prefix.** The mirror is single-language, so after
  the build `scripts/deploy.mjs` **flattens** `dist-ru/ru/*` up to `dist-ru/*` and
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
2. **Yandex Cloud.**
   - Object Storage bucket named `zerobalanceapp.ru`, with **static website hosting**
     enabled (index document `index.html`).
   - A **CDN** resource fronting the bucket; attach the `zerobalanceapp.ru` domain and
     issue a Let's Encrypt certificate in Certificate Manager.
   - A service account + static access key (S3 credentials) scoped to the bucket.
   - Optionally set cache + security response headers on the CDN (the `_headers` /
     `_redirects` files are Cloudflare-only and are not read by Yandex S3).
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
5. **Search.** Submit the `.ru` sitemap to Yandex Webmaster.

## Deploying

```sh
npm run deploy:cloudflare   # build + ship the global site (zerobalance.pro)
npm run deploy:yandex       # build ru-only, prune, sync to the Yandex bucket
npm run deploy:all          # both, sequentially
```

All three are thin wrappers over `scripts/deploy.mjs`.

## Verify

- `dist-ru/` is served at the **root**: `index.html` is the real Russian home (not a
  redirect), pages sit at `/faq/`, `/blog/...` etc. (no `/ru/`), with self-hosted fonts
  (no `fonts.googleapis.com`), Metrika + consent banner, and canonical/OG on
  `zerobalanceapp.ru`. The only surviving `/ru/` is `/screenshots/ru/*.png`.
- `dist/` (global) has all 12 locales, no Metrika, and canonical/OG on `zerobalance.pro`.
- Decisive check: load `https://zerobalanceapp.ru/` from inside Russia - it must load
  fully and fast, not stall at ~16 KB.

## Rollback

The mirror is additive: it does not touch Cloudflare. To pause it, stop running
`deploy:yandex` (and optionally point the `.ru` DNS away). The global site is
unaffected at all times.
