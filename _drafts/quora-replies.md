# Quora outreach replies — copy/paste ready

10 replies tied to 9 newly-published outreach pages on zerobalance.pro.
Posting cadence: drop reply #1 first as a pilot, wait 24h, then 2-3/day max.

---

## #1 — "How can I spend my remaining $0.67 in the Apple App Store or iTunes?"

URL: https://www.quora.com/How-can-I-spend-my-remaining-0-67-in-the-Apple-App-Store-or-iTunes

Target page: https://zerobalance.pro/en/spend-67-cents-apple-account-balance/

```
$0.67 is awkward because Apple's smallest in-app purchase is $0.29 (source: Apple Newsroom, Dec 2022 — https://www.apple.com/newsroom/2022/12/apple-announces-biggest-upgrade-to-app-store-pricing-adding-700-new-price-points/). They expanded to 900 price points but the floor is $0.29, then $0.39, then $0.49, then $0.50 increments. So you can't match $0.67 exactly with a single purchase, and there's no clean way to land on $0.00 to the cent without a card on file.

Option A — combine small IAPs to land close to $0.67. $0.29 + $0.39 = $0.68 — one cent overshoot, which Apple would refuse to charge without a card. Or $0.29 + $0.29 = $0.58 with $0.09 left over (no IAP smaller than $0.29 means that $0.09 stays stuck). There's no perfect combination of Apple-priced IAPs that hits exactly $0.67.

Option B — overshoot with a backup card on file. Buy a $0.99 song or any $0.99 IAP. Apple debits your $0.67 first, then charges $0.32 to your card. Balance hits exactly $0.00. This is the only way to land on the cent, but it requires a card.

What doesn't work: Apple Support won't refund it to cash, can't transfer to Apple Pay, can't buy an Apple Gift Card with it (Apple disabled the last one around 2019 to stop fraud laundering).

Because most people can't be bothered to do this integer-partition math by hand, I built a free iOS app for it called Zero Balance. It has its own set of small in-app purchases priced at $0.29, $0.39, $0.49, $0.79, $0.90, $0.95, $1.00, $1.09, $1.19, and $1.49 — and an algorithm that picks the combination of those closest to your leftover. You enter $0.67, it shows "$0.29 + $0.39 = $0.68 (overshoot $0.01)", and you confirm. The plan-review screen always shows the exact overage and the number of Apple confirmation prompts before any purchase is made. No Apple ID login, no ads, no tracking, no subscription.

Worked examples and the full IAP tier table: https://zerobalance.pro/en/spend-67-cents-apple-account-balance/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Disclosure: I'm the developer of Zero Balance.)
```

---

## #2 — "How do I clear £0.38 from iTunes balance?"

URL: https://www.quora.com/How-do-I-clear-%C2%A30-38-from-itunes-balance

Target page: https://zerobalance.pro/en/clear-itunes-balance-under-1-pound/

