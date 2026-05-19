# Reddit outreach replies - copy/paste ready

One reply per Reddit thread listed in TODO.md (articles 1-20). Posting order: only post a reply once its target article is shipped (article links 404 otherwise). Wait until the article is live, sanity-check that the OP situation in the thread still matches the draft below, then comment.

## House rules (read first)

- One thread = one tailored reply. Do not paste the same wording across two threads, even if the underlying answer is the same.
- Lead with the answer. Link last.
- Disclose. "I work on a small iOS tool for this, full writeup here: <url>." Honesty performs and avoids subreddit bans.
- Skip if the thread is older than ~6 months and already has an accepted answer.
- If the OP came back and said they fixed it in their own way, do not comment.
- No em dashes anywhere (hyphen-minus only).

---

## Article 1 - forfeit-balance-to-change-apple-id-country

Target URL: https://zerobalance.pro/en/blog/forfeit-balance-to-change-apple-id-country/

### Reply 1.1 - https://reddit.com/r/applehelp/comments/1ppfp6e/

```
Apple is not bluffing about the forfeit screen, but $130 is enough that it's worth spending it down instead of letting Apple zero it out. The region-change flow only checks for exactly $0.00; it does not care how you got there.

Two routes that actually work for a balance that size in Canada:
1. Buy an Apple One subscription, an iCloud+ tier, or a few apps you would have bought anyway. Apple charges balance first, so $130 of digital purchases moves the counter to zero without touching your card.
2. If you do not want to spend $130 on digital goods, you can split it: spend most of it on items you want, then have a card on file absorb the last few dollars by buying any $0.99-$1.99 item.

Apple will not let you transfer it to another Apple ID, and Family Sharing does not share balance, despite what some older threads claim.

I work on a small iOS tool that handles the last-few-cents case once you get under $1. Full writeup of the region-change flow here: https://zerobalance.pro/en/blog/forfeit-balance-to-change-apple-id-country/
```

### Reply 1.2 - https://reddit.com/r/applehelp/comments/1mq4fsf/

```
The country selector ignores where you are physically. It only unlocks once: your balance is $0.00, every subscription is cancelled (not just paused), no pre-orders are pending, and you have a payment method valid in the destination country.

A balance of even one cent will keep that screen greyed out. Check Settings -> [your name] -> Media & Purchases -> View Account. If the balance line is hidden entirely, you are at zero; if any amount shows, that is your blocker.

The other common silent blocker is a subscription you forgot about, including a free-trial Apple One. Subscriptions -> Active should be empty before you try.

I work on a small iOS utility for the leftover-balance step. Full pre-flight checklist for region change: https://zerobalance.pro/en/blog/forfeit-balance-to-change-apple-id-country/
```

### Reply 1.3 - https://reddit.com/r/applehelp/comments/1muj096/

```
Short version for a US to Sweden move:

- Apple ID country: yes, switch, but only after balance is $0.00 and all subs cancelled. The balance does not convert to SEK and does not transfer.
- Payment method: needs to be Swedish-issued (Swedish card, Swedish PayPal, or a Swedish billing address on Apple Pay).
- Apple Cash: US-only. It does not move with you; close it before the switch.
- Existing app purchases and Apple Music library: stay with the Apple ID. You will still have them after the country change.

The annoying part is almost always the balance, especially if you have a leftover under $0.99 from a refund. Apple Support will usually clear small leftovers when the reason is a region change, no need to forfeit.

I work on a small iOS tool for the spend-down step. Full guide here: https://zerobalance.pro/en/blog/forfeit-balance-to-change-apple-id-country/
```

---

## Article 2 - apple-account-balance-plus-card-combined-payment

Target URL: https://zerobalance.pro/en/blog/apple-account-balance-plus-card-combined-payment/

### Reply 2.1 - https://reddit.com/r/applehelp/comments/1q6i6ro/

```
Apple will use the full $12 of balance first and only charge your card the remaining $18. You do not need to do anything special, it happens automatically on confirmation. The receipt that lands in your email afterwards will show the split as "$12.00 from balance, $18.00 charged to card ending XXXX".

The only time this silently fails is:
- The app is a subscription billed under a different family member (organizer pays from their card, not the balance on the buyer's Apple ID).
- The Apple ID has no card on file at all and the purchase is over the balance amount; in that case Apple just refuses.

If the App Store shows a full $30 charge instead of the split, the purchase is probably running on a second Apple ID you forgot you have logged into Media & Purchases.

I work on a small iOS tool for the balance side of this. Full writeup on how Apple combines balance + card: https://zerobalance.pro/en/blog/apple-account-balance-plus-card-combined-payment/
```

### Reply 2.2 - https://reddit.com/r/applehelp/comments/1o8zw5m/

```
Apple Account balance only works for digital purchases (apps, IAPs, subscriptions, Apple Music, iCloud, books, movies). It does not apply to physical pickup at an Apple Store, even though both flows say "Apple". The Apple Store retail side uses your card, Apple Pay, or an Apple Store gift card (different SKU from the App Store gift card).

So if you saw the balance on your Apple ID but it did not reduce the price at pickup, that is expected; the two ledgers are not connected.

For digital purchases, balance is always pulled first, then card. The bill split shows on the receipt email.

I work on a small iOS utility for the digital-balance side. Full explainer on how the two payment paths differ: https://zerobalance.pro/en/blog/apple-account-balance-plus-card-combined-payment/
```

---

