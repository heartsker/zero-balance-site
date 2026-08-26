import {
  APP_STORE_IDENTITY_URL,
  APP_STORE_URL,
  DOMAIN,
  APP_NAME,
  SUPPORT_EMAIL,
  APP_RATING,
  APP_RATING_COUNT,
  LOCALES,
  SOCIAL,
  FAQ_PUBLISHED_DATE,
  type Locale,
} from './siteConfig';
import { stripInlineLinks } from './prose';

const PERSON_ID = `${DOMAIN}/#developer`;
const ORGANIZATION_ID = `${DOMAIN}/#org`;

const PUBLISHER = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Daniel Pustotin',
  url: `${DOMAIN}/en/about/`,
};

const ORGANIZATION_REFERENCE = { '@id': ORGANIZATION_ID };

export function softwareApplicationSchema(opts: {
  description: string;
  lang: Locale;
  featureList?: string[];
  /** Absolute URLs of the optimized hero screenshots (see src/pages/[lang]/index.astro). */
  screenshots: string[];
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
    sameAs: [APP_STORE_IDENTITY_URL],
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
    publisher: ORGANIZATION_REFERENCE,
    author: PUBLISHER,
    brand: ORGANIZATION_REFERENCE,
    featureList: opts.featureList ?? [
      'Manual target helper for any leftover Apple Account balance',
      'Plan review with total, overage and confirmation count',
      'Eight in-app price tiers for precise matching',
      'Private iCloud-synced inventory',
      'No ads, no tracking, no subscriptions',
    ],
    screenshot: opts.screenshots,
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
    publisher: ORGANIZATION_REFERENCE,
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
        text: stripInlineLinks(item.a),
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
    '@id': ORGANIZATION_ID,
    name: APP_NAME,
    alternateName: 'Zero Balance: Spend Credit',
    description: 'Zero Balance helps people plan how to spend a small leftover Apple Account balance through App Store in-app purchases.',
    url: DOMAIN,
    logo: `${DOMAIN}/icon.png`,
    email: SUPPORT_EMAIL,
    sameAs: [APP_STORE_IDENTITY_URL, SOCIAL.github],
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
    publisher: ORGANIZATION_REFERENCE,
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

export function articleSchema(opts: {
  title: string;
  description: string;
  slug: string;
  lang: Locale;
  datePublished: string;
  dateModified?: string;
}) {
  const url = `${DOMAIN}/${opts.lang}/blog/${opts.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    inLanguage: opts.lang,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: PUBLISHER,
    publisher: ORGANIZATION_REFERENCE,
    image: `${DOMAIN}/cover.png`,
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
        text: stripInlineLinks(opts.answer),
        url: opts.url,
        datePublished,
        upvoteCount: 0,
        author: PUBLISHER,
      },
    },
  };
}
