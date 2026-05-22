# Zero Balance - Ready-to-Post Copy (EN)

Link policy and campaign codes: see [links.md](links.md). Each post is worded differently on purpose; do not paste the same text across many threads in a short window.

> **Reddit usage (important):** Rule 2 in strict subs (r/iOS, r/apple, r/iphone) applies to **comments too, not just posts** - recommending your own app there in any form (even just naming it, no link) gets removed. So:
> - In **r/iOS / r/apple / r/iphone**: do NOT mention or link Zero Balance at all. If you want presence there, answer helpfully *without* your app to build reputation and karma.
> - In **r/AppleHelp** (a help sub, more tolerant): you may reply to a live "stuck on balance / country change" question with the comment texts below, with clear disclosure, keeping the app as one option among the standard fixes. It can still be removed, so build comment karma first and use one link.
> - For a **standalone post**, use a promo-tolerant sub: **r/iosapps**, **r/AppHookup**, **r/SideProject**, **r/indiehackers** (link the story/site, not the store).
> - Never repost removed content. When unsure, modmail the sub first (template below).

## Reddit r/AppleHelp - "can't change my country, there's a balance" (App Store link)

Yeah, that's Apple by design. The change-country button stays locked until your account balance is exactly $0.00, and they won't refund the leftover as actual money since it's store credit.

What actually works:
- Message Apple Support and ask them to clear it. They will, but you lose whatever's left, and from some countries you have to VPN into the right region's support page just to reach an agent.
- If you still have a card from that country, buy anything priced a bit above your balance. It uses the credit first and charges the difference to the card. No card, no luck though.
- I actually built a free app for this exact problem, it's called Zero Balance (I'm the dev). You type in the amount that's stuck, it works out the cheapest combo of tiny in-app purchases to land you on zero, usually overshooting by a cent or two, and it's done in well under a minute. Never touches your Apple ID login. https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=reddit&mt=8

Whatever you do, cancel any active subscriptions and Apple Music first, those block the region change too.

## Reddit r/AppleHelp - "leftover gift card cents I can't spend" (App Store link)

Classic gift card problem. It's store credit so Apple won't give it back, and it's almost always too small to actually buy anything.

If you just want it gone, Apple Support can wipe it (you don't get it back) or you can buy a cheap song and pay the rest with a card.

If you'd rather spend it than lose it, I made a small free app called Zero Balance (disclosure, it's mine) that matches your exact leftover to a bundle of small purchases so you spend down to 0.00 with barely any overshoot. About a minute, no login, no ads. https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=reddit&mt=8

## Reddit r/SideProject or r/indiehackers - standalone build-in-public post (App Store link)

These subs allow showing your own project. Lead with the build story, not the pitch.

Title: I built a tiny app because Apple won't let you change your account country until your balance is exactly $0.00

Quick backstory. If you try to change your Apple ID country, Apple greys out the button until your account balance hits exactly $0.00, and you can't withdraw that balance because it's store credit. People get stuck over a few cents. The "official" fixes are clunky: Apple Support will zero it but you forfeit the money, or you buy something and overpay with a card from that region (if you even have one).

So I made Zero Balance. You type in the leftover amount, it solves for the closest combination of small in-app purchases across 8 price tiers (so you overshoot by a cent or two instead of a dollar), shows the total before you buy, and you confirm through Apple's normal purchase sheet. No Apple ID login, no ads, no tracking. It's free.

The fun part was the matching: it's basically a small coin-change style optimisation, which is why I needed 8 tiers to keep the overshoot tiny.

Happy to answer anything about the build or the App Store side. Link: https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=reddit&mt=8

## Reddit modmail template (to ask permission before posting in a strict sub like r/iOS)

Subject: Permission to share a free utility app relevant to the sub

Hi mods, I'm the developer of a free iOS app called Zero Balance that clears a leftover Apple Account balance to exactly $0.00 (the thing that blocks changing your Apple ID country). It comes up a lot here as a user problem. I don't want to break Rule 2, so before posting I wanted to ask: is there a format you'd allow (a help-style post, a scheduled dev thread, or an AMA)? Happy to follow whatever you prefer. Thanks.

## Quora - "How do I clear a small balance / cents from my Apple ID?" (App Store link)

Short version: Apple won't let you withdraw store credit as cash, and if you're trying to change your country it won't budge until the balance hits exactly $0.00. You've basically got three options.

First, Apple Support. Reach them by chat and they can zero it in about 10-15 minutes once you get an agent. The downside is you forfeit the remaining balance, and depending on where you are you might have to get to a specific country's support site to do it.