## Article 3 - subscriptions-after-apple-id-country-change

Target URL: https://zerobalance.pro/en/blog/subscriptions-after-apple-id-country-change/

### Reply 3.1 - https://reddit.com/r/applehelp/comments/1s1cnvv/

```
You do not lose access immediately. Apple's rule is: every active subscription has to be cancelled before the country change can go through. Cancelled means "will not renew"; you keep access until the current paid period ends.

What this actually looks like:
- Apple One / Apple Music / iCloud+: cancel now, use until period end, resubscribe in the new region (different price, sometimes different bundle).
- Third-party app subscriptions: same flow, but check the app does business in the new region first. Some indie apps are not on every storefront.
- Free trials: end immediately on cancellation, no grace period.

Family Sharing complicates this if you are the organizer; you have to settle that side separately.

I work on a small iOS tool for the leftover-balance step that usually has to happen alongside this. Full subscription-survival guide: https://zerobalance.pro/en/blog/subscriptions-after-apple-id-country-change/
```

---

## Article 4 - apple-id-country-change-checklist

Target URL: https://zerobalance.pro/en/blog/apple-id-country-change-checklist/

### Reply 4.1 - https://reddit.com/r/applehelp/comments/1l71yh8/

```
"Cancelled everything" almost always has one of these missing:
- Balance not at exactly $0.00. Even $0.01 blocks the switch. Settings -> [name] -> Media & Purchases -> View Account.
- A subscription is cancelled but the current paid period has not ended. That still counts as active until the period closes.
- Pre-orders on the App Store, iTunes, or Books. These are silent blockers; check Account -> Purchase History for any pre-order rows.
- Family organizer status (you cannot change country while running a family; transfer the role or dissolve first).
- A pending refund Apple is still processing.

If the button is greyed out but you have zero balance and no active subs, it is one of the last three. Refund pending is the sneakiest because nothing in the UI tells you it is the blocker.

I work on a small iOS tool that handles the balance step. Full pre-flight checklist: https://zerobalance.pro/en/blog/apple-id-country-change-checklist/
```

### Reply 4.2 - https://reddit.com/r/applehelp/comments/1ns0rix/

```
The nightmare loop usually comes from one of three loops:
1. You clear the balance, but Apple credits a tiny pro-rated subscription refund back as store credit, putting you back at $0.03 or similar. Fix: cancel subs first, wait for any pending refunds to land, then clear the balance.
2. You add a payment method valid in the new country, but billing address still maps to the old country (Apple validates the address ZIP/postal format).
3. You hit "Change Country", confirm, then Apple finds another active subscription it did not surface earlier (rare but known).

The order that works most often: cancel all subs -> wait 48 hours for refunds to settle -> clear balance to exactly zero -> add new payment + new billing address -> change country.

I work on a small iOS utility for the balance step. Full step-by-step here: https://zerobalance.pro/en/blog/apple-id-country-change-checklist/
```

---

## Article 5 - apple-account-balance-disabled

Target URL: https://zerobalance.pro/en/blog/apple-account-balance-disabled/

### Reply 5.1 - https://reddit.com/r/applehelp/comments/1rerraa/

```
A gift-card balance going "disabled" without warning is almost always a downstream fraud flag, not a bug on your account. The most common cause: the card you redeemed was bought with a stolen credit card, the chargeback hit weeks later, and Apple clawed back the value automatically.

What to try, in order:
1. reportaproblem.apple.com -> contact Apple iTunes Store support (not the Apple Store retail chat, those are separate teams).
2. Have ready: the original receipt from where you bought the card, the card serial number, and the date you redeemed.
3. If you bought it from a legitimate retailer with a receipt and the card was not stolen, Apple will sometimes restore it. If not, take the receipt back to the retailer for a refund; they activated a compromised card.

I work on a small iOS tool for cleared-balance use cases. Full breakdown of the three reasons Apple disables balance: https://zerobalance.pro/en/blog/apple-account-balance-disabled/
```

---

## Article 6 - negative-apple-account-balance

Target URL: https://zerobalance.pro/en/blog/negative-apple-account-balance/

### Reply 6.1 - https://reddit.com/r/applehelp/comments/1ta6fdc/

```
A negative balance means a previous purchase succeeded at confirmation time but the card later failed to settle (decline, chargeback reversal, or expired card). Apple blocks further downloads and updates until that debt clears.

Fastest fix:
1. Settings -> [name] -> Payment & Shipping -> add a working card or Apple Pay.
2. Trigger any small purchase (a $0.99 app, or even tap "Update All" in App Store). Apple uses the new card to settle the negative amount automatically.
3. Balance should snap to $0.00 within a few minutes.

If updating fails with the same error after adding a new card, the new card was rejected too. The auth charge (usually $1 USD equivalent) sometimes gets blocked by the issuing bank; calling the bank to allow Apple pre-auths fixes it.

I work on a small iOS tool for the positive side of leftover balance. Full negative-balance writeup: https://zerobalance.pro/en/blog/negative-apple-account-balance/
```

---

## Article 7 - apple-id-disabled-no-reason-recovery

Target URL: https://zerobalance.pro/en/blog/apple-id-disabled-no-reason-recovery/

### Reply 7.1 - https://reddit.com/r/applehelp/comments/1q1ygpg/

