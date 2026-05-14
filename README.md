# Zero Balance - spend leftover Apple Account balance

Have a few dollars, euros, or rubles stuck on your Apple Account that you cannot spend down? Apple does not refund Apple Account balance to cash, and it will not let you change your App Store country while any balance remains. **Zero Balance** is a free iOS utility that picks the closest pack of small App Store items to clear your remaining balance to exactly zero, usually in under a minute.

- **Live site**: [zerobalance.pro](https://zerobalance.pro/)
- **App Store**: [Zero Balance on the App Store](https://apps.apple.com/app/apple-store/id6761912988)
- **Source code (iOS app)**: private for now
- **Source code (this site)**: [github.com/heartsker/zero-balance-site](https://github.com/heartsker/zero-balance-site)

## The problem this solves

Apple Account balance (also called App Store credit, iTunes credit, or gift card balance) is store credit, not money. Apple's terms say it is non-refundable and spendable only inside Apple's ecosystem. Three situations where the leftover starts to matter:

- **You want to change your Apple ID country or region.** Apple disables the change-country button in Settings until your balance is exactly $0.00 / €0.00 / ₽0.00.
- **You received a gift card.** The face value rarely matches any single app or subscription price, so a small remainder stays stuck after each purchase.
- **A subscription left a residue.** Pro-rated charges and currency rounding leave odd amounts like $0.47 or €0.79 - too small to buy anything on its own.

Most apps in the App Store are priced at round numbers ($0.99, $1.99, $4.99), and Apple subscriptions are billed in whole units. So a leftover under a dollar usually has no clean target. Zero Balance solves exactly this: it assembles a plan from eight in-app price tiers that fits any remainder with minimal overage (often a few cents), shows you the plan before any purchase, and walks you through Apple's normal confirmation flow.

## How it works (three steps)

1. **Check your balance** in Settings > your name > Media & Purchases > View Account.
2. **Enter the amount** in Zero Balance. The app picks the closest combination of small in-app items from its eight price tiers.
3. **Confirm each purchase** with Face ID or Touch ID, the same way Apple confirms every App Store purchase. Your balance trends to zero. Purchases land in a private iCloud-synced inventory that only you can see.

No subscriptions inside the app. No ads. No tracking. No access to your Apple ID. The app never reads your balance automatically - Apple does not expose that to third-party apps. Built for iOS 26 or later.

## Featured guides (English)

Long-form articles on the site, each tuned to a specific real-world scenario:

- **[How to spend leftover Apple Account balance](https://zerobalance.pro/en/spend-apple-account-balance/)** - why Apple will not cash out store credit, the three ways people try to clear it, and which actually work.
- **[How to change Apple ID country with a balance left](https://zerobalance.pro/en/change-apple-id-country-with-balance/)** - the full pre-flight checklist: cancel subscriptions, wind down Apple One, spend the balance, wait for pending purchases, then switch country.
- **[How to remove leftover Apple ID balance](https://zerobalance.pro/en/remove-leftover-apple-id-balance/)** - what to do when a few cents are stuck and no standard subscription matches. Includes a worked example for a $0.47 leftover.

Hubs:

- **[Frequently asked questions](https://zerobalance.pro/en/faq/)** - everything people ask first.
- **[Step-by-step help guide](https://zerobalance.pro/en/help/)** - the same flow the in-app welcome shows new users.
- **[Privacy policy](https://zerobalance.pro/en/privacy/)** - what we collect (almost nothing) and where it lives.
- **[Support](https://zerobalance.pro/en/support/)** - common issues and how to reach us.

## Те же материалы на русском

- **[Как потратить остаток баланса Apple Account](https://zerobalance.pro/ru/spend-apple-account-balance/)** - почему Apple не возвращает баланс деньгами и как обнулить остаток без подписок.
- **[Как сменить страну Apple ID, если на балансе остались деньги](https://zerobalance.pro/ru/change-apple-id-country-with-balance/)** - чек-лист: отмена подписок, ожидание возвратов, обнуление баланса, смена страны.
- **[Как убрать остаток баланса Apple ID](https://zerobalance.pro/ru/remove-leftover-apple-id-balance/)** - что делать, когда застряли несколько копеек, и пример на $0.47.

Хабы:

- **[Частые вопросы](https://zerobalance.pro/ru/faq/)** - всё, что спрашивают чаще всего.
- **[Пошаговая инструкция](https://zerobalance.pro/ru/help/)** - тот же поток, что встречает новых пользователей внутри приложения.
- **[Политика конфиденциальности](https://zerobalance.pro/ru/privacy/)** - что мы собираем (почти ничего) и где это лежит.
- **[Поддержка](https://zerobalance.pro/ru/support/)** - частые проблемы и контакт.

## FAQ - individual questions (English)

Each question on the site has its own page, indexed separately, so you can deep-link to the exact answer:

- [Does Zero Balance read my Apple Account balance automatically?](https://zerobalance.pro/en/faq/does-zero-balance-read-my-balance/)
- [Will this drain my real money or just my store credit?](https://zerobalance.pro/en/faq/real-money-or-store-credit/)
- [What if my balance is smaller than the cheapest in-app item?](https://zerobalance.pro/en/faq/balance-smaller-than-cheapest-item/)
- [Why are there so many small in-app items?](https://zerobalance.pro/en/faq/why-many-small-items/)
- [Do I keep what I buy?](https://zerobalance.pro/en/faq/do-i-keep-what-i-buy/)
- [Where is my inventory stored?](https://zerobalance.pro/en/faq/where-is-my-inventory-stored/)
- [Are there subscriptions?](https://zerobalance.pro/en/faq/are-there-subscriptions/)
- [Can I get a refund?](https://zerobalance.pro/en/faq/can-i-get-a-refund/)
- [Does Zero Balance track me or run ads?](https://zerobalance.pro/en/faq/does-zero-balance-track-me/)
- [I want to switch my Apple ID country. Will this help?](https://zerobalance.pro/en/faq/help-with-changing-apple-id-country/)

## Вопросы и ответы (Russian)

- [Zero Balance читает мой баланс Apple Account автоматически?](https://zerobalance.pro/ru/faq/does-zero-balance-read-my-balance/)
- [Это потратит мои деньги или только кредит магазина?](https://zerobalance.pro/ru/faq/real-money-or-store-credit/)
- [Что если мой баланс меньше самого дешёвого товара в приложении?](https://zerobalance.pro/ru/faq/balance-smaller-than-cheapest-item/)
- [Почему столько мелких товаров в приложении?](https://zerobalance.pro/ru/faq/why-many-small-items/)
- [Я оставляю себе то, что купил?](https://zerobalance.pro/ru/faq/do-i-keep-what-i-buy/)
- [Где хранится мой инвентарь?](https://zerobalance.pro/ru/faq/where-is-my-inventory-stored/)
- [Есть подписки?](https://zerobalance.pro/ru/faq/are-there-subscriptions/)
- [Можно вернуть деньги?](https://zerobalance.pro/ru/faq/can-i-get-a-refund/)
- [Zero Balance меня отслеживает или показывает рекламу?](https://zerobalance.pro/ru/faq/does-zero-balance-track-me/)
- [Я хочу сменить страну Apple ID. Это поможет?](https://zerobalance.pro/ru/faq/help-with-changing-apple-id-country/)

## Privacy in one paragraph

No accounts. No ads. No analytics that identify you. No third-party SDKs in the app beyond Apple's own frameworks (StoreKit, CloudKit, GameKit). Your inventory and purchase history sync through CloudKit into your own private iCloud container, which means the data is encrypted, lives under your Apple ID, and the developer has no read access. The website sets one cookie - `zb_locale` - to remember your language choice. Full details on the [English](https://zerobalance.pro/en/privacy/) or [Russian](https://zerobalance.pro/ru/privacy/) privacy page.

## About the developer

Zero Balance is built by Daniel Pustotin, an independent iOS developer. The app is free, has no subscriptions, and exists to solve one specific irritation that Apple has not solved itself. For support, see the [support page](https://zerobalance.pro/en/support/) or email the address listed there.

## This repository

This repo contains only the marketing website, not the iOS app. Built with [Astro 5](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com), deployed to Cloudflare Pages on every push to `main`. Local development:

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static export to ./dist
npm run preview    # serve ./dist locally
```

Requires Node 22+ (see `.nvmrc`). Source layout: `src/pages/[lang]/*` for localized routes, `src/i18n/` for translation dictionaries, `src/components/` for shared UI, `public/` for static assets including `robots.txt`, `_redirects`, and `_headers`.
