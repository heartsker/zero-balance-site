# Zero Balance — SEO Q&A blog backlog

A daily-ish Q&A blog targeting Apple ecosystem pain points (App Store, Apple ID, payment methods, refunds, gift cards, region changes). Each article is one search-intent question, answered in long form, with the product positioned as the fix where it genuinely helps (balance + country change flows).

## How to use this file

1. Pick the next unstarted article (top of the list = highest priority).
2. Write it as a new Astro page following the conventions below.
3. After it ships, paste a short helpful comment on each linked Reddit thread that points back to the article — only where the article genuinely answers their question.
4. Flip the status box from `☐ not started` to `☑ shipped (YYYY-MM-DD)` and record the live URL.

## Conventions

- **File path:** `src/pages/[lang]/blog/<slug>.astro`
- **URL shape:** `/en/blog/<slug>/` (English only for v1; translations are a separate batch)
- **Layout:** reuse `PageLayout` with `ogType: 'article'`, `publishedTime`, `modifiedTime`
- **Components:** `PageHeader` for hero, `Container` + `Section` for body, `FAQ` for inline Q&A blocks
- **Structured data:** add `articleSchema` + `breadcrumbSchema` from `src/lib/schema.ts`. If the page contains a real Q&A list, also include `qaPageSchema` or `faqSchema`. Add a `BlogPosting` schema helper to `src/lib/schema.ts` the first time it is needed.
- **Meta:** unique `title`, `description`, `keywords` per page. Stay under 60 chars for `title`, 155 for `description`.
- **Internal linking:** every article links to at least one existing product page (e.g. `/en/spend-apple-account-balance/`, `/en/change-apple-id-country-with-balance/`) where contextually relevant. Don't force it.
- **Tone:** plain English, no marketing fluff, no "in this article we will explore". Answer the question in the first paragraph, then explain why.
- **No em dashes anywhere** (per repo CLAUDE.md) — use a hyphen-minus `-`.

## Reddit posting etiquette (read before commenting)

- Do not paste the same comment across threads. Each comment must actually address the OP's specific situation.
- Lead with the answer, then link. Bare links read as spam.
- Disclose: "I work on a small iOS tool for this — full writeup here: <url>." Honesty performs better than stealth and avoids subreddit bans.
- Check the subreddit rules. r/applehelp allows helpful self-promotion in context; some subs do not.
- If a thread is older than ~6 months and already solved, skip it.

---

## Articles

### 1. Apple says I must forfeit my balance to change country - what to actually do
- **Slug:** `forfeit-balance-to-change-apple-id-country`
- **URL:** /en/blog/forfeit-balance-to-change-apple-id-country/
- **Target keywords:** apple id change country balance, forfeit apple account balance, change region apple id remaining credit
- **Reader intent:** They are moving countries (or want to access a different store), Apple's region-change flow says they must give up remaining credit, and they want to keep that money.
- **Outline:**
  - Why Apple blocks region change with a non-zero balance (legal/tax + per-region storefront)
  - The two real options: spend it down to $0.00, or accept forfeiture
  - Walkthrough: spending the balance using IAPs the user actually wants
  - When Zero Balance app helps (finds the IAP combo that lands exactly on $0.00)
  - Edge cases: tiny remainders (<$0.99), subscriptions you must cancel first, family sharing balances
  - What happens after region change to existing apps, subscriptions, purchase history
- **Short answer (TL;DR):** Apple will not change your App Store country while your Apple Account balance is positive, and the balance does not transfer. You have two options: spend it down to exactly $0.00 (the only way to keep the value) or let Apple zero it out and lose it.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1ppfp6e/ - r/applehelp - User in Canada being asked to forfeit $130 to change country.
  - https://reddit.com/r/applehelp/comments/1mq4fsf/ - r/applehelp - Country selection locked despite the user being in a new country.
  - https://reddit.com/r/applehelp/comments/1muj096/ - r/applehelp - US → Sweden mover asking if everything (payment, region) can be switched.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/forfeit-balance-to-change-apple-id-country/