```
"Disabled" usually means disabled for purchases, not the entire Apple ID. The Apple ID itself often still works for iCloud, Messages, and sign-in; only the App Store / iTunes side is locked.

Two recovery paths, in order:
1. iforgot.apple.com - rules out a simple sign-in lock that resets when you change your password.
2. If that does not clear it, contact iTunes Store support directly (not Apple Care chat - that team cannot lift a purchase disable). Ask explicitly for a Senior Advisor; the front-line agents will tell you it is final, which is often not the case.

Bring: dates of any recent refund requests, any unrecognized purchases you reported, and your iPhone serial if Apple asked you to verify ownership.

A pattern of refunds is the most common silent trigger. Bank chargebacks too, even if Apple "approved" the refund, because they fight back later.

I work on a small iOS tool for the post-recovery balance step. Full recovery playbook: https://zerobalance.pro/en/blog/apple-id-disabled-no-reason-recovery/
```

### Reply 7.2 - https://reddit.com/r/applehelp/comments/1qmbfqj/

```
A 13-year account being closed is brutal, especially when Apple will not name a reason. The "permanent" wording is intentional and the front-line script does not allow exceptions, but Senior Advisors at iTunes Store support occasionally reverse it.

What has worked for other long-term users:
1. Submit a written appeal through iTunes Store support, not chat. Reference your account age, your purchase history total, and explicitly request escalation to a Senior Advisor.
2. If you have an active App Store developer account on the same Apple ID, mention it; developer-side accounts get reviewed separately.
3. If the close was triggered by a chargeback you did not initiate, the bank can sometimes write a letter clarifying the dispute; Apple has restored accounts on that evidence.

Back up everything (purchases, photos, contacts) while you wait. The disable does not erase your iCloud data.

I work on a small iOS tool for the balance-cleanup side. Full disabled-account recovery writeup: https://zerobalance.pro/en/blog/apple-id-disabled-no-reason-recovery/
```

### Reply 7.3 - https://reddit.com/r/applehelp/comments/1oqw2e6/

```
Chat support genuinely cannot lift a disable. They are not stonewalling; their tooling does not have the permission. The team that can is iTunes Store support's Senior Advisors, and the only ways to reach them are:

1. Call AppleCare and explicitly ask for "iTunes Store Senior Advisor". Refuse the offer to be transferred to general AppleCare.
2. Or open a written case via getsupport.apple.com -> "Apple ID is disabled" topic, and reply to the initial response asking for escalation.

The reason "final" sometimes is not final: front-line decisions follow a script. Senior Advisors can review context (account age, dispute history, evidence of compromise). The disable rate of overturn is low but non-zero.

Do not file a bank chargeback while disabled; it locks the file permanently.

I work on a small iOS tool for the balance side. Full Senior-Advisor escalation guide: https://zerobalance.pro/en/blog/apple-id-disabled-no-reason-recovery/
```

### Reply 7.4 - https://reddit.com/r/applehelp/comments/1p6n7jr/

```
Not necessarily out of luck, but the path is narrow.

Things that improve the odds:
- Apple ID at least a few years old with real purchase history.
- No recent refund requests (in the last 60-90 days).
- No active bank dispute on any Apple charge.
- You can describe the activity Apple is concerned about without guessing.

Things that close the door:
- Multiple refund-and-keep cycles (refunded a purchase but app still works).
- Chargeback that was reversed by your bank.
- Family member made unauthorized purchases that were then refunded.

Path: getsupport.apple.com -> Apple ID is disabled -> request callback -> ask for Senior Advisor escalation by name. Front-line agents will say it is final. Senior Advisors can re-review.

I work on a small iOS tool for balance cleanup. Full walkthrough of the recovery flow: https://zerobalance.pro/en/blog/apple-id-disabled-no-reason-recovery/
```

### Reply 7.5 - https://reddit.com/r/applehelp/comments/1r61zoh/

```
"Apple Media & Services disabled" is the official wording for the purchase-side disable. The rest of the Apple ID (iCloud, Messages, Find My) typically still works.

When the refusal-to-reinstate sticks, it almost always means one of:
- A confirmed chargeback (not just a dispute) that Apple paid out.
- A pattern of refund requests Apple's fraud system flagged.
- The Apple ID was used to redeem gift cards Apple later identified as stolen.

If none of those apply to you, the right escalation path is iTunes Store support -> Senior Advisor, in writing through getsupport.apple.com. Include: account age, total lifetime spend, dispute history, and any specific charges you want investigated. Front-line chat cannot do anything here; they will keep saying "final" even when escalation would help.

I work on a small iOS tool for the balance side. Full Media & Services recovery writeup: https://zerobalance.pro/en/blog/apple-id-disabled-no-reason-recovery/
```

---

## Article 8 - apple-id-locked-verification-code-loop

Target URL: https://zerobalance.pro/en/blog/apple-id-locked-verification-code-loop/

### Reply 8.1 - https://reddit.com/r/applehelp/comments/1qu0pp3/

```
On Android-only setups, the verification loop happens because the code Apple sends to your trusted phone number arrives by SMS, and a different code (the one Apple actually wants) gets pushed to a trusted Apple device you do not have. The two look identical and the wrong one fails silently.

For Android-only Apple Music users:
1. Sign in at appleid.apple.com from a desktop browser. That flow lets you receive the code by SMS as the only option.
2. If you are already locked, use iforgot.apple.com to start account recovery. The wait can be a few days but it is the only way without a trusted Apple device.
3. Long-term, set up a trusted phone number you fully control (not a family member's), and consider a recovery contact who has an Apple device.

I work on a small iOS tool unrelated to lockouts, but the same write-up covers the trusted-device problem: https://zerobalance.pro/en/blog/apple-id-locked-verification-code-loop/
```

