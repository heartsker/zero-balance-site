import {
  APP_STORE_URL,
  DOMAIN,
  APP_NAME,
  SUPPORT_EMAIL,
  APP_RATING,
  APP_RATING_COUNT,
  LOCALES,
  FAQ_PUBLISHED_DATE,
  type Locale,
} from './siteConfig';

const PUBLISHER = {
  '@type': 'Person',
  name: 'Daniel Pustotin',
  url: DOMAIN,
};

export function softwareApplicationSchema(opts: {
  description: string;
  lang: Locale;
  featureList?: string[];
  screenshots?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${DOMAIN}/#software`,
    name: APP_NAME,
    alternateName: 'Zero Balance: Spend Credit',
    operatingSystem: 'iOS 26',
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'PaymentApplication',
    description: opts.description,
    inLanguage: opts.lang,
    url: DOMAIN,
    sameAs: [APP_STORE_URL],
    image: `${DOMAIN}/icon.png`,
    softwareVersion: '1.0',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      url: APP_STORE_URL,
      availability: 'https://schema.org/InStock',
    },
    publisher: PUBLISHER,
    author: PUBLISHER,
    featureList: opts.featureList ?? [
      'Manual target helper for any leftover Apple Account balance',
      'Plan review with total, overage and confirmation count',
      'Eight in-app price tiers for precise matching',
      'Private iCloud-synced inventory',
      'No ads, no tracking, no subscriptions',
    ],
    screenshot: (opts.screenshots ?? [
      `${DOMAIN}/screenshots/${opts.lang}/1.png`,
      `${DOMAIN}/screenshots/${opts.lang}/2.png`,
      `${DOMAIN}/screenshots/${opts.lang}/3.png`,
    ]),
  };
}

export function websiteSchema(opts: { lang: Locale }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${DOMAIN}/#website`,
    name: APP_NAME,
    alternateName: 'zerobalance.pro',
    url: DOMAIN,
    inLanguage: opts.lang,
    publisher: PUBLISHER,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: { title: string; body: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    totalTime: 'PT1M',
    step: opts.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.body,
    })),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${DOMAIN}/#org`,
    name: APP_NAME,
    url: DOMAIN,
    logo: `${DOMAIN}/icon.png`,
    email: SUPPORT_EMAIL,
    sameAs: [APP_STORE_URL],
    founder: PUBLISHER,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SUPPORT_EMAIL,
      availableLanguage: [...LOCALES],
    },
  };
}

export function aggregateRatingSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    '@id': `${DOMAIN}/#mobileapp`,
    name: APP_NAME,
    operatingSystem: 'iOS 26',
    applicationCategory: 'UtilitiesApplication',
    url: APP_STORE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: APP_RATING.toFixed(1),
      ratingCount: String(APP_RATING_COUNT),
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function qaPageSchema(opts: {
  question: string;
  answer: string;
  url: string;
  lang: Locale;
  datePublished?: string;
}) {
  const datePublished = opts.datePublished ?? FAQ_PUBLISHED_DATE;
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    inLanguage: opts.lang,
    mainEntity: {
      '@type': 'Question',
      name: opts.question,
      text: opts.question,
      url: opts.url,
      answerCount: 1,
      datePublished,
      author: PUBLISHER,
      acceptedAnswer: {
        '@type': 'Answer',
        text: opts.answer,
        url: opts.url,
        datePublished,
        upvoteCount: 0,
        author: PUBLISHER,
      },
    },
  };
}