```
£0.38 is a hard one — and honestly, you may not be able to land exactly on £0.00 without a card on file. Here's why, with sources.

Apple's UK App Store IAP pricing follows the same minimum-floor structure as the US: the smallest in-app purchase is £0.29, then £0.39, then £0.49, then bigger steps (source: Apple's pricing expansion announcement — https://www.apple.com/newsroom/2022/12/apple-announces-biggest-upgrade-to-app-store-pricing-adding-700-new-price-points/ — same 900-price-point system applies across all Apple store currencies, just localized). There is no £0.09 or £0.19 tier — I see that claim a lot and it's wrong.

So with £0.38, you cannot hit exactly £0.38 in a single purchase, and you can't combine smaller IAPs to make exactly £0.38 either, because £0.29 + (anything ≥ £0.29) = £0.58 or more, which overshoots — and if you only buy the £0.29 once, you're left with £0.09 stuck (smaller than any available IAP).

The two real paths:

1. Get close, accept a small residual. Buy one £0.29 IAP from balance. New balance: £0.09. That £0.09 is below the IAP floor — no smaller IAP exists, so it stays.

2. Overshoot with a card on file. Buy any £0.99 song or paid app. Apple uses £0.38 of your balance first, then charges £0.61 to your card. Balance hits exactly £0.00. This is the only path to landing on the cent.

Apple Support won't refund £0.38 to a bank account, but they will sometimes zero out a small leftover if you're explicitly trying to change your Apple ID country and have already reduced the balance below ~£0.69 (the threshold is unofficial but consistent across reports). Don't bother contacting them otherwise.

I built a free iOS app called Zero Balance specifically for this problem. The app has its own set of in-app purchases at £0.29, £0.39, £0.49, £0.79, £0.90, £0.95, £1.00, £1.09, £1.19, and £1.49 (each themed as a small cosmic/cozy item stored in your private iCloud inventory). The algorithm picks the combination of those closest to your balance, and the plan-review screen shows the exact overage and confirmation count before you commit. For larger leftovers it can usually combine multiple tiers to hit within a penny or two. No Apple ID login, no ads, no tracking, no subscription.

UK write-up with the IAP tier table: https://zerobalance.pro/en/clear-itunes-balance-under-1-pound/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## #3 — "I have about $100 in iTunes credit and I am never going to use it. Is there a way I can put it onto Apple Pay to spend it at stores?"

URL: https://www.quora.com/I-have-about-100-in-iTunes-credit-and-I-am-never-going-to-use-it-Is-there-a-way-I-can-put-it-onto-Apple-Pay-to-spend-it-at-stores

Target page: https://zerobalance.pro/en/convert-itunes-credit-to-apple-pay/

```
The honest answer is no — and I'll explain why, plus what $100 of locked-in credit can actually buy you, because it's more than people realize.

Why it can't go to Apple Pay: Apple Pay funds and Apple Account / iTunes credit are two legally different instruments under Apple's Media Services Terms. Store credit is non-refundable, non-transferable, non-exchangeable for cash, and usable only for content and services on Apple's stores. Apple Pay sits on top of a real bank/card network. There is no legitimate technical or contractual bridge between them, in any country.

The third-party "iTunes-to-cash" sites you'll find on Google — avoid them. They typically take a 20-30% cut, many require you to send them your gift card code (which they can drain instantly with no recourse), and a meaningful share are outright scams. PayPal Digital Gifts shut down its iTunes resale option years ago for the same reason.

What $100 of credit can actually do, ranked by best $/value:
- Apple One subscription — at $19.95/mo for Individual or $25.95 for Family, that's about 5 months of bundled iCloud+, Music, TV+, Arcade, and (Premier) News+/Fitness+. The store credit pays each monthly charge automatically.
- iCloud+ 2TB standalone at $9.99/mo — $100 = 10 months of premium storage.
- Apple hardware via the Apple Store app in supported regions (US, UK, several EU). The Apple Store iPhone app accepts Apple Account balance as a payment method for AirPods, accessories, even a Mac or iPhone if the balance is large enough.
- AppleCare+ on a new device — paid from balance.
- Books, Music albums, paid apps, and IAPs — straightforward.

If the real goal is "I want the balance at $0.00": spend the bulk of it on one of the options above, then for the residual cents that none of those options match exactly, use a calculator. I built a free iOS app called Zero Balance for the leftover-cents stage. It has its own 10 small in-app purchases ($0.29 to $1.49) and an algorithm that picks the combination closest to your leftover. The plan-review screen shows the exact overage before any purchase is confirmed — for amounts under $0.29 you can't reach exactly zero without a card on file, but you can land within a cent or two. No login, no Apple ID access, no ads, no tracking, no subscription.

Full write-up of the legitimate options: https://zerobalance.pro/en/convert-itunes-credit-to-apple-pay/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## #4 — "Is there an app that allows you to pay for gift cards using your current balance on your Apple ID?"

URL: https://www.quora.com/Is-there-an-app-that-allows-you-to-pay-for-gift-cards-using-your-current-balance-on-your-Apple-ID

Target page: https://zerobalance.pro/en/buy-gift-cards-with-apple-account-balance/