---

## Article 9 - app-store-refund-denied

Target URL: https://zerobalance.pro/en/blog/app-store-refund-denied/

### Reply 9.1 - https://reddit.com/r/applehelp/comments/1qp9yjy/

```
The first decision on reportaproblem.apple.com is automated. "Denied with no reason" almost always means the auto-decision bucketed it under "ineligible category" (buyer's remorse, time elapsed, or too many recent refunds), not because the case has no merit.

Re-submit the same request through reportaproblem.apple.com with a clearer reason. The re-submission routes to a human reviewer and is approved more often than the first pass. Useful framings: unauthorized purchase, undelivered content, scam app, charged for a free trial that did not get cancelled before renewal. Avoid "I changed my mind" or "I forgot".

If the second attempt also denies, escalate via getsupport.apple.com -> Subscriptions and Purchases -> Speak with a Senior Advisor. Avoid bank chargebacks; they can disable the Apple ID.

I work on a small iOS tool for the balance side after a refund lands. Full denial-appeal walkthrough: https://zerobalance.pro/en/blog/app-store-refund-denied/
```

### Reply 9.2 - https://reddit.com/r/applehelp/comments/1q2zlxb/

```
The official channel is reportaproblem.apple.com. Settings on iPhone has a "report a problem" link that goes to the same place, but starting from the website is faster.

Flow:
1. Sign in with the Apple ID that made the purchase.
2. Find the line item.
3. Click "Report a Problem", pick a reason from the dropdown.
4. Wait for the decision email (anywhere from instant to 48 hours).

Valid reasons Apple actually approves: unauthorized purchase, didn't mean to buy, content didn't load, kid bought it, free-trial-to-paid you wanted to cancel. Avoid pure buyer's remorse - Apple's policy is strict there.

If approved, the refund lands back where you paid from (card 3-5 business days; balance instant).

I work on a small iOS tool for the leftover-balance case that pops up after refunds. Full refund + denial guide: https://zerobalance.pro/en/blog/app-store-refund-denied/
```

### Reply 9.3 - https://reddit.com/r/applehelp/comments/1l86t9r/

```
Apple's refund policy is strict on paper but the practical bar is lower than it looks if you frame the reason right.

What still works in 2026:
- Auto-renew you wanted to cancel: framed as "did not realize subscription would renew" -> usually approved on first try.
- Kid's purchases on a shared family device: approved at very high rate.
- App that does not actually deliver what was promised in the App Store description: approved when you describe specifically what was missing.
- Free trial that converted: approved if requested within ~14 days of conversion.

What rarely works:
- "I do not want it anymore" (buyer's remorse).
- Anything older than ~90 days.
- More than 3-4 refund requests in 12 months (Apple's fraud system starts blocking).

I work on a small iOS tool for the post-refund balance step. Full breakdown: https://zerobalance.pro/en/blog/app-store-refund-denied/
```

### Reply 9.4 - https://reddit.com/r/applehelp/comments/1oo01n0/

```
Copycat apps (the "SORA 2" wave, fake ChatGPT clones, fake DeepSeek apps) are a known refund category for Apple, but the first auto-denial is common because the system does not know the app is a clone.

Re-submit through reportaproblem.apple.com and use the reason "the item is not as described". In the free-text field, describe specifically: the app branded itself as OpenAI Sora / Sora 2, the actual OpenAI product is currently not on the App Store via this developer, and the app delivers something different (or nothing). Mention the App Store listing URL of the real-vs-fake mismatch if you have it.

That re-submission goes to a human reviewer. Approval rate for clearly misleading apps is high. If you have screenshots of the listing claims vs the actual app, attach them in the escalation chat at getsupport.apple.com.

I work on a small iOS tool for the post-refund balance step. Full appeal flow: https://zerobalance.pro/en/blog/app-store-refund-denied/
```

---

## Article 10 - apple-subscription-refund-timing

Target URL: https://zerobalance.pro/en/blog/apple-subscription-refund-timing/

### Reply 10.1 - https://reddit.com/r/applehelp/comments/1nmg4gl/

```
Sub-24-hour refunds happen for the simple cases (recent purchase, clear reason, low refund history on the account). The auto-approver kicks in within minutes for those.

Timeline by case:
- Auto-approved: decision email within minutes; money lands instantly if going back to Apple Account balance, or 3-5 business days if going back to a card.
- Human reviewer queue: 24-48 hours for the decision; same return-to-source timing after that.
- Escalated to a Senior Advisor: 5-7 days for the decision.

Where it lands also depends on how you paid. Cards: 3-5 business days. Debit cards: up to 10. PayPal: 3-7. Apple Account balance: instant.

If you got the "approved" email more than 14 days ago and nothing has landed on the card, contact iTunes Store support; the refund was approved but the disbursement got stuck.

I work on a small iOS tool for the case where Apple credits the refund to balance and now you cannot spend it. Full timing breakdown: https://zerobalance.pro/en/blog/apple-subscription-refund-timing/
```

---

## Article 11 - apple-subscription-payment-failed-retry

Target URL: https://zerobalance.pro/en/blog/apple-subscription-payment-failed-retry/

### Reply 11.1 - https://reddit.com/r/applehelp/comments/1mcw3x1/