### 2. Trying to buy an app with partial Apple Account balance - how combined payment works
- **Slug:** `apple-account-balance-plus-card-combined-payment`
- **URL:** /en/blog/apple-account-balance-plus-card-combined-payment/
- **Target keywords:** apple account balance plus card, partial balance app store, combine apple credit and credit card
- **Reader intent:** They have, say, $12 credit and want to buy a $30 app or in-app purchase. They don't understand how Apple splits the charge.
- **Outline:**
  - Default behavior: Apple always uses balance first, then the payment method on file
  - When Apple silently skips the balance (subscription with shared-with-family payer; some store types)
  - Receipt anatomy: where to see how the charge was split
  - Why some users see "payment method declined" even though they have enough balance for part of it
  - How to verify balance is being used: account.apple.com → Payment & Shipping
  - Link to product page: spending balance to exactly zero
- **Short answer (TL;DR):** Apple always charges your Apple Account balance first and only bills your payment method for the remainder. If you see a full-amount charge on your card instead, the purchase was made under a different Apple ID, or it was a Family Sharing purchase that uses the organizer's card.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1q6i6ro/ - r/applehelp - User with $12 balance trying to buy a $30 app, doesn't know how Apple combines.
  - https://reddit.com/r/applehelp/comments/1o8zw5m/ - r/applehelp - Confusing interaction between balance and Apple Store pickup.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-account-balance-plus-card-combined-payment/

### 3. Will my subscriptions cancel if I change Apple ID country
- **Slug:** `subscriptions-after-apple-id-country-change`
- **URL:** /en/blog/subscriptions-after-apple-id-country-change/
- **Target keywords:** subscriptions cancel apple id country change, what happens to subscriptions change region, apple id new country existing subscriptions
- **Reader intent:** They want to switch country but are scared they will lose ongoing subscriptions (Apple One, iCloud+, third-party apps).
- **Outline:**
  - Apple's official rule: all active subscriptions must be cancelled before the country change can proceed
  - What "cancel" means: they stay active until the period ends, then do not renew
  - Will the new region let you re-subscribe? Usually yes; pricing and availability differ
  - Apple One specifics
  - iCloud+ specifics (storage stays; billing switches currencies)
  - Family Sharing implications
  - Step-by-step pre-flight checklist
- **Short answer (TL;DR):** Yes - Apple forces you to cancel every active subscription before it will switch your country, and any free trial ends immediately. Cancellation means "no auto-renew"; you keep access until the current period ends, then re-subscribe in the new region if it's available.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1s1cnvv/ - r/applehelp - User uncertain whether subs survive a country change.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/subscriptions-after-apple-id-country-change/

### 4. Apple ID country change requirements - complete 2026 checklist
- **Slug:** `apple-id-country-change-checklist`
- **URL:** /en/blog/apple-id-country-change-checklist/
- **Target keywords:** apple id change country requirements, country change checklist apple, switch app store region steps
- **Reader intent:** First-time region switchers who want one page that lists every box they need to tick.
- **Outline:**
  - Balance at $0.00 (link to article 1)
  - All subscriptions cancelled (link to article 3)
  - Pre-orders cleared
  - Family Sharing implications (organizer vs member)
  - Valid new-country payment method (local card, local PayPal, or "None" if available in that region)
  - Valid new-country billing address
  - Pending store credits and refunds settled
  - Apple Cash and Apple Card constraints (US only)
  - Step-by-step UI walkthrough: account.apple.com vs Settings on iPhone
  - What to do if "Change Country or Region" is greyed out
- **Short answer (TL;DR):** Apple lets you change country only when your balance is $0.00, every subscription is cancelled, pre-orders are cleared, and you have a payment method and billing address valid in the new country. Run through the checklist below before you start - the change cannot be reversed in the same calendar day.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1l71yh8/ - r/applehelp - Region change blocked despite everything looking cancelled.
  - https://reddit.com/r/applehelp/comments/1ns0rix/ - r/applehelp - User describing "region change nightmare" with many failures.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-id-country-change-checklist/