```
Short answer: no. Apple disabled this in 2019, and no first-party or third-party app legitimately offers it.

Some context on why it's gone: Before 2019, you could buy an Apple Gift Card (or App Store & iTunes Gift Card) from inside the Apple Store using your existing balance — effectively converting credit into a transferable code. Fraudsters used this to launder stolen Apple Account credentials: log into the compromised account, drain the balance into gift cards, and resell the codes for cash. Apple closed the loop entirely. Today the "Apple Gift Card" purchase page no longer accepts Apple Account balance as a payment method anywhere in the world.

Third-party "balance-to-gift-card" sites that show up on Google are uniformly either (a) taking a 20-30% cut and reselling your code on shady marketplaces, or (b) phishing operations that vanish with your code. There is no honest middleman service for this.

What you can still buy with balance — and most of these are surprisingly useful:
- Paid apps and in-app purchases (including IAPs in third-party games like Roblox, Clash of Clans, Fortnite via iOS)
- Apple Music, Apple TV+, Apple Arcade, Apple News+, iCloud+ subscriptions
- Apple One bundles
- Apple Books and Audiobooks
- Songs, movies, and TV from the iTunes Store
- Apple-branded hardware via the Apple Store iPhone app (in US, UK, and several other regions)
- AppleCare+ on new devices

If your underlying goal is "land the balance on $0.00" — usually because you want to change Apple ID country, which Apple requires to be zero (https://support.apple.com/en-us/118283), or you just don't want pennies lingering on the account — the working approach is to spend the bulk of the balance on a subscription or paid app, then clear the residual cents with a tool. I built a free iOS app called Zero Balance for that second step. The app has its own set of 10 small in-app purchases (priced from Apple's $0.29 minimum up to $1.49) and an algorithm that picks the combination closest to your leftover. The plan-review screen shows the exact overage and confirmation count before any purchase is made. For amounts below Apple's $0.29 IAP floor, exact zero is mathematically unreachable without a card on file, but you can land within a cent or two. No Apple ID login, no tracking, no ads, no subscription.

Full breakdown: https://zerobalance.pro/en/buy-gift-cards-with-apple-account-balance/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## #5 — "How do I cancel an iTunes gift card? I have $1.01 and I have no idea what to do with that."

URL: https://www.quora.com/How-do-I-cancel-an-iTunes-gift-card-I-have-1-01-and-I-have-no-idea-what-to-do-with-that

Target page: https://zerobalance.pro/en/leftover-itunes-gift-card-1-dollar/

```
Once a gift card is redeemed onto your Apple Account, the card itself is destroyed — there is no "cancel" because the value has merged into your account balance, and Apple's terms make redeemed gift cards non-refundable and non-transferable (Apple Media Services Terms — https://www.apple.com/legal/internet-services/itunes/us/terms.html). So the workable question is "how do I clear exactly $1.01?", and the answer depends on whether you have a card on file.

First, the constraint that defines this whole problem: Apple's minimum in-app purchase price is $0.29 (source: Apple Newsroom, Dec 2022 — https://www.apple.com/newsroom/2022/12/apple-announces-biggest-upgrade-to-app-store-pricing-adding-700-new-price-points/). Sub-tier prices are $0.29, $0.39, $0.49, then $0.50 increments. There is no $0.01, $0.05, $0.09, or $0.19 IAP tier — those don't exist on the App Store. I see them claimed online but they aren't real.

With a card on file — the clean path: Buy any $1.99 song or $1.99 IAP. Apple debits your $1.01 balance first, then charges $0.98 to your card. Balance hits exactly $0.00. This is the only way to land on the cent.

Without a card on file — get as close as possible:
- $0.49 + $0.49 = $0.98 (leaves $0.03 stuck — unreachable, smaller than any IAP)
- $0.29 + $0.29 + $0.39 = $0.97 (leaves $0.04 stuck)
- $0.29 + $0.49 = $0.78 (leaves $0.23 stuck)

There's no way to hit exactly $1.01 using only available IAP prices.

What doesn't work for $1.01:
- Apple Support won't refund it (the unofficial "we'll zero it out" courtesy is generally restricted to small residues blocking an Apple ID country change)
- You can't move it to Apple Pay or a bank account (separate instruments under Apple's terms)
- You can't buy an Apple Gift Card with it (Apple disabled that around 2019 to stop fraud laundering)