```
A failed renewal does not pause the subscription immediately. Apple keeps it active for up to 16 days while it retries the card 3-4 times and emails you to update your payment method. The subscription stays fully active during that retry window, which is why it still shows as "active" in your account even though no money moved.

What happens if you do nothing:
- Apple retries the same card at intervals (roughly daily, then less often).
- At the end of the window (16 days for most subs, 7 for some), the subscription pauses and the app loses access.
- You can still resume by paying the past-due amount and re-activating.

If you want to keep it: add a working card before the window ends. If you want it gone: do not update the card; let Apple time it out.

I work on a small iOS tool for the leftover-balance side. Full retry-window writeup: https://zerobalance.pro/en/blog/apple-subscription-payment-failed-retry/
```

---

## Article 12 - your-purchase-could-not-be-completed

Target URL: https://zerobalance.pro/en/blog/your-purchase-could-not-be-completed/

### Reply 12.1 - https://reddit.com/r/applehelp/comments/1ovus4u/

```
"Your purchase could not be completed" is intentionally generic. Six things cause it, in roughly this frequency:

1. Payment method invalid (expired card, address mismatch). Check account.apple.com -> Payment & Shipping.
2. Apple ID not enabled for purchases (rare, but happens after a recent dispute).
3. Screen Time / Content & Privacy Restrictions blocking In-App Purchases.
4. Region mismatch (the app or IAP is not sold in your storefront).
5. Negative Apple Account balance from a previously declined card.
6. Apple-side outage. Check system.apple.com.

Step through in that order. Most repeating-failure cases are #1 or #5. Restarting the device occasionally helps if the StoreKit receipt cache got stale, but that is the last thing to try.

I work on a small iOS tool that runs into this error category often. Full six-step diagnostic: https://zerobalance.pro/en/blog/your-purchase-could-not-be-completed/
```

### Reply 12.2 - https://reddit.com/r/applehelp/comments/1psm164/

```
"Account not enabled for in-app payments" while you have a positive balance is one of these:

1. Screen Time -> Content & Privacy Restrictions -> iTunes & App Store Purchases -> In-App Purchases is set to Don't Allow. Most common on family/kids devices, less obvious on a single-user phone if Screen Time was set up long ago.
2. Apple ID is region-mismatched against the device's storefront. App expects USD, account is on a different storefront.
3. The Apple ID is the family member side and the family payer disabled IAPs via Ask to Buy.
4. The IAP itself is region-restricted (rare, but real for some apps).

The balance is unrelated to this error. Apple checks the IAP permission first, balance second.

Settings -> Screen Time is the first place to look. If Screen Time is off entirely, it is one of the other three.

I work on a small iOS tool that hit this exact error category. Full troubleshooting: https://zerobalance.pro/en/blog/your-purchase-could-not-be-completed/
```

---

## Article 13 - apple-id-payment-method-declined

Target URL: https://zerobalance.pro/en/blog/apple-id-payment-method-declined/

### Reply 13.1 - https://reddit.com/r/applehelp/comments/1q0eclx/

```
When every card fails on Apple but works elsewhere, the failure is almost always at the auth-charge step, not the card.

Apple authorizes a small amount (usually $1 USD equivalent) to validate the card. Banks routinely block these because:
- Apple's auth is a "no-billing-address" type the bank flags.
- The card has international purchase blocking on by default.
- Your billing address format on file with Apple does not match what the bank has (street number style, postal code spacing).

What to try, in order:
1. Call the bank for each card and ask them to whitelist Apple pre-auths.
2. Try Apple Pay (different auth path; sometimes succeeds when card-on-file fails).
3. Try PayPal as an Apple payment method, if available in your region.
4. As a workaround, redeem a small Apple gift card to seed the balance and skip the card auth entirely.

I work on a small iOS tool for the balance-side use case. Full troubleshooting matrix: https://zerobalance.pro/en/blog/apple-id-payment-method-declined/
```

### Reply 13.2 - https://reddit.com/r/applehelp/comments/1m5fj6q/

```
Apple Developer payment auth is stricter than the regular App Store one. The same card can pass App Store and still fail Developer.

Common Developer-specific causes:
1. Card name must exactly match the legal entity name on the developer account (typos in middle initial, accented characters).
2. Billing address country must match the country listed on the developer agreement, not the country on the Apple ID.
3. Some prepaid and virtual cards (Revolut, Wise) are accepted by App Store but rejected by Developer Portal.
4. Apple charges the full $99 (or local equivalent) up-front; a card with daily online-spend limits below that will reject.

Path forward: try a regular major-issuer credit card with the legal name exactly as on the developer agreement. If you are converting an individual account to an organization, the card name must match the new entity, not your personal name.

I work on a small iOS tool unrelated to Developer enrollment. Full payment-method declined writeup: https://zerobalance.pro/en/blog/apple-id-payment-method-declined/
```

### Reply 13.3 - https://reddit.com/r/applehelp/comments/1ky2tx6/

```
Apple's billing-address validator is strict about local format. The phone-format rejection usually means the field expects E.164 (+1 555 555 5555) or the local format for the billing country, and your input has the wrong dialing code or extra punctuation.

What works:
1. Match the exact format the country uses (UK: +44 7XXX XXXXXX without leading zero; US: +1 (XXX) XXX-XXXX; Russia: +7 XXX XXX XX XX).
2. If you are entering the address from a different country than the card is issued in, the validator pulls the format rules from the billing country, not your locale.
3. Some Apple ID flows reject international characters in the street name; transliterate to ASCII for the address line only.

If the country selector on Apple's side does not include your billing country (rare for major countries, common for some Gulf states), that is a separate problem requiring Apple Account Security.

I work on a small iOS tool for the post-payment-fixed balance step. Full address-rejection guide: https://zerobalance.pro/en/blog/apple-id-payment-method-declined/
```

