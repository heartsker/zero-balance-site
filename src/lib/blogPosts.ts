import type { Locale } from '../i18n';

// Single source of truth for the blog listing and cross-links. Each post page
// still owns its own body copy; this manifest carries only the card/navigation
// metadata (title, description, date, category, the locales it is curated in).
// Keep an entry here in sync when adding or translating a post.

export type BlogCategory =
  | 'balance'
  | 'countryChange'
  | 'refunds'
  | 'security'
  | 'payments'
  | 'giftCards'
  | 'family';

export interface BlogPostMeta {
  slug: string;
  /** ISO published date. */
  date: string;
  category: BlogCategory;
  /** Languages this post is curated in (drives the per-locale listing). */
  locales: Locale[];
  title: Partial<Record<Locale, string>>;
  description: Partial<Record<Locale, string>>;
}

/** Human labels per category, shown on cards. Blog ships in en + ru. */
export const CATEGORY_LABELS: Record<BlogCategory, Partial<Record<Locale, string>>> = {
  balance: { en: 'Account balance', ru: 'Баланс аккаунта' },
  countryChange: { en: 'Country change', ru: 'Смена страны' },
  refunds: { en: 'Refunds', ru: 'Возвраты' },
  security: { en: 'Account security', ru: 'Безопасность аккаунта' },
  payments: { en: 'Payments', ru: 'Оплата и покупки' },
  giftCards: { en: 'Gift cards', ru: 'Подарочные карты' },
  family: { en: 'Family Sharing', ru: 'Семейный доступ' },
};

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: 'app-store-refund-denied',
    date: '2026-05-19T00:00:00Z',
    category: 'refunds',
    locales: ['en'],
    title: { en: "How to get an App Store refund (and what to do when Apple denies it)" },
    description: { en: "Apple denied your App Store refund. Here is the channel that actually works, the re-submission trick, and when to escalate vs accept the loss." },
  },
  {
    slug: 'apple-account-balance-disabled',
    date: '2026-05-19T00:00:00Z',
    category: 'balance',
    locales: ['en'],
    title: { en: "Why your Apple Account balance is disabled and how to fix it" },
    description: { en: "Three real causes for a disabled Apple Account balance, how to tell which one applies, and the only path Apple offers to recover it." },
  },
  {
    slug: 'apple-account-balance-glossary',
    date: '2026-05-21T00:00:00Z',
    category: 'balance',
    locales: ['en', 'ru'],
    title: { en: "The Apple Account balance glossary I wish I had at the start", ru: "Глоссарий по балансу Apple Account, которого мне не хватало в начале" },
    description: { en: "Storefront, residue, consumable IAP, region lock - the jargon around Apple Account balance confused me for weeks. Here is every term in plain English, from someone who just wanted their balance gone.", ru: "Сторфронт, остаток, расходуемая встроенная покупка, привязка к региону - терминология вокруг баланса Apple Account путала меня неделями. Вот все термины простыми словами от человека, который просто хотел избавиться от баланса." },
  },
  {
    slug: 'apple-account-balance-plus-card-combined-payment',
    date: '2026-05-19T00:00:00Z',
    category: 'balance',
    locales: ['en'],
    title: { en: "Apple balance plus card: how combined payment works" },
    description: { en: "Apple charges your Apple Account balance first, then bills the card for the remainder. Here is the exact split, how to verify it, and why some charges skip the balance." },
  },
  {
    slug: 'apple-account-hacked-recovery',
    date: '2026-05-19T00:00:00Z',
    category: 'security',
    locales: ['en'],
    title: { en: "Apple account hacked: lock it down, recover funds, prevent re-entry" },
    description: { en: "Your Apple ID is compromised, unauthorized charges are rolling in, and you need to act in the next 30 minutes. Here is the exact order of operations." },
  },
  {
    slug: 'apple-cash-vs-apple-account-balance',
    date: '2026-05-27T00:00:00Z',
    category: 'balance',
    locales: ['en', 'ru'],
    title: { en: "Apple Cash vs Apple Account balance - what the difference actually is", ru: "Apple Cash и баланс Apple Account - в чём реальная разница" },
    description: { en: "Apple Cash and Apple Account balance look similar but are completely separate. Here is what each one can pay for, how refunds choose between them, and why you cannot move money between the two.", ru: "Apple Cash и баланс Apple Account выглядят похоже, но это совершенно разные вещи. Рассказываем, что каждый из них умеет, куда уходят возвраты и почему переводы между ними невозможны." },
  },
  {
    slug: 'apple-gift-card-already-redeemed',
    date: '2026-05-19T00:00:00Z',
    category: 'giftCards',
    locales: ['en'],
    title: { en: "Apple gift card \"already redeemed\": what to try before giving up" },
    description: { en: "Your Apple gift card code shows as already redeemed by someone else. Here is what really happened, who to contact, and the realistic recovery odds." },
  },
  {
    slug: 'apple-gift-card-for-in-app-purchases',
    date: '2026-05-19T00:00:00Z',
    category: 'giftCards',
    locales: ['en'],
    title: { en: "Can you use an Apple gift card for in-app purchases?" },
    description: { en: "Yes, App Store gift cards pay for in-app purchases - but only one of the two Apple gift card types. Here is which works, which does not, and the gotchas." },
  },
  {
    slug: 'apple-id-country-change-checklist',
    date: '2026-05-19T00:00:00Z',
    category: 'countryChange',
    locales: ['en'],
    title: { en: "Apple ID country change checklist (2026)" },
    description: { en: "Every box Apple makes you tick before allowing a country change: balance to zero, subs cancelled, pre-orders cleared, new payment method, address format, and more." },
  },
  {
    slug: 'apple-id-disabled-no-reason-recovery',
    date: '2026-05-19T00:00:00Z',
    category: 'security',
    locales: ['en'],
    title: { en: "Apple ID disabled with no reason: recovery playbook" },
    description: { en: "Account disabled in the App Store and iTunes with no explanation? Here is what Apple actually means, which recovery path works, and when to escalate." },
  },
  {
    slug: 'apple-id-locked-verification-code-loop',
    date: '2026-05-19T00:00:00Z',
    category: 'security',
    locales: ['en'],
    title: { en: "Apple ID locked after verification code loop: how to get back in" },
    description: { en: "Apple keeps rejecting your verification codes and now the account is locked. Here is why the loop happens and how to escape it without losing the account." },
  },
  {
    slug: 'apple-id-payment-method-declined',
    date: '2026-05-19T00:00:00Z',
    category: 'payments',
    locales: ['en'],
    title: { en: "Apple ID payment method declined: full troubleshooting guide" },
    description: { en: "Your card works everywhere else but Apple keeps declining it. Here is why Apple's auth flow fails on cards your bank otherwise approves, and how to fix it." },
  },
  {
    slug: 'apple-id-payment-method-none',
    date: '2026-05-19T00:00:00Z',
    category: 'payments',
    locales: ['en'],
    title: { en: "How to set Apple ID payment method to None (and when Apple blocks it)" },
    description: { en: "The None option only appears when your Apple ID has no active subscriptions, no balance, and no organizer role. Here is how to surface it." },
  },
  {
    slug: 'apple-subscription-payment-failed-retry',
    date: '2026-05-19T00:00:00Z',
    category: 'payments',
    locales: ['en'],
    title: { en: "Apple subscription payment failed: how long does the retry last?" },
    description: { en: "Card declined on an Apple subscription renewal but the subscription still shows active? Here is the 16-day retry window and what happens next." },
  },
  {
    slug: 'apple-subscription-refund-timing',
    date: '2026-05-19T00:00:00Z',
    category: 'refunds',
    locales: ['en'],
    title: { en: "How long does an Apple subscription refund take?" },
    description: { en: "Apple's refund decision and disbursement timelines vary by case and payment method. Here is what to expect from &#34;approved&#34; to &#34;in your bank account&#34;." },
  },
  {
    slug: 'cant-create-apple-id',
    date: '2026-05-19T00:00:00Z',
    category: 'payments',
    locales: ['en'],
    title: { en: "Cannot create an Apple ID: every silent blocker and the fix" },
    description: { en: "Apple ID creation fails with cryptic errors. Here are the rate limits, region rules, and email/phone constraints Apple does not document, plus what works." },
  },
  {
    slug: 'family-sharing-payment-who-pays',
    date: '2026-05-27T00:00:00Z',
    category: 'family',
    locales: ['en', 'ru'],
    title: { en: "Family Sharing payment - who pays for what and how to hand off the payer role", ru: "Семейный доступ и оплата - кто за что платит и как передать роль организатора" },
    description: { en: "The Family Sharing organizer's card is charged for every shared purchase the family makes. Here is what is actually shared, what is not, and the only way to stop being the family payer.", ru: "Карта организатора семейного доступа списывается за все общие покупки семьи. Рассказываем, что реально делится, что нет, и единственный способ перестать быть плательщиком семьи." },
  },
  {
    slug: 'forfeit-balance-to-change-apple-id-country',
    date: '2026-05-19T00:00:00Z',
    category: 'countryChange',
    locales: ['en'],
    title: { en: "Apple says I must forfeit my balance to change country" },
    description: { en: "Apple blocks region change while your Apple Account balance is positive, and the balance does not transfer. Here is how to keep the money instead." },
  },
  {
    slug: 'how-i-cleared-stuck-usd-cents',
    date: '2026-05-21T00:00:00Z',
    category: 'balance',
    locales: ['en', 'ru'],
    title: { en: "How I cleared the stubborn cents stuck on my US Apple Account", ru: "Как я убрал упрямые центы, застрявшие на моём аккаунте Apple в США" },
    description: { en: "I had $0.78 on a US App Store account with no single item priced to match it. Here is exactly how I cleared a small USD remainder to $0.00 without calling Apple.", ru: "На аккаунте App Store в США застряли 0,78 доллара, а отдельного товара под них не было. Рассказываю, как именно я обнулил небольшой долларовый остаток без звонка в Apple." },
  },
  {
    slug: 'how-i-reset-my-apple-id-balance',
    date: '2026-05-21T00:00:00Z',
    category: 'balance',
    locales: ['en', 'ru'],
    title: { en: "How I got my Apple Account balance to exactly $0.00 before moving abroad", ru: "Как я обнулил баланс Apple Account до 0,00 перед переездом" },
    description: { en: "I had $0.78 stuck on my Apple Account and a country change blocked because of it. Here is everything I tried, what failed, and the app that finally cleared it to zero.", ru: "На балансе застряли 0,78 доллара, и из-за них Apple не давала сменить страну. Рассказываю, что я перепробовал, что не сработало и какое приложение в итоге обнулило баланс." },
  },
  {
    slug: 'negative-apple-account-balance',
    date: '2026-05-19T00:00:00Z',
    category: 'balance',
    locales: ['en'],
    title: { en: "Negative Apple Account balance: what it means and how to clear it" },
    description: { en: "A negative Apple balance means a previous purchase failed to settle. Here is why Apple blocks updates, how to clear the debt, and when to dispute instead." },
  },
  {
    slug: 'pre-orders-blocking-apple-id-country-change',
    date: '2026-05-27T00:00:00Z',
    category: 'countryChange',
    locales: ['en', 'ru'],
    title: { en: "Pre-orders are blocking my Apple ID country change - how to find and cancel them", ru: "Предзаказы блокируют смену страны Apple ID - где их найти и как отменить" },
    description: { en: "Apple will not switch your App Store country while you have an active pre-order. Here is exactly where pre-orders hide, how to cancel them, and the propagation delay you need to wait out before retrying.", ru: "Apple не даёт сменить страну App Store, пока есть активный предзаказ. Рассказываем, где предзаказы прячутся, как их отменить и почему после отмены придётся подождать сутки." },
  },
  {
    slug: 'refunded-iap-still-have-it',
    date: '2026-05-19T00:00:00Z',
    category: 'refunds',
    locales: ['en'],
    title: { en: "Refunded an in-app purchase but still have it? Here is why" },
    description: { en: "Apple refunded your IAP but the app still grants the feature. Here is why that happens, whether Apple claws it back, and the account-safety angle." },
  },
  {
    slug: 'subscriptions-after-apple-id-country-change',
    date: '2026-05-19T00:00:00Z',
    category: 'countryChange',
    locales: ['en'],
    title: { en: "Will my subscriptions cancel if I change Apple ID country?" },
    description: { en: "Apple makes you cancel every active subscription before a country change. Here is what cancel actually means, what survives, and how to plan the switch." },
  },
  {
    slug: 'unknown-apple-charges',
    date: '2026-05-19T00:00:00Z',
    category: 'security',
    locales: ['en'],
    title: { en: "Random Apple charges you do not recognize: how to identify them" },
    description: { en: "APPLE.COM/BILL charges you cannot place are almost always a forgotten subscription, a Family Sharing member, or fraud. Here is how to figure out which." },
  },
  {
    slug: 'your-purchase-could-not-be-completed',
    date: '2026-05-19T00:00:00Z',
    category: 'payments',
    locales: ['en'],
    title: { en: "Your purchase could not be completed: every cause and fix" },
    description: { en: "Apple's generic App Store error has six common causes. Step through this diagnostic to find which one applies and what to do about it." },
  },
];

/** Posts available in `lang`, newest first. */
export function postsForLocale(lang: Locale): BlogPostMeta[] {
  return BLOG_POSTS.filter((p) => p.locales.includes(lang)).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

/** Up to `limit` related posts in `lang`: same category first, then newest. */
export function relatedPosts(slug: string, lang: Locale, limit = 3): BlogPostMeta[] {
  const self = BLOG_POSTS.find((p) => p.slug === slug);
  const pool = postsForLocale(lang).filter((p) => p.slug !== slug);
  if (!self) return pool.slice(0, limit);
  const sameCat = pool.filter((p) => p.category === self.category);
  const rest = pool.filter((p) => p.category !== self.category);
  return [...sameCat, ...rest].slice(0, limit);
}

export const localizedTitle = (p: BlogPostMeta, lang: Locale): string =>
  p.title[lang] ?? p.title.en ?? '';

export const localizedDescription = (p: BlogPostMeta, lang: Locale): string =>
  p.description[lang] ?? p.description.en ?? '';