Because computing the closest combination by hand is annoying, I built a free iOS app called Zero Balance for this. The app has its own carefully chosen set of in-app purchases — Cosmic Cocoa $0.29, Nebula Nibbles $0.39, Star Sprinkles $0.49, Galaxy Feast $0.79, Sunbeam Patch $0.90, Toast Pebble $0.95, Hearth Orb $1.00, Giggle Bubble $1.09, Meteor Pop $1.19, Cozy Pin $1.49 — and an algorithm that finds the combination of those closest to your leftover. For $1.01 it'd suggest Hearth Orb $1.00 (leaving $0.01 — basically zero), and the plan-review screen shows the exact overage/undershoot and the number of Apple confirmation prompts before any purchase is made. No Apple ID login, no ads, no tracking, no subscription.

Worked examples for $1.01, $0.67, $0.38, and other awkward amounts: https://zerobalance.pro/en/leftover-itunes-gift-card-1-dollar/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## #6 — "Can I purchase Gift Cards using my Apple ID balance/funds?"

URL: https://www.quora.com/Can-I-purchase-Gift-Cards-using-my-Apple-id-balance-funds

Target page: https://zerobalance.pro/en/buy-gift-cards-with-apple-account-balance/

```
No, Apple disabled this in 2019. The Apple Gift Card purchase page no longer accepts Apple Account balance as a payment method — only credit/debit cards, Apple Pay (the card-backed kind, not store credit), or a bank account. Same restriction on the App Store, on apple.com, and inside the Apple Store iPhone app.

Why it was removed: the workflow was being abused by fraudsters. They'd compromise an Apple ID, drain the balance into gift cards inside the same account, then resell the codes for cash on grey-market sites. Removing the payment-method option closed the loophole.

What this means in practice:
- If you wanted to gift the balance to someone else: you can't via gift card. You can let them spend it via Family Sharing (the family organizer's balance is used first on family members' purchases), but only if you're the organizer.
- If you wanted to "lock in" the balance against future hardware: in the US/UK and several other regions, you can pay for hardware (AirPods, accessories, Macs) inside the Apple Store iPhone app using balance.
- If you wanted to convert it to cash: not possible. Avoid third-party "iTunes-to-cash" sites — most are scams or take a 25%+ cut.

What still works to actually use the balance: paid apps, in-app purchases (including in third-party games like Roblox/Clash of Clans on iOS), Apple Music, Apple TV+, Apple Arcade, iCloud+, Apple One bundles, Apple Books, iTunes movies/songs, AppleCare+, and (in some regions) physical Apple hardware.

If the underlying problem is "I have an awkward leftover amount of balance I want to clear" — e.g., you're trying to change Apple ID country, which Apple requires to be $0.00 (https://support.apple.com/en-us/118283) — there is no single Apple-side tool for this. I built a free iOS app called Zero Balance: enter your remaining balance, and it picks the combination of its own in-app purchases (10 tiers from $0.29 to $1.49) closest to it. The plan-review screen always shows the exact overage before you commit. Apple's $0.29 IAP floor means you can't always hit exactly $0.00 without a backup card, but for most leftovers you can land within a few cents. No Apple ID login, no ads, no tracking, no subscription.

Detailed write-up: https://zerobalance.pro/en/buy-gift-cards-with-apple-account-balance/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## #7 — "How do you move Apple ID funds to another family member's Apple Pay? Is that possible?"

URL: https://www.quora.com/How-do-you-move-Apple-ID-funds-to-another-family-member-s-Apple-Pay-Is-that-possible

Target page: https://zerobalance.pro/en/transfer-apple-account-balance-family-sharing/

```
Apple Pay → impossible. Apple Account balance and Apple Pay funds are legally separate instruments and Apple does not (and contractually cannot) move money between them.

But there is a real workaround through Family Sharing, with a specific direction restriction:

How it works: If you are the organizer of a Family Sharing group, Apple applies your Apple Account balance first when any of your family members make a purchase from the App Store, iTunes, Apple Books, or any iOS in-app purchase. The order is:
1. Family organizer's Apple Account balance
2. Family organizer's payment method (card on file)