---

## Article 15 - apple-gift-card-for-in-app-purchases

Target URL: https://zerobalance.pro/en/blog/apple-gift-card-for-in-app-purchases/

### Reply 15.1 - https://reddit.com/r/applehelp/comments/1qkg4v2/

```
Short answer: yes, Apple gift cards (the App Store & iTunes / Apple Account variety) work for in-app purchases. They are functionally identical to balance from any other source once redeemed.

The catch is which gift card you have:
- Apple Gift Card (App Store & iTunes / Apple Account): works for apps, IAPs, subscriptions, Apple Music, iCloud, books, movies. This is what you want.
- Apple Store gift card: works only at retail apple.com and Apple Stores for hardware. Does not work for digital purchases or IAPs.

The two look similar in packaging but the small print on the back says which kind it is. The redemption code on the App Store one starts with an X.

To redeem: Settings -> [your name] -> Redeem Gift Card or Code, or open App Store and tap "Redeem Gift Card or Code" from your profile menu.

I work on a small iOS tool for the leftover-balance side. Full gift-card-for-IAP writeup: https://zerobalance.pro/en/blog/apple-gift-card-for-in-app-purchases/
```

### Reply 15.2 - https://reddit.com/r/applehelp/comments/1o5qut2/

```
A redeemed gift card balance should pay for IAPs in any game. When it fails, it is one of:

1. The game is a Family Sharing subscription, billed under the organizer's payment method, not the buyer's balance. Apple ignores the buyer's balance in that case.
2. Screen Time -> In-App Purchases is set to Don't Allow.
3. The game's IAP is in a different storefront from the Apple ID. Some games region-restrict premium IAPs.
4. The Apple ID has a negative balance offsetting the gift-card credit (rare).

Check Settings -> Media & Purchases -> View Account first to confirm the gift-card balance actually landed where you think it did. If you redeemed on the wrong Apple ID (common on shared devices), it is sitting on a different account.

I work on a small iOS tool for the balance side. Full IAP-rejection diagnostic: https://zerobalance.pro/en/blog/apple-gift-card-for-in-app-purchases/
```

---

## Article 16 - apple-gift-card-already-redeemed

Target URL: https://zerobalance.pro/en/blog/apple-gift-card-already-redeemed/

### Reply 16.1 - https://reddit.com/r/applehelp/comments/1r4citt/

```
"Already redeemed" on a card you just bought almost always means in-store skimming. Scammers photograph or scan codes on cards still on the rack, then drain them as soon as the retailer activates them. You bought a card whose code had already been harvested.

Action order:
1. Take the receipt and the card back to the retailer. They activated a compromised card; many retailers will refund.
2. In parallel, contact Apple iTunes Store support with the card serial number and your receipt. Apple sometimes restores the balance if the redemption activity looks suspicious.
3. If neither works, file with the FTC (US) or your local consumer agency; this fraud pattern is tracked.

Future prevention: digital gift cards eliminate the skimming risk entirely. If buying physical, take one from the back of the rack and check for tampering on the foil.

I work on a small iOS tool for the leftover-balance case after a working redemption. Full already-redeemed walkthrough: https://zerobalance.pro/en/blog/apple-gift-card-already-redeemed/
```

### Reply 16.2 - https://reddit.com/r/applehelp/comments/1p10snx/

```
"Code not recognized" is different from "already redeemed" and the cause is usually different too. Three real possibilities:

1. The retailer never activated the card. The barcode on the receipt confirms activation; if no Apple gift card line is there, the card is a blank piece of plastic. Return to the retailer.
2. You are entering the code in the wrong storefront. The card is locked to the country it was sold in; a US card cannot be redeemed on a non-US Apple ID.
3. The code includes characters you are mis-reading (0 vs O, 1 vs I, 5 vs S). The Apple Gift Card code is X followed by 15 characters; if yours does not start with X, it is the Apple Store retail card, which does not redeem here.

For #1, the retailer's POS log shows whether activation went through. Bring the receipt.

I work on a small iOS tool for the leftover-balance side. Full not-recognized guide: https://zerobalance.pro/en/blog/apple-gift-card-already-redeemed/
```

### Reply 16.3 - https://reddit.com/r/applehelp/comments/1m11dzs/

```
Repeated rejections of a gift card on Apple's side typically come down to one of three causes, in order of likelihood:

1. Storefront mismatch. The card is denominated in one country's currency and your Apple ID is in another. A US-store card cannot be redeemed on a UK Apple ID and vice versa.
2. The card was never activated by the retailer (the POS scan never went through). Receipt will tell you.
3. You are entering the redemption code from the wrong product. Apple Store retail gift cards (for hardware) and Apple Gift Cards (for App Store / iTunes) are different SKUs and the codes do not cross.

If you are sure on all three, contact Apple iTunes Store support with the card serial number and date of purchase. Front-line chat cannot validate a code; iTunes Store support can.

I work on a small iOS tool for the balance side after redemption. Full rejection-diagnostic walkthrough: https://zerobalance.pro/en/blog/apple-gift-card-already-redeemed/
```

