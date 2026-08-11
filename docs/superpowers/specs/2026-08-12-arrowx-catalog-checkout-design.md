# ArrowX Catalog, Variant Pricing, and Manual Payment Verification Design

**Status:** Approved in conversation on 2026-08-12; awaiting review of this written specification  
**Source of truth:** The client-supplied pricing list overrides screenshots, existing mock data, and existing catalog records.  
**Scope:** Storefront catalog and product-page restructuring, exact variant pricing, branded variant artwork, CRM checkout, payment settings, proof collection, and staff verification.

## 1. Objective

Replace the current game-level fixed pricing model with an exact ecommerce-style game/variant/offer catalog, then connect storefront selections to a CRM-hosted checkout supporting manually verified BTC, LTC, USDT TRC20, and gift-card payments.

The finished system must provide:

- 23 top-level storefront pages.
- 34 purchasable variants across those pages.
- Only the offers and prices in this specification.
- One unique product artwork per variant with green ArrowX corner branding.
- Server-authoritative checkout pricing.
- Manual payment verification before staff can claim, dispatch, or complete an order.

## 2. Confirmed Product Hierarchy

The storefront treats games and the general Spoofers category as top-level products. Named offerings beneath them are variants, not separate routes.

- A catalog card opens one canonical page for its game/category.
- The page displays only the variants listed for that parent.
- Selecting a variant updates its artwork and available offers in place.
- Variants do not receive independent SEO pages or URLs.
- The second Fortnite variant remains named exactly `Fortnite`.
- Screenshots suggesting a fourth Valorant option are superseded by the pricing list; Valorant has exactly three variants.
- Existing catalog entries that are absent from this specification are out of scope and must not remain in the new source-of-truth catalog.

## 3. Canonical Pricing Matrix

All prices are USD and render with two decimal places. Labels must be displayed exactly as written.

### 3.1 Valorant

| Variant | Offer | Price |
|---|---:|---:|
| Avlon | 1 Day | $9.99 |
| Avlon | 1 Week | $29.99 |
| Avlon | 1 Month | $59.99 |
| Avlon | 1 Year | $249.99 |
| Unlocker | 1 Day | $4.99 |
| Unlocker | 1 Week | $14.99 |
| Unlocker | 1 Month | $29.99 |
| Spoofer | 1 Month | $49.99 |
| Spoofer | Lifetime | $199.99 |

### 3.2 Apex Legends

| Variant | Offer | Price |
|---|---:|---:|
| Arcane | 1 Day | $4.99 |
| Arcane | 1 Week | $22.99 |
| Arcane | 1 Month | $39.99 |

### 3.3 ARC Raiders

| Variant | Offer | Price |
|---|---:|---:|
| Ancient | 1 Day | $4.99 |
| Ancient | 1 Week | $19.99 |
| Ancient | 1 Month | $39.99 |
| Arcane | 1 Day | $4.99 |
| Arcane | 1 Week | $24.99 |
| Arcane | 1 Month | $39.99 |
| Arcane Web | 1 Day | $4.99 |
| Arcane Web | 1 Week | $19.99 |
| Arcane Web | 1 Month | $34.99 |
| Temporary Account | 0–99 Hours | $3.99 |
| Temporary Account | 100–200 Hours | $4.99 |
| Temporary Account | 200–300 Hours | $6.49 |
| Temporary Account | 300+ Hours | $5.99 |
| 15-Day Inactive | 0–99 Hours | $4.99 |
| 15-Day Inactive | 100–200 Hours | $5.99 |
| 15-Day Inactive | 200+ Hours | $7.99 |

### 3.4 Arena Breakout

| Variant | Offer | Price |
|---|---:|---:|
| Full | 1 Day | $9.99 |
| Full | 1 Week | $29.99 |
| Full | 1 Month | $49.99 |

### 3.5 Battlefield 6

| Variant | Offer | Price |
|---|---:|---:|
| Ancient | 1 Day | $4.99 |
| Ancient | 1 Week | $19.99 |
| Ancient | 1 Month | $39.99 |

### 3.6 Call of Duty: Black Ops 7 / Warzone

| Variant | Offer | Price |
|---|---:|---:|
| Byte | 1 Week | $7.99 |
| Byte | 1 Month | $15.99 |
| Byte | Lifetime | $39.99 |

### 3.7 Counter-Strike 2

| Variant | Offer | Price |
|---|---:|---:|
| Predator | 1 Week | $3.99 |
| Predator | 1 Month | $6.49 |
| Predator | 3 Months | $14.99 |

### 3.8 DayZ