So in practice, a parent with $30 of leftover balance can let their kid spend it down just by having the kid buy songs, apps, or in-app purchases on the kid's own iPhone. The parent's balance gets drained first; only after it hits $0 does Apple touch the parent's credit card.

What this does NOT support:
- Family member → organizer (can't push your balance "up" to the parent's account)
- Family member → family member (siblings can't share with each other directly)
- Any account that isn't already in the same Family Sharing group
- Transferring balance into the family member's own Apple Account balance (it's spent, not moved)

Practical setup if you want to do this:
1. Be the Family organizer (this is set at family-creation time; you can change organizer in Settings → Family).
2. Make sure "Purchase Sharing" is enabled in Family settings.
3. Have the family member make purchases as normal. The "Apple Account: $X.XX → $Y.YY" line will appear on the receipt sent to your email, showing the balance was used.

If your real goal was just to land your own balance at $0.00 (a common case before changing Apple ID country, Apple's documented requirement at https://support.apple.com/en-us/118283), Family Sharing only helps if a relative is in the group and willing to spend on your behalf. If not, the cleaner path is to combine small in-app purchases that get as close as possible. Apple's minimum IAP is $0.29 (https://www.apple.com/newsroom/2022/12/apple-announces-biggest-upgrade-to-app-store-pricing-adding-700-new-price-points/), so residues smaller than that can only be cleared exactly by overshooting with a card on file.

I built a free iOS app called Zero Balance for that scenario. The app has its own 10 in-app purchases (priced $0.29, $0.39, $0.49, $0.79, $0.90, $0.95, $1.00, $1.09, $1.19, $1.49) and an algorithm that picks the combination closest to your leftover. The plan-review screen shows the exact overage and confirmation count before any purchase is made. No Apple ID login, no tracking, no ads, no subscription.

Full Family Sharing breakdown + the alternative path: https://zerobalance.pro/en/transfer-apple-account-balance-family-sharing/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## #8 — "If I sign out of my Apple ID, will my balance disappear when I sign back in?"

URL: https://www.quora.com/If-I-sign-out-of-my-Apple-ID-will-my-balance-disappear-when-I-sign-back-in

Target page: https://zerobalance.pro/en/apple-id-balance-sign-out-sign-in/

```
Short answer: no, your balance is safe. It's stored server-side against your Apple Account, not locally on the device. Signing out, switching iPhones, restoring from backup, or even getting a brand-new iPhone and signing in fresh — none of those touch the balance number. When you sign back into the same Apple Account, the same balance will be sitting there.

What signing out actually does:
- Removes the account credentials from this device
- Wipes locally cached purchases and Apple Music library from the device (but the right to redownload remains)
- Disables iCloud sync from this device until you sign back in
- Removes payment methods stored on this device for Apple Pay (the bank-card kind)

What signing out does NOT do:
- Change your balance amount
- Cancel subscriptions
- Remove your purchase history
- Touch your Apple Account itself in any way

The handful of cases where balance can actually disappear:
1. You change your Apple ID country/region. Apple requires the balance to be at $0.00 before allowing a region switch (https://support.apple.com/en-us/118283). Any non-zero residue is forfeited (you can't take it across borders even if Apple Support tries to help). This is the most common way people accidentally lose balance.
2. You request account deletion via privacy.apple.com. Apple permanently closes the account and the balance is gone.
3. Apple detects fraud or T&C violation. Account freeze can include the balance.
4. Family Sharing organizer purchases. If you're a member of a family group, the organizer's balance is used first on your purchases — so the organizer's balance can drain through normal family member activity (not yours).

If your actual goal is to deliberately zero out the balance — most commonly because you want to change Apple ID country and need to hit $0.00 first — Apple won't refund it to cash, won't move it to Apple Pay, and won't let you buy gift cards with it. The only working path is to spend it. For awkward amounts (like $0.47 or £0.38) where no single in-app purchase matches your remaining balance, I built a free iOS app called Zero Balance that calculates the exact closest combination of small in-app purchases to land you near $0.00. The app has its own 10 small IAPs ($0.29 to $1.49), and the plan-review screen shows the exact overage before any purchase. Apple's $0.29 minimum IAP price means residuals smaller than that can't be cleared exactly without a card on file — but you can land within a cent or two.

Full explainer: https://zerobalance.pro/en/apple-id-balance-sign-out-sign-in/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## #9 — "If I loaded Apple gift cards into my Apple ID can I use these credits on the Apple store app for physical items?"

URL: https://www.quora.com/If-I-loaded-Apple-gift-cards-into-my-Apple-ID-can-I-use-these-credits-on-the-Apple-store-app-for-physical-items

Target page: https://zerobalance.pro/en/use-apple-account-balance-for-physical-products/

```
Yes — and this is genuinely underused. In several countries, Apple merged the legacy "App Store & iTunes credit" into a single "Apple Account balance" that can pay for both digital purchases (apps, music, subscriptions) and physical Apple hardware purchased via the Apple Store iPhone app.

Where this works (as of 2026): US, UK, Canada, Australia, several EU countries including Germany, France, Italy, and Spain. The exact list shifts over time — Apple has been quietly expanding it. India and most of Latin America are still digital-only.

What you can buy: AirPods, MagSafe accessories, cases, keyboards, mice, Apple TV, HomePod, and even iPhones/Macs/iPads if the balance is large enough. AppleCare+ also accepts balance as payment.

How to do it:
1. Open the Apple Store app on your iPhone (not the App Store — different app, has a shopping-bag icon, free download).
2. Add an item to your cart.
3. At checkout, scroll to payment method. Your Apple Account balance appears as an option alongside cards and Apple Pay.
4. Pay. The balance is debited the same way it would be for an app.

The gotcha: in some regions / for some product categories, the balance must cover the entire price — Apple won't split a hardware payment between balance + card. So $80 of balance against a $99 pair of AirPods could be blocked. You either need to top up the balance or the order won't allow the balance to be applied at all.

What doesn't work: apple.com web checkout (still card-only in most regions), Apple retail stores in person, and any non-Apple retailer.

If your balance is too small to cover any hardware item (very common case: $0.30, £0.50, €0.74 leftover from a gift card), the hardware path doesn't help. The realistic exit is to combine small in-app purchases to spend it down as close to $0.00 as possible — which is what I built a free iOS app for. It's called Zero Balance and ships with its own set of 10 small in-app purchases ($0.29 through $1.49). The algorithm picks the combination closest to your leftover; the plan-review screen shows the exact overage before any purchase. Apple's IAP floor is $0.29 (https://www.apple.com/newsroom/2022/12/apple-announces-biggest-upgrade-to-app-store-pricing-adding-700-new-price-points/), so residuals smaller than that can't be cleared exactly without a backup card on file. No login, no ads, no tracking.

Country-by-country breakdown: https://zerobalance.pro/en/use-apple-account-balance-for-physical-products/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## #10 — "Does adding an Apple gift card mean I can use that to purchase other things that are not Apple? For example, in game items on a different app on my iPhone."

URL: https://www.quora.com/Does-adding-an-Apple-gift-card-mean-I-can-use-that-to-purchase-other-things-that-are-not-Apple-For-example-in-game-items-on-a-different-app-on-my-iPhone

Target page: https://zerobalance.pro/en/what-can-apple-gift-card-buy/

```
Yes — partially — and the part most people don't realize is the strongest answer to your question. In-app purchases inside third-party apps absolutely use your Apple Account balance, because Apple — not the app's developer — processes every IAP transaction on iOS. So gem packs in Clash of Clans, Robux in Roblox, V-Bucks in Fortnite (historical iOS), coin packs in casual games, premium currency in Genshin Impact, MTX in any third-party app — all of those debit your Apple Account balance first before any card on file gets charged.

What this means in practice: loading an Apple Gift Card onto your account doesn't just give you "Apple store" credit. It gives you credit usable across thousands of third-party iOS apps, anywhere the in-app purchase prompt says "Apple ID" at the top.

What still doesn't work, to be clear:
- Android apps (separate ecosystem, separate billing)
- Web purchases of those same games (e.g., buying Robux on roblox.com — that uses your card, not your Apple balance, because it's not going through Apple)
- Steam, Epic Games, Amazon, eBay, anything sold outside an iOS app
- Physical goods from non-Apple retailers
- Apple Pay at coffee shops (different system; uses your card, not balance)

What it also buys, beyond IAPs:
- Paid apps and games on the App Store
- Apple Music, Apple TV+, Apple Arcade, Apple Books, Apple News+, iCloud+, Apple One bundles
- Songs, movies, and TV from the iTunes Store
- Physical Apple hardware in supported regions via the Apple Store iPhone app (US, UK, several EU)
- AppleCare+

The one annoying edge case: if you end up with an awkward leftover amount (say $0.47 or $1.13) that doesn't match any single in-app purchase tier, that residual can sit on your account forever. Apple won't refund it. The fix is to combine multiple small IAPs that get as close as possible — I built a free iOS app called Zero Balance that calculates that combination for you. The app has its own set of 10 small in-app purchases ($0.29 to $1.49); enter your leftover, and the algorithm picks the combination closest, showing the exact overage on a plan-review screen before any purchase is made. Apple's minimum IAP is $0.29 (https://www.apple.com/newsroom/2022/12/apple-announces-biggest-upgrade-to-app-store-pricing-adding-700-new-price-points/), so residuals under that can't be cleared exactly without a card on file. No Apple ID login, no ads, no tracking, no subscription. It exists for exactly this "I have $0.47 stuck and Apple won't help" problem.

Full breakdown: https://zerobalance.pro/en/what-can-apple-gift-card-buy/

App Store: https://apps.apple.com/app/apple-store/id6761912988

(Developer disclosure.)
```

---

## Reddit recipe (items 11-15) — browser-verify in your account

WebFetch from this environment cannot reach reddit.com. The flow below is what to do manually in your browser.

### Recipe

1. Search r/AppleHelp with each query, sorted by "New" and "Past Year":
   - `balance leftover`
   - `apple id balance change country`
   - `balance won't go to zero`
   - `cents stuck`
   - `gift card balance`
2. For each candidate post, verify in browser:
   - Post is NOT marked `[locked]` or `[archived]` (lock icon on right side)
   - The OP reply box is NOT greyed out
   - Post is < 6 months old (engagement drops fast after 6 months)
   - Post has < 20 existing comments (your reply needs to be visible)
3. Match the post to one of the 9 target pages above by theme.
4. Reply using the Quora text above as the substance template. Reddit reads more conversational than Quora, so:
   - Drop the formal "Disclosure: I'm the developer" footer; replace with "(I made the app, btw — happy to answer questions)"
   - Keep the same depth (~300 words). Reddit upvotes detailed, accurate answers; short replies with links get downvoted as spam.
   - Always include both the page link AND the App Store link, but only once each.

### Reddit etiquette guardrails

- Answer the question fully BEFORE the link. r/AppleHelp removes drive-by promo on sight.
- Disclose authorship in plain language.
- Link only once per reply.
- Do NOT edit a link in later — that often triggers automod.
- Don't reply to posts older than 6 months — mods sometimes purge necro-replies.
- Don't reply to more than 1 post per day per account.
- Never link the same domain from a fresh account.

### Theme-to-page mapping for Reddit posts

| Reddit search theme | Target page (already published) |
|---|---|
| "balance won't go to zero" | https://zerobalance.pro/en/apple-id-balance-wont-go-to-zero/ |
| "change apple id country balance" | https://zerobalance.pro/en/change-apple-id-country-with-balance/ |
| "leftover gift card cents" | https://zerobalance.pro/en/leftover-itunes-gift-card-1-dollar/ |
| "refund apple id balance" | https://zerobalance.pro/en/convert-itunes-credit-to-apple-pay/ |
| "spend remaining apple credit" | https://zerobalance.pro/en/spend-67-cents-apple-account-balance/ |

---

## Posting cadence

- **Day 1:** Drop reply #1 only. Wait 24h.
- **Day 2:** If reply #1 wasn't removed → drop replies #2 and #3.
- **Day 3-5:** Drop 2 per day. Spread across the remaining 7.
- **Day 6+:** Start Reddit posting (max 1/day per account).

Quora flags accounts that drop many links rapidly. The cadence above keeps you under their typical threshold.