### Reply 16.4 - https://reddit.com/r/applehelp/comments/1lx4rbt/

```
The Apple gift card scam pattern usually goes: scammer impersonates a real authority (Apple, IRS, an employer, a romance contact), pressures you to buy Apple gift cards as "payment", asks for the codes by phone or screenshot. Once they have the code, they drain it within minutes; Apple cannot reverse the redemption.

What still has a chance:
1. Report to Apple iTunes Store support immediately. If the code has not been redeemed yet, Apple can deactivate it. After redemption, recovery rate is very low.
2. File with the FTC at reportfraud.ftc.gov (or your local equivalent) and with local police. Some retailers have refunded victims when they have a police report.
3. Notify the retailer. Some chains (Target, Walmart) have started flagging suspicious gift-card buy patterns.

This is one of the worst Apple gift card categories because the loss is real money, not balance. No tool fixes it after the fact, but reporting helps stop the next person.

I work on a small iOS tool for the legitimate-balance case. Full scam-recovery writeup: https://zerobalance.pro/en/blog/apple-gift-card-already-redeemed/
```

---

## Article 17 - apple-account-hacked-recovery

Target URL: https://zerobalance.pro/en/blog/apple-account-hacked-recovery/

### Reply 17.1 - https://reddit.com/r/applehelp/comments/1sai7sh/

```
Move in this order, fast:

1. iforgot.apple.com -> change password. Use a unique one, not derived from any password you have used elsewhere.
2. account.apple.com -> Devices -> sign out every device you do not recognize.
3. Confirm trusted phone number is one you currently control (not a leftover from years ago). Remove anything you do not recognize.
4. reportaproblem.apple.com -> list every unauthorized charge. Apple's fraud team has higher refund approval than the standard one; do not lump it as "buyer's remorse".
5. account.apple.com -> Sign in with Apple -> revoke any third-party app tokens you do not recognize.
6. If a card on the account was used elsewhere too, alert your bank.

Do not file a chargeback through the bank for Apple charges. It usually disables the Apple ID and you lose recovery leverage.

I work on a small iOS tool for the balance-cleanup step after recovery. Full account-hacked playbook: https://zerobalance.pro/en/blog/apple-account-hacked-recovery/
```

### Reply 17.2 - https://reddit.com/r/applehelp/comments/1spb0ip/

```
Unknown activity is usually one of three:
1. Actually compromised: someone signed in from a new device and ran purchases.
2. Family Sharing member made purchases on the organizer's card.
3. Stored payment method was charged by a forgotten subscription renewal.

Differentiate fast:
- account.apple.com -> Devices: anything you do not own listed?
- reportaproblem.apple.com lists every charge against your Apple ID, including IAPs and renewals. If a charge appears there, it ran through your Apple ID. If a charge is on your card but not in reportaproblem, it is not Apple; it is a merchant using "Apple Pay" branding.
- Family Sharing -> Members: if any member shows recent purchases, that is where the charge came from.

If genuinely compromised, the recovery order is: change password, sign out all devices, turn on 2FA on a phone you control, then file fraud refunds at reportaproblem.apple.com.

I work on a small iOS tool for the post-recovery balance step. Full compromised-account walkthrough: https://zerobalance.pro/en/blog/apple-account-hacked-recovery/
```

### Reply 17.3 - https://reddit.com/r/applehelp/comments/1qrbgsl/

```
The "TikTok For Business" via Apple Cash scam works because Apple Cash is a real Apple product and the merchant name shows as something legitimate-looking. Once Apple Cash leaves your account, recovery is extremely hard; it operates more like a bank transfer than a card purchase.

Action order:
1. Report unauthorized transactions in the Wallet app -> Apple Cash card -> tap the transaction -> Report an Issue. Apple's Apple Cash team is separate from iTunes Store support.
2. Change your Apple ID password and sign out of every device. The scammer may still have access.
3. Contact Goldman Sachs (Apple Cash's issuing bank) directly if Apple's report does not produce a refund within 7 days. They have their own dispute process.
4. File with the FTC and local police; Apple Cash fraud is part of a tracked pattern.
5. Disable Apple Cash temporarily so no further drains can happen.

Apple Cash recovery rate is lower than App Store fraud recovery because the money has already left. Document everything.

I work on a small iOS tool unrelated to Apple Cash. Full hacked-account recovery flow: https://zerobalance.pro/en/blog/apple-account-hacked-recovery/
```

---

## Article 18 - refunded-iap-still-have-it

Target URL: https://zerobalance.pro/en/blog/refunded-iap-still-have-it/

### Reply 18.1 - https://reddit.com/r/applehelp/comments/1rannts/

```
Apple owns the refund; the app owns whether to revoke the unlock. Apple sends a refund notification to the app via StoreKit 2, but it is the app developer's choice to listen for it. Most subscription apps revoke immediately. Older indie games and apps that predate StoreKit 2 often never revoke.

Practical implications:
- One-off case where the app did not revoke: Apple will not penalize you. It is the developer's responsibility to wire up the notification.
- A pattern of refund-then-keep across multiple apps: this is one of the most common silent triggers for an Apple Account purchase disable. Apple's fraud system pattern-matches it.

If you want to be on the safe side, do not use a feature you got a refund on. If you keep using it, you carry some risk on future refund requests being denied automatically.

I work on a small iOS tool for the balance side. Full refund-vs-unlock writeup: https://zerobalance.pro/en/blog/refunded-iap-still-have-it/
```