Second, spend it down yourself. If you have a valid card for that country, buy an item that costs slightly more than your balance. The credit is used first and the rest goes on the card. Without a card this doesn't work, and hitting an awkward number like $0.47 exactly is nearly impossible, so you overpay.

Third, and full disclosure I'm the developer here, there's a free app I built called Zero Balance made for exactly this. You enter the leftover amount, it calculates the closest bundle of small App Store items across 8 price tiers so the overshoot is usually a cent or two, shows you the total before you buy anything, and you confirm through Apple's normal purchase sheet. No Apple ID login, no ads, no tracking, and it clears in under a minute. https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=quora&mt=8

Whichever you pick, cancel active subscriptions and Apple Music too, since those also block a region change.

## Apple Stack Exchange - technical answer (App Store link)

Apple intentionally locks the region change while any store credit remains, and store credit can't be refunded to a payment method. Three approaches:

1. Apple Support can manually clear the balance for you. It works but the remaining credit is forfeited.
2. With a valid local payment card, purchase an item priced just above the balance. The credit is consumed first, the remainder is charged to the card.
3. Spend the credit on small in-app purchases sized to the balance. I maintain a free app, Zero Balance (disclosure: I'm the author), that automates this: it matches the entered balance to the closest combination of small purchases across 8 price tiers to minimise overshoot, and runs entirely through StoreKit's standard purchase flow with no account access. https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=stackexchange&mt=8

Note that active subscriptions and an Apple Music subscription will also block a region change, so cancel those as well.

## Apple Discussions (discussions.apple.com) - SAFE, no link

The Change Country button is disabled because your account balance has to be exactly $0.00 first, and Apple can't refund store credit as cash. You can either contact Apple Support and ask them to remove the remaining balance (note they keep it), or, if you have a valid card for your current country, buy an item that costs slightly more than your balance so the credit is used up and the difference goes to the card. Also cancel any subscriptions and Apple Music, since those block the region change as well.

## LinkedIn (founder post, App Store link)

A small thing I shipped that solves a surprisingly annoying problem.

If you've ever tried to change your Apple ID country, Apple blocks you until your account balance is exactly $0.00. And you can't withdraw that balance, it's store credit. So people get stuck over literally a few cents.

The usual fixes are clunky. Contact Apple Support and they'll remove it, but you forfeit the money. Or buy something and overpay with a card from that region, assuming you even have one.

So I built Zero Balance to do the obvious thing instead: type in the leftover amount, it finds the closest bundle of small App Store purchases across 8 price tiers, and you spend down to zero in under a minute, keeping the value instead of losing it. No Apple ID login, no ads, no tracking.

Free on the App Store: https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=linkedin&mt=8

Built for one job, done well.

## Medium / dev.to - flagship article (site link in body + App Store CTA at end)

Title: "How to clear your Apple Account balance to $0.00 (and finally change your country)".

If the Change Country or Region button in your Apple account is greyed out, it's almost certainly leftover balance. Apple won't let you switch regions until your account balance is exactly $0.00, and it won't refund that credit as cash. You're left trying to spend something awkward like $0.47 that's too small to buy almost anything. (I put together a full step-by-step guide here: https://zerobalance.pro/en/change-apple-id-country-with-balance/?utm_source=medium&utm_medium=article )

Here are the three real ways to get to zero, fastest last.

**1. Ask Apple Support to clear it.** An agent can zero your balance in roughly 10-15 minutes. Two catches: you forfeit the remaining credit, and from some countries you have to reach a specific region's support site (often behind a VPN) before you can even start.

**2. Buy something and overpay with a card.** If you have a valid card for that country, buy any item priced slightly above your balance. The store credit is spent first and the rest goes on the card. The problems: you need a working local card, and matching a weird leftover exactly is nearly impossible, so you overshoot.

**3. Spend it down precisely with Zero Balance.** Disclosure: I built this app. You type in the leftover amount, it works out the closest combination of small App Store purchases across 8 price tiers so the overshoot is usually a cent or two, shows you the total and overage before anything is charged, and you confirm through Apple's normal purchase sheet. It never logs into your Apple ID, shows no ads, and clears the balance in under a minute. The difference from option 1: you actually spend the value on things you keep instead of handing it back to Apple.

(Include 1-2 screenshots from `public/screenshots/en/`.)

**Before you switch regions, also:** cancel any active subscriptions, cancel Apple Music, and make sure you have a payment method valid in the new region.

Zero Balance is free on the App Store: https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=medium&mt=8

(For dev.to: same text, swap `utm_source=medium` to `utm_source=devto` and `ct=medium` to `ct=devto`.)