| Variant | Offer | Price |
|---|---:|---:|
| Arcane | 1 Day | $2.99 |
| Arcane | 1 Week | $12.99 |
| Arcane | 1 Month | $25.99 |

### 3.9 Dead by Daylight

| Variant | Offer | Price |
|---|---:|---:|
| Arcane | 1 Day | $3.99 |
| Arcane | 1 Week | $14.99 |
| Arcane | 1 Month | $29.99 |

### 3.10 Delta Force

| Variant | Offer | Price |
|---|---:|---:|
| Full | 1 Day | $9.99 |
| Full | 1 Week | $29.99 |
| Full | 1 Month | $59.99 |
| Full | Lifetime | $399.99 |

### 3.11 Escape from Tarkov

| Variant | Offer | Price |
|---|---:|---:|
| Full | 1 Day | $6.99 |
| Full | 1 Week | $26.99 |
| Full | 1 Month | $69.99 |
| Full | 3 Months | $159.99 |
| Lite | 1 Day | $3.99 |
| Lite | 1 Week | $14.99 |
| Lite | 1 Month | $39.99 |
| Lite | 3 Months | $99.99 |

### 3.12 FiveM

| Variant | Offer | Price |
|---|---:|---:|
| Keyser | 1 Day | $4.99 |
| Keyser | 1 Week | $9.99 |
| Keyser | 1 Month | $13.99 |
| Keyser | Lifetime | $34.99 |

### 3.13 Fortnite

| Variant | Offer | Price |
|---|---:|---:|
| Exodus | 1 Day | $3.99 |
| Exodus | 3 Days | $7.99 |
| Exodus | 1 Week | $19.99 |
| Exodus | 1 Month | $39.99 |
| Fortnite | 3 Days | $7.99 |
| Fortnite | 1 Week | $14.99 |
| Fortnite | 1 Month | $29.99 |

### 3.14 Marvel Rivals

| Variant | Offer | Price |
|---|---:|---:|
| Predator | 1 Day | $3.49 |
| Predator | 1 Week | $8.99 |
| Predator | 1 Month | $19.99 |
| Predator | 3 Months | $34.99 |

### 3.15 Mecha Chamelion

| Variant | Offer | Price |
|---|---:|---:|
| Hidden | 1 Month | $12.99 |
| Hidden | Lifetime | $24.99 |

### 3.16 Mistfall Hunter

| Variant | Offer | Price |
|---|---:|---:|
| Arcane | 1 Day | $4.99 |
| Arcane | 1 Week | $19.99 |
| Arcane | 1 Month | $39.99 |

### 3.17 NBA 2K26

| Variant | Offer | Price |
|---|---:|---:|
| Internal | 1 Week | $29.99 |
| Internal | 1 Month | $79.99 |
| Internal | Lifetime | $499.99 |

### 3.18 Palworld

| Variant | Offer | Price |
|---|---:|---:|
| Palcore Internal | 1 Day | $4.99 |
| Palcore Internal | 1 Week | $9.99 |
| Palcore Internal | 1 Month | $14.99 |
| Palcore Internal | Lifetime | $39.99 |

### 3.19 Rainbow Six Siege

| Variant | Offer | Price |
|---|---:|---:|
| Ivy | 1 Day | $4.99 |
| Ivy | 1 Week | $24.99 |
| Ivy | 1 Month | $49.99 |
| Exodus | 1 Day | $3.99 |
| Exodus | 3 Days | $7.99 |
| Exodus | 1 Week | $19.99 |
| Exodus | 1 Month | $39.99 |
| Crusader | 1 Day | $4.99 |
| Crusader | 1 Week | $22.99 |
| Crusader | 1 Month | $44.99 |

### 3.20 Rust

| Variant | Offer | Price |
|---|---:|---:|
| Ancient | 1 Day | $5.99 |
| Ancient | 1 Week | $27.99 |
| Ancient | 1 Month | $54.99 |

### 3.21 Spoofers

| Variant | Offer | Price |
|---|---:|---:|
| Temporary | 3 Days | $5.99 |
| Temporary | 1 Week | $13.99 |
| Temporary | 1 Month | $21.99 |
| Permanent | One-Time Use | $29.99 |
| Permanent | Unlimited Use | $69.99 |

### 3.22 Squad

| Variant | Offer | Price |
|---|---:|---:|
| Arcane | 1 Day | $2.99 |
| Arcane | 1 Week | $11.99 |
| Arcane | 1 Month | $21.99 |

### 3.23 The Finals