---

## Article 19 - unknown-apple-charges

Target URL: https://zerobalance.pro/en/blog/unknown-apple-charges/

### Reply 19.1 - https://reddit.com/r/applehelp/comments/1p649jz/

```
Recurring "APPLE.COM/BILL" charges almost always resolve to one of three things:

1. Forgotten subscription. reportaproblem.apple.com -> sign in -> filter by Subscriptions. Even free trials that converted show here. Cancel from Settings -> [your name] -> Subscriptions.
2. Family Sharing purchase. If you are the organizer, any member's purchase charges your card. Family -> [member] -> Purchase History.
3. Second Apple ID. Check whether Settings -> Media & Purchases shows the same Apple ID as iCloud. Many people have a leftover Apple ID from years ago still tied to the same payment method.

If none of the three matches, it is fraud. Change the password, sign out all devices, and file unauthorized-charge refund requests at reportaproblem.apple.com.

Stop the recurrence first (cancel the sub or remove the card from the unknown Apple ID), then sort out refunds.

I work on a small iOS tool for the balance side. Full unknown-charges identification flow: https://zerobalance.pro/en/blog/unknown-apple-charges/
```

### Reply 19.2 - https://reddit.com/r/applehelp/comments/1qhf0cm/

```
"Google charges showing as Apple" usually means the merchant is a Google product (YouTube Premium, Google One, a Google Play game) that you subscribed to via the App Store, not via Google's own billing. The descriptor on your statement says "APPLE.COM/BILL" because Apple is the merchant of record.

Where to look:
1. Settings -> [your name] -> Subscriptions. Any active Google-product subscription shows here.
2. reportaproblem.apple.com lists every Apple-billed charge with the underlying product name. Google YouTube Premium, Google One, etc., appear clearly.
3. If the charge does not appear under either, it is not Apple-billed; it is Google billing directly. Apple support cannot help with those; Google Pay support has to handle it.

Cancel from Settings -> Subscriptions. The next renewal will not happen.

I work on a small iOS tool for the balance side. Full Apple-vs-Google billing breakdown: https://zerobalance.pro/en/blog/unknown-apple-charges/
```

### Reply 19.3 - https://reddit.com/r/applehelp/comments/1ly84mf/

```
A cancelled-order charge that did not refund is usually one of:

1. Pending auth that hasn't been released by the bank. Apple cancels on its side, but the temporary hold on the card stays for 3-10 business days. Watch the card statement; if the line item is still labelled "pending", it will drop off.
2. The cancellation went through but Apple billed a partial amount (rare; happens on pre-order fulfillment edge cases). Receipt email shows the actual amount taken.
3. The cancellation did not go through. The order is still active and will bill again on the next attempt. Order Status at apple.com/orderstatus is the truth.

If the pending hold does not drop in 10 business days, call your card issuer; the auth release is on their side at that point.

If Apple actually charged and then refused to refund, escalate via getsupport.apple.com -> "Apple Online Store" topic (different team from App Store / iTunes).

I work on a small iOS tool for the App Store balance side. Full mystery-charges writeup: https://zerobalance.pro/en/blog/unknown-apple-charges/
```

---

## Article 20 - cant-create-apple-id

Target URL: https://zerobalance.pro/en/blog/cant-create-apple-id/

### Reply 20.1 - https://reddit.com/r/applehelp/comments/1lsgftb/

```
Apple silently rate-limits Apple ID creation by phone number, email domain, and IP. The error messages do not tell you which limit you hit, so it looks like the form is broken.

Things to check, in order:
1. The phone number you are using for verification has been used on 3-5 other Apple IDs already. Apple does not publish the exact limit. Use a different phone.
2. The email is on a blocked or low-reputation domain (Mailinator, 10minutemail, sometimes ProtonMail in some regions). Use a major provider (Gmail, iCloud, Outlook) or a real personal domain.
3. You are on a VPN, or your IP is in a country different from the one selected in the form. Apple flags this. Disable VPN.
4. Recent Apple ID was deleted on the same device. There is a cooldown (~24 hours) before a new ID can be created from the same device.

Try from a device that has never had an Apple ID, with a fresh real email and a phone Apple has not seen.

I work on a small iOS tool unrelated to account creation. Full create-an-Apple-ID troubleshooting: https://zerobalance.pro/en/blog/cant-create-apple-id/
```

### Reply 20.2 - https://reddit.com/r/ios/comments/1mo5ed1/

```
The "standard steps" Apple publishes leave out the silent blockers. The ones that actually trip people up:

- Phone number reuse limit. Apple lets one phone number verify only a few Apple IDs (user reports cluster at 3-5). After that, every new creation attempt that uses the same number silently fails at verification.
- Email domain. Disposable / aliased / privacy-relay domains are sometimes blocked. Real email from a major provider works best.
- VPN / IP mismatch. If the IP geolocates to a country different from the country selected on the form, Apple bounces it.
- Age gate. Under-13 must be created through Family Sharing's "Create Child Account", not the standalone flow.
- Cooldown after deletion. Recently deleted Apple ID on the same device blocks new creation for ~24 hours.

Try: real email, phone Apple has not seen, no VPN, from a device that does not have a recent Apple ID history. If it still fails, contact Apple Account Security through getsupport.apple.com.

I work on a small iOS tool unrelated to account creation. Full blocker breakdown: https://zerobalance.pro/en/blog/cant-create-apple-id/
```