### 5. Why your Apple Account balance is "disabled" and how to fix it
- **Slug:** `apple-account-balance-disabled`
- **URL:** /en/blog/apple-account-balance-disabled/
- **Target keywords:** apple account balance disabled, apple gift card balance disabled, can't use store credit apple
- **Reader intent:** They had credit, suddenly it shows as unusable, and Apple's UI doesn't explain why.
- **Outline:**
  - The three common causes: (a) fraud/chargeback flag, (b) gift-card source flagged after the fact, (c) account-level restriction
  - How to identify which one applies (clues in email + Wallet)
  - Contacting Apple iTunes Store support (the only channel that can lift this)
  - What to prepare: receipt photos, card numbers, ID
  - Realistic timelines (24-72h common, weeks possible)
  - When it is unrecoverable (stolen gift cards, repeated disputes)
- **Short answer (TL;DR):** A disabled Apple Account balance almost always means Apple's fraud system flagged the source - usually a gift card that was later reported stolen, or a chargeback on the card that funded the credit. Only Apple iTunes Store support can restore it; contact them with the original receipt.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1rerraa/ - r/applehelp - User's gift-card balance disabled out of nowhere.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-account-balance-disabled/

### 6. Negative Apple Account balance - what it means and how to clear it
- **Slug:** `negative-apple-account-balance`
- **URL:** /en/blog/negative-apple-account-balance/
- **Target keywords:** negative apple account balance, apple id owes money, can't update apps negative balance
- **Reader intent:** They see a minus sign on their balance and the App Store refuses to update apps until it is cleared.
- **Outline:**
  - How a negative balance happens (failed payment after a successful charge, refund clawback, chargeback reversal)
  - Why Apple blocks updates and new purchases until cleared
  - How to clear it: add a working payment method, then Apple auto-debits
  - What if the card on file is the one that failed? Replace it, then trigger any small purchase
  - Apple's grace period and what happens if you ignore it
  - When to dispute vs pay
- **Short answer (TL;DR):** A negative Apple Account balance means a previous successful purchase later failed to settle (usually a declined card or chargeback reversal). Add a working payment method and Apple will automatically settle the debt; until then, updates and new downloads are blocked.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1ta6fdc/ - r/applehelp - App Store update blocked due to negative balance.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/negative-apple-account-balance/

### 7. Apple ID disabled with no reason - recovery playbook
- **Slug:** `apple-id-disabled-no-reason-recovery`
- **URL:** /en/blog/apple-id-disabled-no-reason-recovery/
- **Target keywords:** apple id disabled, account disabled in app store and itunes, apple id permanently closed
- **Reader intent:** They see "your account has been disabled in the App Store and iTunes" and Apple won't tell them why.
- **Outline:**
  - What "disabled" actually covers (purchasing only vs full Apple ID)
  - Most common triggers Apple won't name: too many refund requests, suspected unauthorized purchases, region/IP anomalies, ToS edge cases
  - The two recovery paths: iforgot.apple.com (auto) and direct iTunes Store support (human)
  - Why "permanent" disable can sometimes be reversed and when it can't
  - Backing up purchases and data while disabled
  - Escalation path: Apple Senior Advisor, written appeal
- **Short answer (TL;DR):** "Account disabled in App Store and iTunes" usually means Apple flagged purchase activity, not your whole Apple ID. Start with iforgot.apple.com to rule out a simple lock, then contact iTunes Store support directly - chat support cannot help with disables, only a Senior Advisor can.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1q1ygpg/ - r/applehelp - Account disabled with no reason given.
  - https://reddit.com/r/applehelp/comments/1qmbfqj/ - r/applehelp - 13-year Apple ID permanently closed.
  - https://reddit.com/r/applehelp/comments/1oqw2e6/ - r/applehelp - Chat support says decision is absolute.
  - https://reddit.com/r/applehelp/comments/1p6n7jr/ - r/applehelp - User asking if they're just out of luck.
  - https://reddit.com/r/applehelp/comments/1r61zoh/ - r/applehelp - Apple Media & Services disabled, refuses to reinstate.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-id-disabled-no-reason-recovery/

