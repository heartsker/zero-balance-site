import { APP_STORE_URL, DOMAIN, APP_NAME, SUPPORT_EMAIL } from './siteConfig';

export function softwareApplicationSchema(opts: {
  description: string;
  lang: 'en' | 'ru';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    operatingSystem: 'iOS',
    applicationCategory: 'UtilitiesApplication',
    description: opts.description,
    inLanguage: opts.lang,
    url: DOMAIN,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      url: APP_STORE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Daniel Pustotin',
    },
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
    name: APP_NAME,
    url: DOMAIN,
    logo: `${DOMAIN}/icon.png`,
    email: SUPPORT_EMAIL,
    sameAs: [APP_STORE_URL],
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
  lang: 'en' | 'ru';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    inLanguage: opts.lang,
    mainEntity: {
      '@type': 'Question',
      name: opts.question,
      url: opts.url,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: opts.answer,
        url: opts.url,
      },
    },
  };
}
