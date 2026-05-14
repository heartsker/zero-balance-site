# ZeroBalance site

Marketing site for the [ZeroBalance](https://apps.apple.com/app/apple-store/id6761912988) iOS app. Lives at [zerobalance.pro](https://zerobalance.pro).

Built with [Astro 5](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com). Deployed to Cloudflare Pages via the GitHub integration on every push to `main`.

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static export to ./dist
npm run preview    # serve ./dist locally
```

Requires Node 20+ (see `.nvmrc`).

## Structure

- `src/pages/[lang]/*` - localized routes (`en`, `ru`)
- `src/layouts/` - base + page layouts
- `src/components/` - shared UI (Hero, FAQ, AppStoreButton, ...)
- `src/i18n/` - dictionaries + helpers
- `src/lib/siteConfig.ts` - constants (App Store URL, domain, brand)
- `public/` - static assets, `_redirects`, `_headers`, `robots.txt`

## Deploy

Cloudflare Pages is connected to `heartsker/zero-balance-site` and rebuilds on every push to `main`. Build command `npm run build`, output directory `dist`.