### 8. Apple ID locked after verification code loop - how to get back in
- **Slug:** `apple-id-locked-verification-code-loop`
- **URL:** /en/blog/apple-id-locked-verification-code-loop/
- **Target keywords:** apple id locked, verification code loop, apple id sign in loop fix
- **Reader intent:** They keep entering verification codes that Apple says are wrong, and after a few attempts the account locks.
- **Outline:**
  - Why the loop happens (clock drift, autofill grabbing wrong SMS, trusted-device push not arriving)
  - First aid: force-quit Settings/iTunes, enable cellular, get the code from a trusted device's notification (not SMS)
  - When to use iforgot.apple.com to escape the loop
  - Account recovery wait period and what it covers
  - If 2FA trusted phone is no longer yours (foreshadow article in backlog)
  - When to call Apple vs wait
- **Short answer (TL;DR):** Most "verification code" lockouts come from the wrong code source - SMS to an old number or an autofill grabbing an unrelated code. Pull the code from a trusted device's banner instead of typing it; if you're already locked, start account recovery at iforgot.apple.com.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1qu0pp3/ - r/applehelp - Android Apple Music user locked in a verification loop.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-id-locked-verification-code-loop/

### 9. How to get an App Store refund (and what to do when Apple denies it)
- **Slug:** `app-store-refund-denied`
- **URL:** /en/blog/app-store-refund-denied/
- **Target keywords:** app store refund, reportaproblem apple, app store refund denied appeal
- **Reader intent:** They were charged for an app or IAP they don't want and Apple either denied the request or doesn't show a refund button.
- **Outline:**
  - The official channel: reportaproblem.apple.com (not Settings, not chat)
  - What Apple considers valid grounds (unauthorized purchase, undelivered IAP, kid bought it, scam app)
  - What Apple doesn't consider valid (buyer's remorse, "I forgot to cancel")
  - Why a denial happens: too many recent refunds, ineligible category, time elapsed
  - The appeal: re-submitting with a better-written reason
  - When to call your bank instead (last resort; can disable Apple ID)
  - Refund timing - link to article 10
- **Short answer (TL;DR):** Always request through reportaproblem.apple.com, not Settings. If Apple's first automated decision denies you, you can re-submit with a clearer explanation - that second request goes to a human reviewer and is often approved. Chargebacks via your bank work but can disable your Apple ID entirely.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1qp9yjy/ - r/applehelp - Refund denied with no reason.
  - https://reddit.com/r/applehelp/comments/1q2zlxb/ - r/applehelp - User asking the basic "how do I refund" question.
  - https://reddit.com/r/applehelp/comments/1l86t9r/ - r/applehelp - Community warning about strict refund policy.
  - https://reddit.com/r/applehelp/comments/1oo01n0/ - r/applehelp - Refund denied for a copycat "SORA 2" app.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/app-store-refund-denied/

