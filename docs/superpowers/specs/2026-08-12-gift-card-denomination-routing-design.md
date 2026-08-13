# Gift Card Denomination Routing Design

## Goal

Route gift-card customers only to staff-approved G2A/Rewarble listings whose whole-dollar denomination fully covers the selected catalog price.

## Rules

- Compute the required denomination with `Math.ceil(amountUsd)`; never round down.
- Preserve exact whole-dollar totals unchanged.
- Seed every catalog denomination with an exact-value G2A Rewarble search destination; staff may replace any destination with a verified direct listing.
- Match denominations exactly after validating that each denomination is a positive integer and each URL is HTTPS.
- Never guess volatile seller listing IDs. Generated destinations use G2A's stable search route and an exact `REWARBLE VISA Gift Card N USD` query.
- When no approved link exists, keep crypto methods available but disable gift-card submission for that order and explain why.
- Show the exact order total, required gift-card value, and non-refundable overage before the customer leaves ArrowX.
- Customer buys through G2A, returns, submits the delivered code, and waits for manual Rewarble redemption and verification.

## Data Model

`PaymentSettings.giftCardLinks` is a readonly array of `{ denominationUsd: number; purchaseUrl: string }`. The public settings API exposes the sanitized mapping. Existing `giftCardPurchaseUrl` data may remain in historical JSON but is no longer used for checkout routing.

## Admin Experience

The payment settings page provides one row per approved denomination with numeric denomination and HTTPS URL inputs, plus add/remove controls. Saving rejects duplicates, fractional/non-positive denominations, and non-HTTPS URLs.

## Checkout Experience

Checkout derives the required denomination from the server-authoritative catalog selection. When mapped, the button reads `Buy $N Gift Card on G2A`; instructions explain purchase, return, and code submission. When unmapped, the panel says gift-card payment is unavailable for this order, disables the code field and order submission, and directs the customer to crypto or support.

## Verification

Shared unit tests cover rounding, exact-dollar totals, mapping, missing mappings, duplicate denominations, and unsafe URLs. The CRM production build verifies shared types across API, admin, and checkout. A browser pass verifies mapped and unmapped states.