| Variant | Offer | Price |
|---|---:|---:|
| Arcane | 1 Day | $4.99 |
| Arcane | 1 Week | $22.99 |
| Arcane | 1 Month | $41.99 |

## 4. Architecture

Use a shared-catalog, CRM-checkout architecture.

### 4.1 Shared catalog

A typed catalog module is consumed by both Next.js applications. It defines parent products, variants, offers, artwork paths, and verified parent-level display metadata. It is the only authoritative source for purchasable combinations and pricing.

Conceptual types:

```ts
interface CatalogProduct {
  id: string;
  name: string;
  category: CatalogCategory;
  description: string;
  heroImage: string;
  variants: ProductVariant[];
}

interface ProductVariant {
  id: string;
  name: string;
  artwork: string;
  offers: PriceOffer[];
}

interface PriceOffer {
  id: string;
  label: string;
  priceUsd: number;
}
```

Flexible offer arrays are required because the catalog includes day, week, month, year, lifetime, hour-range, one-time-use, and unlimited-use labels. The current fixed `day/week/month/lifetime` object cannot represent the approved source accurately.

### 4.2 Storefront responsibility

The storefront owns browsing, searching, parent product pages, variant selection, offer selection, and navigation into CRM checkout. It passes only `productId`, `variantId`, and `offerId` to checkout.

### 4.3 CRM responsibility

The CRM owns authentication, checkout, public payment configuration, proof submission, order creation, payment verification, order claiming, dispatch, and customer tracking. It resolves catalog identifiers server-side and ignores client-supplied prices.

### 4.4 Order snapshot

Every order stores an immutable snapshot of:

- Product ID and display name.
- Variant ID and display name.
- Offer ID and display label.
- USD price at order creation.

Later catalog changes must not rewrite historical orders.

## 5. Storefront Experience

### 5.1 Catalog

- Render exactly 23 parent cards.
- Calculate `Starts from` from the lowest offer price across all child variants.
- Search parent names and variant names.
- Selecting a card opens its canonical parent route.
- Do not expose obsolete catalog entries that are absent from this specification.

### 5.2 Product page

- Render variant cards/selectors within the parent page.
- Use the first variant as the initial visual selection.
- Do not preselect a paid offer.
- Update artwork, variant name, offer list, and order summary when the variant changes.
- Enable checkout only after the customer explicitly selects an offer.
- Render exact offer labels; do not normalize hour ranges or usage labels into durations.
- Do not generate missing offers or fallback prices.
- Generate structured product metadata from actual minimum price, maximum price, and offer count.

### 5.3 Responsive and accessible behavior

- Desktop uses a compact grid or row of variant cards.
- Mobile uses a stacked or horizontally scrollable selector with clear selection state.
- All controls are keyboard accessible and expose selected/disabled state.
- Artwork text remains legible at card and hero sizes.
- Loading, disabled, unavailable, and submission states are visually distinct.

## 6. Artwork Requirements

- Produce 34 unique variant artworks.
- Use stable filenames derived from product and variant IDs.
- Include the game name and variant identity.
- Place the green ArrowX logo consistently in the corners.
- Keep essential text and branding inside crop-safe areas.
- Avoid accidental duplication between variants sharing names such as `Arcane`, `Ancient`, `Exodus`, or `Predator`.
- Review spelling against the source list, including `Avlon` and `Mecha Chamelion` as supplied.

## 7. Checkout and Payment Methods

### 7.1 Common checkout behavior

- Display product, variant, selected offer, and exact USD total.
- Resolve identifiers and price on the CRM server.
- Reject unknown or mismatched combinations.
- Prevent duplicate order submission while a request is active.
- Return an order ID and tracking link after successful creation.

### 7.2 Crypto payments

Supported methods:

- BTC.
- LTC.
- USDT on TRC20.

Each method displays one shared public receiving address and matching QR image configured by authorized CRM staff. USDT must always display the TRC20 network prominently.

Proof rules:

- Accept a transaction hash, a screenshot, or both.
- Require at least one of the two.
- Store screenshots privately under server-controlled filenames.
- Make proof files accessible only through an authenticated staff endpoint.
- Staff manually confirms the address, payment, and amount against ArrowX wallet/account records.

### 7.3 Gift-card payments

- Display the exact USD order total.
- Open the configured Rewarble/G2A purchase URL in a new tab.
- Tell the customer to return and submit the purchased card code.
- Require the card code before order creation.
- Do not claim automatic verification, automatic order transmission, or automatic delivery.
- Staff manually validates the code before fulfillment.

## 8. Payment Settings

Authorized CRM staff can manage:

- BTC public receiving address and QR image.
- LTC public receiving address and QR image.
- USDT TRC20 public receiving address and QR image.
- Gift-card purchase URL.

The system must never request or store wallet private keys, seed phrases, or exchange credentials. A payment method with incomplete settings is disabled and presented as temporarily unavailable.

## 9. Order and Verification State

Payment and fulfillment are separate state machines.

```ts
type PaymentStatus =
  | 'Verification Pending'
  | 'Verified'
  | 'Rejected';

type FulfillmentStatus =
  | 'Pending'
  | 'Claimed'
  | 'Completed'
  | 'Cancelled';
```

Rules:

- A new order starts as `Verification Pending` and `Pending`.
- Customer tracking describes the order as being processed during verification.
- Staff cannot claim, dispatch, or complete an unverified order.
- Verification records staff identity and timestamp.
- Rejection requires an internal reason and provides a safe customer-facing status.
- Rejection preserves the order and proof for audit/history.
- Verified orders can enter the existing claim and dispatch workflow.
- Invalid transitions fail server-side even if a client attempts them directly.

## 10. CRM Staff Experience

- Add a payment-verification queue.
- Show order ID, customer, age, product snapshot, USD amount, payment method, and submitted proof.
- Provide explicit Verify and Reject actions.
- Require a reason for rejection.
- Show verification identity and timestamp on completed reviews.
- Unlock claim/dispatch controls only for verified orders.
- Preserve existing order, customer, and support workflows outside the required extensions.

## 11. Customer Tracking Experience

- Display payment and fulfillment statuses separately.
- Show the immutable product/variant/offer snapshot and amount.
- Do not expose private proof files, full gift-card codes, staff-only notes, or internal rejection details.
- Provide a clear support path when payment is rejected or remains pending.

## 12. Validation and Security

- The shared catalog is authoritative for all IDs and prices.
- Ignore browser-submitted price values.
- Reject missing, unknown, inactive, or mismatched selections.
- Validate proof using the method-specific rules.
- Restrict screenshot MIME type and size.
- Generate filenames server-side and prevent path traversal.
- Escape and constrain customer-entered values.
- Restrict payment configuration, proof viewing, and verification actions to authorized CRM staff.
- Record audit metadata for verification and rejection.
- Never expose private payment configuration or staff-only notes in customer APIs.

## 13. Failure Handling

- A stale or removed catalog selection returns a clear unavailable-selection response and a path back to the product page.
- An incompletely configured payment method is disabled before submission.
- A screenshot upload failure retains text fields and permits retry.
- A successful order creation returns a stable order ID.
- A failed verification preserves the record and proof.
- Server routes reject claim, dispatch, or completion while payment is not verified.

## 14. Acceptance Criteria

### Catalog integrity

- Exactly 23 parent pages and 34 variants are present.
- Every offer label and price matches Section 3.
- No unlisted product, variant, or offer appears.
- `Starts from` uses the actual lowest child offer.
- Variant search leads to the correct parent product.

### Storefront interaction

- Variant selection stays within a single parent route.
- Variant artwork and offers update together.
- Checkout is disabled until an offer is selected.
- Mobile and desktop selectors remain usable and legible.
- Structured metadata reflects actual offers without fallback pricing.

### Checkout security

- Forged client prices cannot change order totals.
- Unknown or mismatched identifiers are rejected.
- Orders retain an immutable product and price snapshot.

### Payment proof

- Crypto accepts transaction hash only, screenshot only, or both.
- Crypto rejects submission when neither proof is supplied.
- Gift-card checkout requires a card code.
- Proof images are unavailable to unauthenticated customers.

### Order workflow

- New orders begin in payment verification and fulfillment pending states.
- Unverified orders cannot be claimed, dispatched, or completed.
- Verification records staff and time.
- Rejection requires a reason and retains order history.
- Customer tracking never exposes private proof or staff-only data.

### Artwork

- All 34 artwork files are unique.
- Each uses the green ArrowX logo in the corners.
- Game and variant names are spelled correctly and remain legible at supported breakpoints.

### Verification

- Focused catalog, API, authorization, state-transition, and UI tests pass.
- Production builds pass for both Next.js applications.
- A manual audit checks all 34 artwork assets and every pricing row against Section 3.

## 15. Explicit Non-Goals

- Separate pages for variants.
- Automatic blockchain, exchange, Rewarble, or G2A verification.
- Dynamic per-order wallet addresses or QR codes.
- A CRM catalog/pricing editor.
- Storing wallet secrets.
- Inventing unverified variant-specific capabilities or marketing claims.
- Retaining products absent from the approved pricing source.