### 10. How long does an Apple subscription refund take
- **Slug:** `apple-subscription-refund-timing`
- **URL:** /en/blog/apple-subscription-refund-timing/
- **Target keywords:** apple refund how long, apple subscription refund time, when will apple refund arrive
- **Reader intent:** Apple approved the refund (or they're waiting on the decision) and they want to know when the money actually lands.
- **Outline:**
  - Decision timeline: instant (auto-approved) vs 24-48h (human reviewer) vs 7+ days (escalation)
  - Money-back timeline by payment method: Apple Account balance (instant), credit card (3-5 business days), debit card (5-10), PayPal (3-7), Apple Pay (depends on funding source)
  - Why "approved" emails sometimes lie about timing
  - What to do if more than 14 days have passed
  - How partial-period subscription refunds work (pro-rated vs full)
- **Short answer (TL;DR):** If Apple refunds to your Apple Account balance, it shows up immediately. Refunds to a credit card take 3-5 business days, debit cards up to 10, and PayPal up to 7. If 14 days have passed and nothing has landed, contact Apple - the refund was approved but never sent.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1nmg4gl/ - r/applehelp - Community asking about sub-24h refunds.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-subscription-refund-timing/

### 11. Subscription still active after payment fails - how long does Apple retry billing
- **Slug:** `apple-subscription-payment-failed-retry`
- **URL:** /en/blog/apple-subscription-payment-failed-retry/
- **Target keywords:** apple subscription payment failed still active, apple retry billing days, billing retry window apple
- **Reader intent:** Their card was declined for an Apple subscription renewal but the subscription still shows active. They want to know what happens next.
- **Outline:**
  - Apple's official grace period (16 days for most subscriptions; some are 7)
  - What Apple does during retry: notifies the user, tries the card 3-4 times, asks for a new payment method
  - The subscription stays active during the retry window
  - What happens after the window expires (subscription pauses, app loses access)
  - How to intentionally let it lapse vs how to keep it
  - Why your bank may show a "pending" charge that never settles
- **Short answer (TL;DR):** Apple keeps a failed-payment subscription active for up to 16 days while it retries the card. You still have full access during that window. If you don't update your payment method, the subscription pauses and you lose access; it can be resumed by paying the past-due amount.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1mcw3x1/ - r/applehelp - Subscription remains active after repeated billing failures.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-subscription-payment-failed-retry/

### 12. "Your purchase could not be completed" - every cause and fix
- **Slug:** `your-purchase-could-not-be-completed`
- **URL:** /en/blog/your-purchase-could-not-be-completed/
- **Target keywords:** your purchase could not be completed, app store purchase error, in app purchase not enabled
- **Reader intent:** Generic App Store / IAP failure message with no detail; they want a checklist of what could be wrong.
- **Outline:**
  - The 6 most common causes: (a) payment method invalid, (b) Apple ID not enabled for purchases, (c) Screen Time / parental controls block, (d) region mismatch between app and account, (e) negative balance, (f) Apple-side outage
  - One-by-one diagnostic: open System Status, then account.apple.com Payment & Shipping, then Screen Time content restrictions
  - "In-app purchases not enabled" specifically: where to toggle it in Settings
  - When restarting the device actually helps (rare, but it does for stale receipts)
  - When it's an app-side bug (StoreKit not initialized in their build)
- **Short answer (TL;DR):** This error is generic on purpose. Step through six things in order: Apple system status, payment method validity, Apple ID purchase enablement, Screen Time restrictions, app/account region match, and account balance state. One of those is almost always the cause.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1ovus4u/ - r/applehelp - Repeated "could not be completed" failures with no detail.
  - https://reddit.com/r/applehelp/comments/1psm164/ - r/applehelp - "Apple account not enabled for in app payments" despite balance.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/your-purchase-could-not-be-completed/

### 13. Payment method declined on Apple ID - full troubleshooting guide
- **Slug:** `apple-id-payment-method-declined`
- **URL:** /en/blog/apple-id-payment-method-declined/
- **Target keywords:** apple id payment method declined, card declined apple, payment authorization failed apple
- **Reader intent:** They added a card to Apple ID, Apple declined it instantly, and the card works everywhere else.
- **Outline:**
  - The Apple $1 auth charge and why some banks block it
  - Billing address mismatch (street format, zip, country)
  - Country mismatch between card-issuing country and Apple ID country
  - 3D Secure / strong customer auth flow blocking the verification
  - Card type restrictions per region (prepaid, virtual cards, etc.)
  - What to try: contact the bank to unblock Apple, switch to PayPal/Apple Pay, use a different card
  - Apple Developer specifically (covered by the linked Reddit case)
- **Short answer (TL;DR):** Apple Authorises a small charge (often $1) to verify the card; if your bank blocks pre-auth charges, Apple shows "declined" even though there's nothing wrong with the card. Call your bank to allow Apple pre-auths, then re-add the card.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1q0eclx/ - r/applehelp - Every payment method failing.
  - https://reddit.com/r/applehelp/comments/1m5fj6q/ - r/applehelp - Apple Developer payment authorization failed.
  - https://reddit.com/r/applehelp/comments/1ky2tx6/ - r/applehelp - Billing address rejected for phone format.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-id-payment-method-declined/

### 14. How to set Apple ID payment method to "None" (and when Apple won't let you)
- **Slug:** `apple-id-payment-method-none`
- **URL:** /en/blog/apple-id-payment-method-none/
- **Target keywords:** apple id no payment method, set payment to none apple, none option missing apple id
- **Reader intent:** They want to remove their card entirely so kids can't buy things, or to prep an Apple ID for a child, and "None" doesn't appear as an option.
- **Outline:**
  - When "None" is available (new Apple IDs in supported regions, accounts with no debt, no active subscriptions)
  - When "None" is hidden (active subscriptions, family payer role, negative balance, region doesn't support it)
  - Step-by-step UI on iPhone (Settings → Apple ID → Payment & Shipping) and on the web
  - Workaround for users in regions that don't show "None": redeem a small gift card to satisfy the balance check
  - Common mistake: deleting the card from Wallet does not remove it from Apple ID
- **Short answer (TL;DR):** "None" only appears when your Apple ID has no active subscriptions, no outstanding balance, and you aren't the Family Sharing payer. Cancel subscriptions, settle the balance, and pass off the payer role - then "None" shows up under Payment & Shipping.
- **Reddit threads to reference & comment on:**
  - (Will collect during writing - several threads in articles 4, 6, 13 touch this.)
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-id-payment-method-none/

### 15. Can you use an Apple gift card for in-app purchases? Yes - here's the catch
- **Slug:** `apple-gift-card-for-in-app-purchases`
- **URL:** /en/blog/apple-gift-card-for-in-app-purchases/
- **Target keywords:** apple gift card in app purchase, gift card for in app purchases ios, redeem apple gift card game
- **Reader intent:** They have an Apple gift card and want to use it for an in-app purchase (coins, subscription, etc.) and aren't sure if it works.
- **Outline:**
  - Yes: Apple gift cards (App Store & iTunes / Apple Account) work for IAPs
  - No: Apple Store gift cards (hardware retail credit) do not work for IAPs
  - How to tell the two apart at a glance
  - Redeem path: Settings → Apple ID → Redeem Gift Card or Code
  - Why a redeemed balance might not be used automatically (rare; usually a subscription with shared-family payer)
  - Game-specific cases (some games gate IAP to specific payment methods - troubleshoot)
- **Short answer (TL;DR):** Yes, Apple Gift Cards (the App Store & iTunes kind) can pay for in-app purchases. The Apple Store gift card - which is for hardware - cannot. The two look similar; check the back of the card or the email for the wording before redeeming.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1qkg4v2/ - r/applehelp - User unsure if gift card works for IAP.
  - https://reddit.com/r/applehelp/comments/1o5qut2/ - r/applehelp - Gift card rejected on a game IAP.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-gift-card-for-in-app-purchases/

### 16. "This gift card has already been redeemed" - what to try before giving up
- **Slug:** `apple-gift-card-already-redeemed`
- **URL:** /en/blog/apple-gift-card-already-redeemed/
- **Target keywords:** apple gift card already redeemed, apple gift card not working, gift card code invalid apple
- **Reader intent:** They scratched the code, entered it, and Apple says it has already been used by someone else.
- **Outline:**
  - Two real causes: (a) the card was activated but the code was harvested and pre-used (most common with stolen-from-rack cards), (b) it was actually never activated by the retailer
  - First check: receipt + serial number on the back
  - The chain of responsibility: retailer (activation), Apple (redemption)
  - How to contact Apple iTunes Store support with the right info to investigate
  - Returning to the retailer (often the fastest path if you have the receipt)
  - Reporting to the FTC / your local consumer agency for fraud
  - Prevention: digital gift cards only, or buy from the back of the rack
- **Short answer (TL;DR):** This usually means scammers harvested the code in-store before you bought the card. Contact Apple iTunes Store support with your receipt and the card serial number; if Apple confirms the activation but says the code is used, return to the retailer for a refund - they activated a tampered card.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1r4citt/ - r/applehelp - Bought a card, code already redeemed.
  - https://reddit.com/r/applehelp/comments/1p10snx/ - r/applehelp - Can't redeem - code not recognized.
  - https://reddit.com/r/applehelp/comments/1m11dzs/ - r/applehelp - Apple repeatedly rejects gift card.
  - https://reddit.com/r/applehelp/comments/1lx4rbt/ - r/applehelp - User victim of gift card scam.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-gift-card-already-redeemed/

### 17. Apple account hacked - lock it down, get refunds, prevent re-entry
- **Slug:** `apple-account-hacked-recovery`
- **URL:** /en/blog/apple-account-hacked-recovery/
- **Target keywords:** apple account hacked, unauthorized apple charges, apple id compromised what to do
- **Reader intent:** Someone got into their Apple ID, ran up charges, possibly bought subscriptions or stole Apple Cash.
- **Outline:**
  - Step 1 (immediate): change password at iforgot.apple.com, sign out of all devices from account.apple.com
  - Step 2: turn on 2FA, switch to a trusted phone number you control
  - Step 3: list the unauthorized charges via reportaproblem.apple.com, request refunds (Apple's fraud team is more lenient than the standard one)
  - Step 4: review and remove unrecognized devices, app-specific passwords, recovery contacts
  - Step 5: revoke "Sign in with Apple" tokens for third-party apps you don't recognize
  - Step 6: alert your bank if the card was used elsewhere
  - Apple Cash scam pattern (the linked Reddit thread is a "TikTok For Business" example)
  - Why standard chat support can't help; how to escalate to Apple Account Security
- **Short answer (TL;DR):** Move fast in this order: change your Apple ID password, sign every device out remotely, enable 2FA on a phone number only you control, then report every unauthorized charge through reportaproblem.apple.com. Apple's fraud team usually refunds confirmed unauthorized purchases; bank disputes should be a last resort because they can disable your Apple ID.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1sai7sh/ - r/applehelp - Hacker stole Apple account.
  - https://reddit.com/r/applehelp/comments/1spb0ip/ - r/applehelp - Compromised account, unknown activity.
  - https://reddit.com/r/applehelp/comments/1qrbgsl/ - r/applehelp - $300 stolen via "TikTok For Business" Apple Cash scam.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/apple-account-hacked-recovery/

### 18. Refunded an in-app purchase but still have it? Here's why
- **Slug:** `refunded-iap-still-have-it`
- **URL:** /en/blog/refunded-iap-still-have-it/
- **Target keywords:** refunded in app purchase still have it, apple refund didn't remove iap, refund still works app
- **Reader intent:** Apple refunded their in-app purchase but the app still grants the feature/coins. They want to know if Apple will claw it back or if it's a free win.
- **Outline:**
  - The technical reason: Apple owns refunds; the app doesn't always know about them
  - Apple's StoreKit 2 Refund Notification - what it does, why some apps ignore it
  - Apps that immediately revoke (most subscription apps)
  - Apps that never revoke (older apps, indie games that never wired up server-side receipts)
  - Will Apple disable your account for this? When yes (pattern of refund abuse) and when no
  - Whether to keep using the feature - ethical and account-safety angles
- **Short answer (TL;DR):** Apple refunds the money but only notifies the app; whether the app revokes the unlock is up to its developers. Old or indie apps often never revoke. Apple will not penalize you for one refund where the app didn't follow through, but a pattern of refund-then-keep is one of the most common triggers for an Apple ID disable.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1rannts/ - r/applehelp - Refund went through but the IAP still works.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/refunded-iap-still-have-it/

### 19. Random charges from Apple you don't recognize - how to identify and stop them
- **Slug:** `unknown-apple-charges`
- **URL:** /en/blog/unknown-apple-charges/
- **Target keywords:** unknown charge apple, apple.com/bill charge, apple charge i didn't make
- **Reader intent:** Their statement shows "APPLE.COM/BILL" charges they don't recognize and they want to know if it's fraud or a forgotten subscription.
- **Outline:**
  - Step 1: identify the charge at reportaproblem.apple.com (lists every Apple charge against your ID, including IAPs and renewals)
  - Step 2: check Family Sharing - one of your family members may have bought something on your card
  - Step 3: check other Apple IDs you've used historically (work accounts, kid accounts)
  - Step 4: if none of those, it's fraud - escalate per the hacked-account guide
  - "Recurring charges from Google via Apple" pattern (covered by the Reddit thread): Google Pay routed through Apple in some regions, and Apple's support will deflect
  - Cross-platform subscription confusion (apps that bill on Stripe vs Apple)
- **Short answer (TL;DR):** Almost every "unknown" Apple charge resolves to one of three things: a forgotten subscription, a Family Sharing member's purchase, or fraud. Start at reportaproblem.apple.com - it lists everything billed against your Apple ID, including IAPs and renewals.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1p649jz/ - r/applehelp - Unwanted recurring deductions.
  - https://reddit.com/r/applehelp/comments/1qhf0cm/ - r/applehelp - Mystery Google charges with Apple support deflecting.
  - https://reddit.com/r/applehelp/comments/1ly84mf/ - r/applehelp - Cancelled order, money not refunded.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/unknown-apple-charges/

### 20. Can't create an Apple ID - every blocker and what to do
- **Slug:** `cant-create-apple-id`
- **URL:** /en/blog/cant-create-apple-id/
- **Target keywords:** can't create apple id, apple id creation failed, won't let me make apple account
- **Reader intent:** Setup keeps failing: email rejected, "this number cannot be used for verification", region issue, or generic "could not be completed".
- **Outline:**
  - The most common blockers: phone number reuse across too many Apple IDs, region-restricted email domains, IP/region mismatch, recently-deleted ID quarantined, age gate (under-13 needs Family setup)
  - Trying from a real device vs a fresh browser - which is more reliable
  - The phone-number reuse limit (Apple doesn't publish it; user reports cluster around 3-5)
  - Workarounds: use a different phone for verification, use a real email (not aliased), try after 24h cooldown
  - When you must contact Apple Account Security (suspicious-IP blocks)
  - For kids: use Family Sharing's "Create Child Account" instead of standalone
- **Short answer (TL;DR):** Apple silently limits how many Apple IDs one phone number can verify, blocks burner email domains, and rejects creation from VPN/region-mismatched IPs. Use a real email, a phone Apple hasn't seen on many accounts, and disable VPN; if it still fails, wait 24 hours and try from a device that has never had an Apple ID on it.
- **Reddit threads to reference & comment on:**
  - https://reddit.com/r/applehelp/comments/1lsgftb/ - r/applehelp - Desperately trying to create an Apple account.
  - https://reddit.com/r/ios/comments/1mo5ed1/ - r/ios - Can't make an Apple ID despite following standard steps.
- **Status:** ☑ shipped (2026-05-19) - https://zerobalance.pro/en/blog/cant-create-apple-id/

---

## Backlog (no full outline yet)

- App Store icon disappeared from iPhone home screen - how to get it back
- Family Sharing payment: who pays for what, and how to hand off the payer role - ☑ shipped (2026-05-27) - https://zerobalance.pro/en/blog/family-sharing-payment-who-pays/ (en + ru)
- Lost trusted phone for Apple 2FA - full account recovery walkthrough
- Apple Developer membership "payment authorization failed" - specifics for the Developer Portal
- Billing address rejected by Apple even though the country is correct - format quirks
- "This app is no longer available" - what it means and how to redownload your purchase
- Apple One sharing: which services your family actually shares vs not
- Pre-orders blocking Apple ID changes - how to find and cancel them - ☑ shipped (2026-05-27) - https://zerobalance.pro/en/blog/pre-orders-blocking-apple-id-country-change/ (en + ru)
- Two Apple IDs - how (and whether) to merge them
- Apple Cash vs Apple Account balance - difference, transfer rules, refund destination - ☑ shipped (2026-05-27) - https://zerobalance.pro/en/blog/apple-cash-vs-apple-account-balance/ (en + ru)
