const en = {
  meta: {
    siteName: 'Zero Balance',
    defaultTitle: 'Zero Balance - Spend leftover Apple Account balance',
    defaultDescription:
      'Got leftover Apple Account balance or store credit you cannot shake? Zero Balance picks the closest pack of small App Store items to clear it.',
  },
  nav: {
    home: 'Home',
    faq: 'FAQ',
    help: 'Help',
    privacy: 'Privacy',
    support: 'Support',
    download: 'Download',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  cta: {
    appStore: 'Get on the App Store',
    appStoreShort: 'App Store',
    learnMore: 'Learn more',
    seeAllFaq: 'See all questions',
    readHelp: 'Read the help guide',
  },
  hero: {
    eyebrow: 'iOS utility',
    title: 'Spend your leftover Apple Account balance.',
    subtitle:
      'Got a small balance on your Apple Account, a leftover store credit, or the last few cents of a gift card? Zero Balance picks the closest pack of small App Store items to clear it down to zero.',
    bullets: [
      'Done in under a minute',
      'No access to your Apple ID',
      'No ads, no tracking',
    ],
    screenshotAlt: 'Zero Balance app on iPhone showing the home screen',
  },
  howItWorks: {
    title: 'How it works',
    subtitle: 'Three steps. No tricks. Apple charges your balance like any other in-app purchase.',
    steps: [
      {
        title: 'Enter your balance',
        body: 'Type in the amount you want to clear. Zero Balance never reads your Apple Account automatically.',
      },
      {
        title: 'Review the plan',
        body: 'The app picks the closest combination from eight price tiers. You see the total, the overage, and how many confirmations it takes before you tap anything.',
      },
      {
        title: 'Confirm and clear',
        body: 'Approve the purchases. Your inventory syncs privately to your own iCloud. The balance trends to zero.',
      },
    ],
  },
  features: {
    title: 'Built for one job, done well',
    subtitle: 'No subscriptions. No upsells. No data sold.',
    items: [
      {
        title: 'Manual target helper',
        body: 'You enter the remaining balance yourself. Zero Balance does the matching.',
      },
      {
        title: 'Plan review screen',
        body: 'Total, overage and confirmation count before any App Store purchase.',
      },
      {
        title: 'Eight price tiers',
        body: 'Granular amounts so different remainders can be matched precisely.',
      },
      {
        title: 'Private iCloud inventory',
        body: 'Items sync across your devices via your own iCloud. We never see them.',
      },
    ],
  },
  trust: {
    items: [
      'No access to your Apple ID',
      'No ads',
      'No tracking',
      'iCloud-private inventory',
    ],
  },
  faqTeaser: {
    title: 'Common questions',
    subtitle: 'Answers to what most people ask first.',
  },
  finalCta: {
    title: 'Clear your balance in under a minute.',
    subtitle: 'Free to download. Pay only for the small items you choose inside the App Store.',
  },
  footer: {
    tagline: 'Spend leftover Apple Account balance, the simple way.',
    columns: {
      product: 'Product',
      help: 'Help',
      legal: 'Legal',
    },
    rights: 'All rights reserved.',
    builtBy: 'Built by Daniel Pustotin',
  },
  langSwitcher: {
    label: 'Language',
    en: 'English',
    ru: 'Russian',
  },
  faq: {
    pageTitle: 'Frequently asked questions',
    pageDescription:
      'Everything people ask about clearing leftover Apple Account balance with Zero Balance.',
    items: [
      {
        q: 'Does Zero Balance read my Apple Account balance automatically?',
        a: 'No. Apple does not expose your balance to third-party apps. You enter the target amount manually from Settings > Apple Account on your iPhone.',
      },
      {
        q: 'Will this drain my real money or just my store credit?',
        a: 'App Store purchases always pull from your Apple Account balance first, then fall back to your payment method. If you have enough store credit to cover the plan, no real money is charged. Apple confirms each purchase before it goes through.',
      },
      {
        q: 'What if my balance is smaller than the cheapest in-app item?',
        a: 'Then the plan will overshoot slightly. The plan review screen shows the exact overage before you confirm, so you can decide whether it is worth it.',
      },
      {
        q: 'Why are there so many small in-app items?',
        a: 'Eight price tiers let Zero Balance match almost any remainder precisely. With fewer tiers, the overage would be much larger.',
      },
      {
        q: 'Do I keep what I buy?',
        a: 'Yes. Every purchase lands in your private inventory. Non-consumables stay forever. Consumables can be used inside the app.',
      },
      {
        q: 'Where is my inventory stored?',
        a: 'In your own iCloud, private to your Apple ID. We never see your purchases or your inventory.',
      },
      {
        q: 'Are there subscriptions?',
        a: 'No. Zero Balance has zero subscriptions. Everything is a one-time consumable or non-consumable purchase.',
      },
      {
        q: 'Can I get a refund?',
        a: 'Refunds go through Apple, not through us. Open reportaproblem.apple.com on a browser, sign in with your Apple ID, and request a refund there.',
      },
      {
        q: 'Does Zero Balance track me or run ads?',
        a: 'No tracking, no ads, no analytics that identify you. See the privacy page for details.',
      },
      {
        q: 'I want to switch my Apple ID country. Will this help?',
        a: 'Yes - Apple requires a zero balance before you can switch country. Zero Balance is built for exactly that case. See the dedicated guide.',
      },
    ],
  },
  help: {
    pageTitle: 'How to use Zero Balance',
    pageDescription:
      'Step-by-step guide to clearing leftover Apple Account balance with Zero Balance.',
    intro:
      'This is the same flow the in-app welcome guide shows new users. Follow these five steps and you will go from a stuck balance to zero in under a minute.',
    steps: [
      {
        title: 'Check your current Apple Account balance',
        body: 'On your iPhone open Settings, tap your name at the top, then tap Media & Purchases > View Account. Your balance is shown at the top. Make a note of the exact amount, including cents.',
      },
      {
        title: 'Open Zero Balance and enter the amount',
        body: 'Launch Zero Balance, tap the currency field on the Home screen, and type in the exact amount you saw in Settings. Tap Clear balance.',
      },
      {
        title: 'Review the plan',
        body: 'Zero Balance shows the chosen pack of items, the total cost, the overage (if any), and the number of confirmations Apple will ask for. If you are happy, continue. If not, tap back and adjust.',
      },
      {
        title: 'Confirm each purchase with Apple',
        body: 'Apple asks you to confirm each in-app purchase the usual way (Face ID, Touch ID, or password). Your balance is drawn down with every confirmation.',
      },
      {
        title: 'Verify in Settings',
        body: 'When the last purchase is confirmed, go back to Settings > Apple Account to verify the balance is at zero. If a few cents remain, run Zero Balance again with the new amount.',
      },
    ],
  },
};

export default en;
export type Dict = typeof en;
