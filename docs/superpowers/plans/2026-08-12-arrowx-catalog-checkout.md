# ArrowX Catalog and Manual Payment Checkout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the storefront's fixed game pricing with the approved 23-product/34-variant catalog and connect selections to a CRM checkout with manually verified BTC, LTC, USDT TRC20, and gift-card payments.

**Architecture:** Add a zero-dependency local package named `@arrowx/shared` that both Next.js applications consume. The package owns catalog lookup, server-authoritative price resolution, payment-proof validation, and order transition rules; the storefront owns browsing and variant selection, while the CRM owns checkout, private proof storage, payment settings, verification, fulfillment, and tracking.

**Tech Stack:** Next.js 16.3, React 19, TypeScript 5.8, Tailwind CSS 4, Node.js 22 built-in test runner, JSON/file persistence already used by the CRM, AI-generated base artwork with deterministic ArrowX text/logo composition.

**Approved specification:** `docs/superpowers/specs/2026-08-12-arrowx-catalog-checkout-design.md`

---

## File Map

### Shared domain package

- Create `shared/package.json` — local package metadata and test script.
- Create `shared/src/catalog.ts` — canonical types, all 23 products, 34 variants, offers, artwork paths, and catalog lookup helpers.
- Create `shared/src/catalog.test.ts` — exact count, identity, label, price, and lookup tests.
- Create `shared/src/orders.ts` — checkout selection resolution, payment-proof validation, and legal state transitions.
- Create `shared/src/orders.test.ts` — forged-price, proof-rule, and transition tests.
- Modify `app/package.json` and `crm/package.json` — consume `@arrowx/shared` through `file:../shared`.
- Modify `app/next.config.mjs` and `crm/next.config.mjs` — transpile the local package.

### Storefront

- Modify `app/src/types.ts` — remove the obsolete fixed pricing contract and re-export shared catalog types.
- Modify `app/src/data/mockData.ts` — source product data from the shared catalog while retaining unrelated reviews and announcements.
- Delete `app/src/data/allZadeyoProducts.json` after all consumers use the shared catalog.
- Modify `app/src/components/ProductsCatalog.tsx` — parent-product cards, lowest-price calculation, and variant-aware search.
- Create `app/src/components/ProductPurchaseSelector.tsx` — client-side variant/offer selection and CRM checkout link.
- Modify `app/src/app/products/[id]/page.tsx` — render the shared product model, selector, real aggregate offers, and no fallback prices.
- Modify `app/src/app/sitemap.ts` — emit exactly the approved product routes.
- Create `app/scripts/compose-product-artwork.mjs` — deterministic title and green ArrowX corner-logo overlay.
- Create `app/public/products/variants/*.webp` — 34 final unique variant assets.
- Create `app/public/products/source/*.png` — generated source art used by the composition script.

### CRM domain, persistence, and APIs

- Modify `crm/src/lib/types.ts` — product snapshot, payment settings, proof, audit, and split status fields.
- Modify `crm/src/lib/db.ts` — backward-compatible database normalization and payment/order mutations.
- Modify `crm/data/arrowx-db.json` — add the `paymentSettings` object and normalize the seed order.
- Create `crm/src/lib/paymentFiles.ts` — safe private file validation, naming, write, and read helpers.
- Create `crm/data/payment-proofs/.gitkeep` — private proof storage directory for the existing filesystem persistence model.
- Create `crm/data/payment-assets/.gitkeep` — staff-managed QR image storage directory.
- Create `crm/src/app/api/admin/payment-settings/route.ts` — authenticated settings read/update.
- Create `crm/src/app/api/admin/payment-assets/route.ts` — authenticated QR upload.
- Create `crm/src/app/api/payment-proofs/[filename]/route.ts` — authenticated staff-only proof retrieval.
- Modify `crm/src/app/api/orders/route.ts` — identifier-only, server-priced order creation with method-specific proof validation.
- Create `crm/src/app/api/orders/[id]/verify/route.ts` — Verify/Reject payment actions and audit fields.
- Modify `crm/src/app/api/orders/[id]/claim/route.ts` — block claims until verified.
- Modify `crm/src/app/api/orders/[id]/lock/route.ts` — apply the same verified-payment guard.
- Modify `crm/src/app/api/orders/[id]/dispatch/route.ts` — block dispatch until verified.

### CRM checkout and interfaces

- Create `crm/src/app/checkout/page.tsx` — authenticated checkout route and selection resolution.
- Create `crm/src/components/CheckoutForm.tsx` — payment method selection, proof collection, submission, and success state.
- Modify `crm/src/app/login/page.tsx` — preserve and validate a local `next` destination.
- Create `crm/src/components/admin/PaymentSettingsPanel.tsx` — address, QR, and gift-card URL management.
- Create `crm/src/components/admin/PaymentVerificationQueue.tsx` — pending-proof review and Verify/Reject controls.
- Modify `crm/src/app/admin/page.tsx` — integrate the two focused admin components and gate fulfillment controls.
- Modify `crm/src/app/page.tsx` — show payment and fulfillment states separately in the customer dashboard.
- Modify `crm/src/app/track/[id]/page.tsx` — replace the redirect with safe order tracking.

---

### Task 1: Establish the Shared Package and Canonical Catalog

**Files:**
- Create: `shared/package.json`
- Create: `shared/src/catalog.ts`
- Create: `shared/src/catalog.test.ts`
- Modify: `app/package.json`
- Modify: `crm/package.json`
- Modify: `app/next.config.mjs`
- Modify: `crm/next.config.mjs`

- [ ] **Step 1: Create the local package metadata and failing catalog integrity test**

```json
{
  "name": "@arrowx/shared",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./catalog": "./src/catalog.ts",
    "./orders": "./src/orders.ts"
  },
  "scripts": {
    "test": "node --experimental-strip-types --test src/*.test.ts"
  }
}
```

Create `shared/src/catalog.test.ts` with the exact invariants below:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { catalog, findOffer, getStartingPrice } from './catalog.ts';

test('contains exactly the approved 23 products and 34 variants', () => {
  assert.equal(catalog.length, 23);
  assert.equal(catalog.flatMap((product) => product.variants).length, 34);
});

test('uses the approved Valorant variants and prices', () => {
  const valorant = catalog.find((product) => product.id === 'valorant');
  assert.deepEqual(valorant?.variants.map((variant) => variant.name), [
    'Avlon',
    'Unlocker',
    'Spoofer',
  ]);
  assert.equal(findOffer('valorant', 'avlon', '1-year')?.priceUsd, 249.99);
  assert.equal(findOffer('valorant', 'spoofer', 'lifetime')?.priceUsd, 199.99);
});

test('preserves irregular labels and non-monotonic source prices', () => {
  assert.equal(findOffer('arc-raiders', 'temporary-account', '0-99-hours')?.label, '0–99 Hours');
  assert.equal(findOffer('arc-raiders', 'temporary-account', '200-300-hours')?.priceUsd, 6.49);
  assert.equal(findOffer('arc-raiders', 'temporary-account', '300-plus-hours')?.priceUsd, 5.99);
  assert.equal(findOffer('spoofers', 'permanent', 'one-time-use')?.label, 'One-Time Use');
  assert.equal(findOffer('spoofers', 'permanent', 'unlimited-use')?.priceUsd, 69.99);
});

test('keeps the second Fortnite variant named Fortnite', () => {
  const fortnite = catalog.find((product) => product.id === 'fortnite');
  assert.deepEqual(fortnite?.variants.map((variant) => variant.name), ['Exodus', 'Fortnite']);
});

test('calculates starts-from across every child offer', () => {
  assert.equal(getStartingPrice('arc-raiders'), 3.99);
  assert.equal(getStartingPrice('valorant'), 4.99);
  assert.equal(getStartingPrice('the-finals'), 4.99);
});
```

- [ ] **Step 2: Run the shared tests to verify they fail**

Run: `cd shared && npm test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/catalog.ts`.

- [ ] **Step 3: Implement the catalog types and helpers**

Start `shared/src/catalog.ts` with these complete public contracts:

```ts
export type CatalogCategory =
  | 'Shooter'
  | 'Survival'
  | 'Battle Royale'
  | 'Sports'
  | 'Tools'
  | 'Accounts';

export interface PriceOffer {
  id: string;
  label: string;
  priceUsd: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  artwork: string;
  offers: readonly PriceOffer[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: CatalogCategory;
  description: string;
  heroImage: string;
  status: 'Undetected' | 'Updating' | 'Testing' | 'Available';
  features: readonly string[];
  compatibility: readonly string[];
  variants: readonly ProductVariant[];
}

export const catalog = [
  /* The complete 23-product literal is populated in this step from the approved Section 3 matrix. */
] as const satisfies readonly CatalogProduct[];

export function findProduct(productId: string) {
  return catalog.find((product) => product.id === productId);
}

export function findVariant(productId: string, variantId: string) {
  return findProduct(productId)?.variants.find((variant) => variant.id === variantId);
}

export function findOffer(productId: string, variantId: string, offerId: string) {
  return findVariant(productId, variantId)?.offers.find((offer) => offer.id === offerId);
}

export function getStartingPrice(productId: string): number | undefined {
  const prices = findProduct(productId)?.variants.flatMap((variant) =>
    variant.offers.map((offer) => offer.priceUsd),
  );
  return prices?.length ? Math.min(...prices) : undefined;
}
```

Populate the array completely in this same step from the exhaustive Section 3 matrix in `docs/superpowers/specs/2026-08-12-arrowx-catalog-checkout-design.md`; the step is not complete while the literal is empty or partial. Use artwork paths shaped as `/products/variants/<product-id>--<variant-id>.webp`. Preserve source spellings `Avlon`, `Mecha Chamelion`, and `0–99 Hours`. The count, identity, irregular-label, and price tests above are the executable completion gate.

- [ ] **Step 4: Wire both apps to the local package**

Add this dependency to both application manifests:

```json
"@arrowx/shared": "file:../shared"
```

Add this key to both `nextConfig` objects:

```js
transpilePackages: ['@arrowx/shared'],
```

Run: `cd app && npm install`

Run: `cd ../crm && npm install`

Expected: both lockfiles record `@arrowx/shared` as a local file dependency with no registry package added.

- [ ] **Step 5: Run catalog tests and builds**

Run: `cd ../shared && npm test`

Expected: 5 tests PASS.

Run: `cd ../app && npm run build`

Run: `cd ../crm && npm run build`

Expected: both production builds PASS and resolve `@arrowx/shared/catalog`.

- [ ] **Step 6: Commit the shared catalog boundary**

```bash
git add shared app/package.json app/package-lock.json app/next.config.mjs crm/package.json crm/package-lock.json crm/next.config.mjs
git commit -m "feat: add canonical ArrowX catalog"
```

If execution occurs in the current workspace, skip the commit because no Git repository is present; do not initialize one without user approval.

---

### Task 2: Migrate the Storefront Catalog to Parent Products

**Files:**
- Modify: `app/src/types.ts`
- Modify: `app/src/data/mockData.ts`
- Modify: `app/src/components/ProductsCatalog.tsx`
- Modify: `app/src/app/sitemap.ts`
- Delete: `app/src/data/allZadeyoProducts.json`

- [ ] **Step 1: Add a failing pure search test to the shared package**

Append to `shared/src/catalog.test.ts`:

```ts
import { searchCatalog } from './catalog.ts';

test('searches parent and variant names but returns parent products', () => {
  assert.deepEqual(searchCatalog('Avlon').map((product) => product.id), ['valorant']);
  assert.deepEqual(searchCatalog('Keyser').map((product) => product.id), ['fivem']);
  assert.deepEqual(searchCatalog('Arcane Web').map((product) => product.id), ['arc-raiders']);
});
```

Run: `cd shared && npm test`

Expected: FAIL because `searchCatalog` is not exported.

- [ ] **Step 2: Implement normalized parent/variant search**

Add to `shared/src/catalog.ts`:

```ts
export function searchCatalog(query: string): readonly CatalogProduct[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return catalog;

  return catalog.filter((product) =>
    product.name.toLocaleLowerCase().includes(normalized) ||
    product.description.toLocaleLowerCase().includes(normalized) ||
    product.variants.some((variant) =>
      variant.name.toLocaleLowerCase().includes(normalized),
    ),
  );
}
```

Run: `cd shared && npm test`

Expected: all 6 tests PASS.

- [ ] **Step 3: Remove the obsolete storefront pricing type and JSON source**

Replace the `Product` contract in `app/src/types.ts` with re-exports:

```ts
export type {
  CatalogCategory,
  CatalogProduct as Product,
  PriceOffer,
  ProductVariant,
} from '@arrowx/shared/catalog';
```

Change `app/src/data/mockData.ts` to:

```ts
import { catalog } from '@arrowx/shared/catalog';
import type { Product, Review, Announcement } from '../types';

export const productsData: readonly Product[] = catalog;
```

Keep the existing `reviewsData` and `announcementsData` exports unchanged. Remove `allZadeyoProducts.json` only after `rg "allZadeyoProducts" app/src` returns no matches.

- [ ] **Step 4: Update catalog rendering**

In `ProductsCatalog.tsx`:

- Import `getStartingPrice` and `searchCatalog`.
- Filter search through `searchCatalog(searchQuery)` and category through the existing selection.
- Replace `product.pricing.day` with `getStartingPrice(product.id)`.
- Replace sales/rating UI that is not present in the new verified model with variant count and availability.
- Use `product.heroImage` for the parent card.
- Render `${startingPrice.toFixed(2)}` with no `/day` suffix.
- Update the badge to `{product.variants.length} options`.

The resulting price block must be:

```tsx
const startingPrice = getStartingPrice(product.id);

<div>
  <div className="text-[10px] text-zinc-500 font-mono">Starts from</div>
  <div className="text-base font-bold font-display text-white">
    {startingPrice === undefined ? 'Unavailable' : `$${startingPrice.toFixed(2)}`}
  </div>
</div>
```

- [ ] **Step 5: Make sitemap derive from the canonical parents**

In `app/src/app/sitemap.ts`, map `catalog` into `/products/${product.id}` entries. Do not add variant URLs.

Run: `rg -n "pricing\.(day|week|month|lifetime)|allZadeyoProducts|\/day" app/src`

Expected: no obsolete pricing access or old JSON import remains.

Run: `cd app && npm run build`

Expected: PASS and static generation reports exactly the catalog-derived product routes.

- [ ] **Step 6: Commit the storefront catalog migration**

```bash
git add app/src app/package.json app/package-lock.json
git commit -m "feat: render products from variant catalog"
```

---

### Task 3: Add In-Page Variant and Offer Selection

**Files:**
- Create: `app/src/components/ProductPurchaseSelector.tsx`
- Modify: `app/src/app/products/[id]/page.tsx`

- [ ] **Step 1: Add failing aggregate-offer tests**

Append to `shared/src/catalog.test.ts`:

```ts
import { getOfferSummary } from './catalog.ts';

test('builds structured offer summaries without fallback tiers', () => {
  assert.deepEqual(getOfferSummary('valorant'), {
    lowPrice: 4.99,
    highPrice: 249.99,
    offerCount: 9,
  });
  assert.deepEqual(getOfferSummary('mecha-chamelion'), {
    lowPrice: 12.99,
    highPrice: 24.99,
    offerCount: 2,
  });
});
```

Run: `cd shared && npm test`

Expected: FAIL because `getOfferSummary` is not exported.

- [ ] **Step 2: Implement real aggregate offer metadata**

Add to `shared/src/catalog.ts`:

```ts
export function getOfferSummary(productId: string) {
  const prices = findProduct(productId)?.variants.flatMap((variant) =>
    variant.offers.map((offer) => offer.priceUsd),
  ) ?? [];
  if (!prices.length) return undefined;
  return {
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: prices.length,
  };
}
```

Run: `cd shared && npm test`

Expected: all 8 tests PASS.

- [ ] **Step 3: Build the client purchase selector**

Create `ProductPurchaseSelector.tsx` with this state contract:

```tsx
'use client';

import { useState } from 'react';
import type { CatalogProduct } from '@arrowx/shared/catalog';

export function ProductPurchaseSelector({ product }: { product: CatalogProduct }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? '');
  const [offerId, setOfferId] = useState('');
  const variant = product.variants.find((item) => item.id === variantId);
  const offer = variant?.offers.find((item) => item.id === offerId);

  function selectVariant(nextVariantId: string) {
    setVariantId(nextVariantId);
    setOfferId('');
  }

  const checkoutUrl = offer
    ? `http://localhost:3001/checkout?product=${encodeURIComponent(product.id)}&variant=${encodeURIComponent(variantId)}&offer=${encodeURIComponent(offer.id)}`
    : undefined;

  // Render accessible variant buttons, exact offer buttons, selected artwork,
  // immutable summary, and a disabled-or-linked checkout CTA from this state.
}
```

Implement the rendering in the same file with:

- `aria-pressed` on variant and offer buttons.
- Exact `variant.name`, `offer.label`, and `$${offer.priceUsd.toFixed(2)}` values.
- `variant.artwork` as the selected image.
- Disabled checkout until `offer` is defined.
- Offer selection reset whenever the variant changes.

- [ ] **Step 4: Replace hardcoded tier cards and fallback metadata**

In `app/src/app/products/[id]/page.tsx`:

- Use `findProduct` in `generateStaticParams`, metadata generation, and page rendering.
- Replace four hardcoded tier cards with `<ProductPurchaseSelector product={product} />`.
- Use `getOfferSummary(product.id)` for JSON-LD `lowPrice`, `highPrice`, and `offerCount`.
- Remove every `|| 4.99`, `|| 14.99`, `|| 39.99`, and `|| 99.99` fallback.
- Keep only verified parent-level description, features, and compatibility from the catalog.
- Remove fixed claims such as `0.0s Key Dispatch` where they contradict manual verification.

Run: `rg -n "\|\| [0-9]+\.[0-9]+|1-Day Pass|7-Day Pass|30-Day VIP|Lifetime Pass|0\.0s Key" app/src/app/products`

Expected: no hardcoded offer/fallback matches.

Run: `cd app && npm run build`

Expected: PASS; every approved parent route builds.

- [ ] **Step 5: Manually verify responsive selection**

Run: `cd app && npm run dev`

Check `/products/valorant`, `/products/arc-raiders`, and `/products/spoofers` at 390px and 1440px widths.

Expected: variant controls remain usable, exact irregular offer labels remain visible, changing a variant clears the offer, and checkout stays disabled until a new offer is selected.

- [ ] **Step 6: Commit variant selection**

```bash
git add app/src/components/ProductPurchaseSelector.tsx app/src/app/products/[id]/page.tsx shared/src
git commit -m "feat: add product variant selection"
```

---

### Task 4: Produce and Integrate 34 Branded Variant Artworks

**Files:**
- Create: `app/scripts/compose-product-artwork.mjs`
- Create: `app/public/products/source/*.png`
- Create: `app/public/products/variants/*.webp`
- Reuse: `app/public/assets/logo-green.png`

- [ ] **Step 1: Generate a manifest from the canonical catalog**

Make `compose-product-artwork.mjs` import `catalog`, flatten variants, and assert 34 unique output names:

```js
const variants = catalog.flatMap((product) =>
  product.variants.map((variant) => ({
    game: product.name,
    variant: variant.name,
    source: `public/products/source/${product.id}--${variant.id}.png`,
    output: `public/products/variants/${product.id}--${variant.id}.webp`,
  })),
);

if (variants.length !== 34) throw new Error(`Expected 34 variants, received ${variants.length}`);
if (new Set(variants.map((item) => item.output)).size !== 34) throw new Error('Duplicate artwork output path');
```

Run: `cd app && node scripts/compose-product-artwork.mjs --check`

Expected: FAIL and list all 34 missing source images.

- [ ] **Step 2: Generate unique source artwork**

Use the `imagegen` skill during execution. Generate one distinct 3:2 landscape product-box scene per manifest entry. Prompts must request game-inspired, non-logo-infringing original visual language, leave clean title-safe space, and omit generated text because exact typography will be composited deterministically.

Expected filenames include:

```text
valorant--avlon.png
valorant--unlocker.png
valorant--spoofer.png
arc-raiders--ancient.png
arc-raiders--arcane.png
arc-raiders--arcane-web.png
arc-raiders--temporary-account.png
arc-raiders--15-day-inactive.png
rainbow-six-siege--ivy.png
rainbow-six-siege--exodus.png
rainbow-six-siege--crusader.png
```

The script must derive every other filename directly from the canonical 34 catalog variant IDs; handwritten filename lists are prohibited because they can drift from the catalog.

- [ ] **Step 3: Composite exact titles and ArrowX branding**

Use a deterministic image library already available in the Codex workspace runtime to:

- Resize/crop every source to one consistent landscape dimension.
- Add the exact parent name and variant name from the catalog.
- Add `app/public/assets/logo-green.png` in both top-left and bottom-right safe corners.
- Export optimized WebP files to `public/products/variants`.
- Fail rather than overwrite an output from a duplicate ID.

The script's `--check` mode must verify dimensions, file existence, nonzero size, unique output hashes, and a count of 34.

- [ ] **Step 4: Run the artwork audit**

Run: `cd app && node scripts/compose-product-artwork.mjs --check`

Expected: `34/34 variant artworks valid; 34 unique hashes`.

Manually inspect a contact sheet covering all 34 assets.

Expected: exact spellings, unique imagery, readable text, green logo in both corners, and no unsafe crop at 390px or 1440px layouts.

- [ ] **Step 5: Build and commit artwork**

Run: `cd app && npm run build`

Expected: PASS with no missing local image asset.

```bash
git add app/scripts app/public/products app/src
git commit -m "feat: add branded variant artwork"
```

---

### Task 5: Add Order-Domain Rules and Backward-Compatible CRM Storage

**Files:**
- Create: `shared/src/orders.ts`
- Create: `shared/src/orders.test.ts`
- Modify: `crm/src/lib/types.ts`
- Modify: `crm/src/lib/db.ts`
- Modify: `crm/data/arrowx-db.json`

- [ ] **Step 1: Write failing order-domain tests**

Create `shared/src/orders.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveCheckoutSelection, validatePaymentProof, canTransitionOrder } from './orders.ts';

test('resolves price from catalog and ignores a forged browser amount', () => {
  const resolved = resolveCheckoutSelection({
    productId: 'valorant',
    variantId: 'avlon',
    offerId: '1-day',
  });
  assert.equal(resolved.amountUsd, 9.99);
  assert.equal(resolved.variantName, 'Avlon');
});

test('rejects mismatched catalog identifiers', () => {
  assert.throws(() => resolveCheckoutSelection({
    productId: 'valorant',
    variantId: 'arcane',
    offerId: '1-day',
  }), /Selection is no longer available/);
});

test('crypto accepts either proof or both and rejects neither', () => {
  assert.deepEqual(validatePaymentProof('BTC', { transactionHash: 'abc', screenshotFile: null }), []);
  assert.deepEqual(validatePaymentProof('LTC', { transactionHash: '', screenshotFile: 'proof.png' }), []);
  assert.deepEqual(validatePaymentProof('USDT_TRC20', { transactionHash: 'abc', screenshotFile: 'proof.png' }), []);
  assert.deepEqual(validatePaymentProof('BTC', { transactionHash: '', screenshotFile: null }), [
    'Provide a transaction hash, payment screenshot, or both.',
  ]);
});

test('gift card requires a code', () => {
  assert.deepEqual(validatePaymentProof('GIFT_CARD', { giftCardCode: '' }), [
    'Gift-card code is required.',
  ]);
});

test('fulfillment is blocked until payment is verified', () => {
  assert.equal(canTransitionOrder('Verification Pending', 'Pending', 'claim'), false);
  assert.equal(canTransitionOrder('Verified', 'Pending', 'claim'), true);
  assert.equal(canTransitionOrder('Rejected', 'Pending', 'dispatch'), false);
});
```

Run: `cd shared && npm test`

Expected: FAIL because `orders.ts` does not exist.

- [ ] **Step 2: Implement domain contracts and pure rules**

Create `shared/src/orders.ts` with:

```ts
import { findOffer, findProduct, findVariant } from './catalog.ts';

export type PaymentMethod = 'BTC' | 'LTC' | 'USDT_TRC20' | 'GIFT_CARD';
export type PaymentStatus = 'Verification Pending' | 'Verified' | 'Rejected';
export type FulfillmentStatus = 'Pending' | 'Claimed' | 'Completed' | 'Cancelled';

export interface CheckoutSelection {
  productId: string;
  variantId: string;
  offerId: string;
}

export function resolveCheckoutSelection(selection: CheckoutSelection) {
  const product = findProduct(selection.productId);
  const variant = findVariant(selection.productId, selection.variantId);
  const offer = findOffer(selection.productId, selection.variantId, selection.offerId);
  if (!product || !variant || !offer) throw new Error('Selection is no longer available.');
  return {
    ...selection,
    productName: product.name,
    variantName: variant.name,
    offerLabel: offer.label,
    amountUsd: offer.priceUsd,
  };
}

export function validatePaymentProof(method: PaymentMethod, proof: {
  transactionHash?: string;
  screenshotFile?: string | null;
  giftCardCode?: string;
}): string[] {
  if (method === 'GIFT_CARD') {
    return proof.giftCardCode?.trim() ? [] : ['Gift-card code is required.'];
  }
  return proof.transactionHash?.trim() || proof.screenshotFile
    ? []
    : ['Provide a transaction hash, payment screenshot, or both.'];
}

export function canTransitionOrder(
  paymentStatus: PaymentStatus,
  fulfillmentStatus: FulfillmentStatus,
  action: 'claim' | 'unclaim' | 'dispatch' | 'cancel',
): boolean {
  if (action === 'cancel') return fulfillmentStatus !== 'Completed';
  if (paymentStatus !== 'Verified') return false;
  if (action === 'claim') return fulfillmentStatus === 'Pending';
  if (action === 'unclaim') return fulfillmentStatus === 'Claimed';
  return fulfillmentStatus === 'Claimed';
}
```

Run: `cd shared && npm test`

Expected: all tests PASS.

- [ ] **Step 3: Extend CRM types without deleting legacy records**

Add these fields to `RealOrder`:

```ts
productId: string;
variantId: string;
offerId: string;
productName: string;
variantName: string;
offerLabel: string;
amountUsd: number;
paymentMethod: PaymentMethod;
paymentStatus: PaymentStatus;
fulfillmentStatus: FulfillmentStatus;
paymentProof: {
  transactionHash?: string;
  screenshotFile?: string;
  giftCardCodeMasked?: string;
  giftCardCodeFile?: string;
};
verifiedBy?: string | null;
verifiedAt?: string | null;
rejectedBy?: string | null;
rejectedAt?: string | null;
rejectionReason?: string | null;
```

Retain `gameName`, `planTier`, `amount`, and `status` only during migration if existing UI still reads them; remove those aliases after Tasks 8–10 migrate every consumer.

Add:

```ts
export interface PaymentSettings {
  BTC: { address: string; qrImageFile: string };
  LTC: { address: string; qrImageFile: string };
  USDT_TRC20: { address: string; qrImageFile: string };
  giftCardPurchaseUrl: string;
  updatedAt: string | null;
  updatedBy: string | null;
}
```

- [ ] **Step 4: Normalize the JSON database on read**

Extend the database shape with `paymentSettings`. In `readDb`, map legacy orders to the new split states:

```ts
function normalizeOrder(order: RealOrder | LegacyOrder): RealOrder {
  const legacyStatus = 'status' in order ? order.status : undefined;
  return {
    ...order,
    paymentStatus: 'paymentStatus' in order ? order.paymentStatus : 'Verified',
    fulfillmentStatus: 'fulfillmentStatus' in order
      ? order.fulfillmentStatus
      : legacyStatus === 'Completed' || legacyStatus === 'Processed'
        ? 'Completed'
        : legacyStatus === 'Claimed'
          ? 'Claimed'
          : 'Pending',
  } as RealOrder;
}
```

Mark existing seeded orders `Verified` because they predate the verification feature; do not strand historical fulfilled orders.

- [ ] **Step 5: Verify domain tests and CRM build**

Run: `cd shared && npm test`

Run: `cd ../crm && npm run build`

Expected: PASS with existing JSON records readable.

- [ ] **Step 6: Commit domain and persistence changes**

```bash
git add shared/src/orders* crm/src/lib crm/data/arrowx-db.json
git commit -m "feat: add payment and fulfillment state model"
```

---

### Task 6: Add Staff-Managed Payment Settings

**Files:**
- Modify: `crm/src/lib/db.ts`
- Create: `crm/src/lib/paymentFiles.ts`
- Create: `crm/src/app/api/admin/payment-settings/route.ts`
- Create: `crm/src/app/api/admin/payment-assets/route.ts`
- Create: `crm/src/components/admin/PaymentSettingsPanel.tsx`
- Modify: `crm/src/app/admin/page.tsx`
- Create: `crm/data/payment-assets/.gitkeep`

- [ ] **Step 1: Add pure payment-method availability tests**

Append to `shared/src/orders.test.ts`:

```ts
import { getPaymentAvailability } from './orders.ts';

test('disables incompletely configured payment methods', () => {
  const availability = getPaymentAvailability({
    BTC: { address: 'bc1-example', qrImageFile: 'btc.png' },
    LTC: { address: '', qrImageFile: '' },
    USDT_TRC20: { address: 'T-example', qrImageFile: 'usdt.png' },
    giftCardPurchaseUrl: 'https://example.com/gift-card',
  });
  assert.deepEqual(availability, {
    BTC: true,
    LTC: false,
    USDT_TRC20: true,
    GIFT_CARD: true,
  });
});
```

Implement `getPaymentAvailability` as strict nonempty address+QR checks and an `https:` URL check for gift cards. Run `npm test`; expect PASS.

- [ ] **Step 2: Implement safe payment image storage**

In `paymentFiles.ts`, allow PNG, JPEG, and WebP only; cap uploads at 5 MiB; ignore original filenames; create names with `crypto.randomUUID()`; resolve the final path and assert it remains under `crm/data/payment-assets` or `crm/data/payment-proofs`.

Expose these functions:

```ts
export async function savePaymentFile(
  file: File,
  kind: 'asset' | 'proof',
): Promise<string>;

export async function readPaymentFile(
  filename: string,
  kind: 'asset' | 'proof',
): Promise<{ bytes: Buffer; contentType: string } | null>;

export async function savePrivateText(
  value: string,
  kind: 'gift-card-code',
): Promise<string>;
```

`savePrivateText` writes the trimmed card code under a server-generated filename in `crm/data/payment-proofs`, returns only that filename, and applies the same resolved-path containment check as image proofs. Raw card codes never enter the normal order JSON or customer responses.

- [ ] **Step 3: Add authenticated settings APIs**

`GET /api/admin/payment-settings` returns public addresses, asset filenames, gift-card URL, and audit metadata only to `admin` or `superadmin` sessions.

`PUT /api/admin/payment-settings` accepts:

```ts
{
  BTC: { address: string; qrImageFile: string };
  LTC: { address: string; qrImageFile: string };
  USDT_TRC20: { address: string; qrImageFile: string };
  giftCardPurchaseUrl: string;
}
```

It trims values, rejects a non-HTTPS gift-card URL, stores `updatedBy` and ISO `updatedAt`, and never accepts private-key-like fields.

`POST /api/admin/payment-assets` accepts multipart field `file`, stores it through `savePaymentFile(file, 'asset')`, and returns `{ filename }`.

- [ ] **Step 4: Build the focused settings panel**

`PaymentSettingsPanel.tsx` must:

- Load current settings.
- Render BTC, LTC, and USDT TRC20 address inputs.
- Upload/preview one QR image per method.
- Render the gift-card purchase URL input.
- Show saved/error/loading states.
- Label the USDT network as `TRC20` everywhere.
- Never render fields for seed phrases or private keys.

Integrate the panel as a new admin tab/section without moving unrelated order or ticket code.

- [ ] **Step 5: Verify settings authorization and build**

Run the CRM locally and verify unauthenticated GET/PUT/POST requests return 403, invalid gift-card URLs return 400, and a superadmin can save and reload all public settings.

Run: `cd crm && npm run build`

Expected: PASS.

- [ ] **Step 6: Commit payment settings**

```bash
git add crm/src/lib crm/src/app/api/admin crm/src/components/admin crm/src/app/admin/page.tsx crm/data/payment-assets
git commit -m "feat: add CRM payment settings"
```

---

### Task 7: Implement Server-Authoritative Checkout and Private Proof Storage

**Files:**
- Modify: `crm/src/app/api/orders/route.ts`
- Modify: `crm/src/lib/db.ts`
- Create: `crm/src/app/api/payment-proofs/[filename]/route.ts`
- Create: `crm/data/payment-proofs/.gitkeep`

- [ ] **Step 1: Extract and test order creation input parsing**

Add a pure `parseCheckoutFields` function to `shared/src/orders.ts` that accepts string values, calls `resolveCheckoutSelection`, validates `PaymentMethod`, and calls `validatePaymentProof`. Test:

```ts
test('never accepts amount from checkout input', () => {
  const result = parseCheckoutFields({
    productId: 'nba-2k26',
    variantId: 'internal',
    offerId: 'lifetime',
    paymentMethod: 'BTC',
    transactionHash: 'hash',
    amount: '0.01',
  });
  assert.equal(result.selection.amountUsd, 499.99);
  assert.equal('amount' in result.selection, false);
});
```

Run: `cd shared && npm test`

Expected: FAIL before implementation, PASS afterward.

- [ ] **Step 2: Replace the permissive order POST contract**

Change `POST /api/orders` to accept multipart fields:

```text
productId
variantId
offerId
paymentMethod
transactionHash (optional for crypto)
paymentScreenshot (optional for crypto)
giftCardCode (required for gift cards)
discordHandle (optional)
```

Require a logged-in customer session and derive customer email/user ID from that session. Do not accept `customerEmail`, `gameName`, `planTier`, or `amount` from the browser.

Processing order:

1. Resolve the catalog selection.
2. Confirm the payment method is fully configured.
3. Save an optional screenshot with `savePaymentFile(file, 'proof')`.
4. Validate method-specific proof.
5. Create the immutable order snapshot.
6. Store `Verification Pending` + `Pending`.
7. Mask the gift-card code in normal order responses; retain its protected stored value only for staff verification.

- [ ] **Step 3: Add private proof retrieval**

`GET /api/payment-proofs/[filename]` must:

- Require an `admin` or `superadmin` session.
- Reject filenames containing separators or traversal sequences.
- Read only from `crm/data/payment-proofs`.
- Return the stored bytes with the correct content type and `Cache-Control: private, no-store`.
- Return 404 for missing files.

- [ ] **Step 4: Verify forged-price and proof behavior manually**

Submit an NBA 2K26 Lifetime BTC order with a forged `amount=0.01` and a transaction hash.

Expected: stored `amountUsd` is `$499.99`.

Submit BTC without hash or screenshot.

Expected: 400 with `Provide a transaction hash, payment screenshot, or both.`

Submit gift card without a code.

Expected: 400 with `Gift-card code is required.`

Fetch a proof while logged out.

Expected: 403.

- [ ] **Step 5: Build and commit checkout APIs**

Run: `cd shared && npm test`

Run: `cd ../crm && npm run build`

Expected: PASS.

```bash
git add shared/src/orders* crm/src/app/api/orders crm/src/app/api/payment-proofs crm/src/lib crm/data/payment-proofs
git commit -m "feat: create server-priced payment orders"
```

---

### Task 8: Build the Authenticated Checkout Experience

**Files:**
- Create: `crm/src/app/checkout/page.tsx`
- Create: `crm/src/components/CheckoutForm.tsx`
- Modify: `crm/src/app/login/page.tsx`

- [ ] **Step 1: Implement safe login continuation**

Read a `next` query parameter on the login page. Accept it only when it starts with `/` and not `//`; otherwise use `/`. After authentication, navigate to the validated local path.

The storefront checkout link must target:

```text
http://localhost:3001/checkout?product=<productId>&variant=<variantId>&offer=<offerId>
```

The checkout page redirects logged-out users to:

```text
/login?next=<encoded local checkout path and query>
```

- [ ] **Step 2: Resolve and render the immutable checkout summary**

In `checkout/page.tsx`, validate `product`, `variant`, and `offer` query values with `resolveCheckoutSelection`. Invalid selections render a clear unavailable-selection state with a link back to `http://localhost:3000/products/<productId>` when the parent exists.

Pass this server-resolved object to `CheckoutForm`:

```ts
{
  productId,
  productName,
  variantId,
  variantName,
  offerId,
  offerLabel,
  amountUsd,
}
```

- [ ] **Step 3: Implement payment selection and proof rules in the UI**

`CheckoutForm` must:

- Render only configured methods; incomplete methods appear disabled as temporarily unavailable.
- Display address and QR for BTC/LTC/USDT TRC20.
- Display `USDT — TRC20` prominently.
- For crypto, accept transaction hash, screenshot, or both and require at least one.
- For gift card, show `$${amountUsd.toFixed(2)}`, open the configured external URL in a new tab, and require card code.
- Preserve entered text when file upload/submission fails.
- Disable the submit button while sending.
- POST multipart data to `/api/orders` without an amount field.
- On success, show order ID, `Payment Verification Pending`, and `/track/<orderId>`.

- [ ] **Step 4: Verify all four checkout paths**

Manually test BTC hash-only, LTC screenshot-only, USDT both proofs, and gift-card code flows.

Expected: each produces one pending-verification order with the correct product snapshot and exact source price.

Run: `cd crm && npm run build`

Expected: PASS.

- [ ] **Step 5: Commit checkout UI**

```bash
git add crm/src/app/checkout crm/src/components/CheckoutForm.tsx crm/src/app/login/page.tsx
git commit -m "feat: add manual payment checkout"
```

---

### Task 9: Add Payment Verification and Enforce Fulfillment Guards

**Files:**
- Modify: `crm/src/lib/db.ts`
- Create: `crm/src/app/api/orders/[id]/verify/route.ts`
- Modify: `crm/src/app/api/orders/[id]/claim/route.ts`
- Modify: `crm/src/app/api/orders/[id]/lock/route.ts`
- Modify: `crm/src/app/api/orders/[id]/dispatch/route.ts`

- [ ] **Step 1: Add transition edge-case tests**

Append to `shared/src/orders.test.ts`:

```ts
test('allows only valid fulfillment transitions after verification', () => {
  assert.equal(canTransitionOrder('Verified', 'Pending', 'claim'), true);
  assert.equal(canTransitionOrder('Verified', 'Pending', 'dispatch'), false);
  assert.equal(canTransitionOrder('Verified', 'Claimed', 'dispatch'), true);
  assert.equal(canTransitionOrder('Verified', 'Completed', 'unclaim'), false);
});
```

Run: `cd shared && npm test`

Expected: PASS with the Task 5 implementation.

- [ ] **Step 2: Add audited verification mutations**

Add DB functions:

```ts
export async function verifyOrderPayment(
  orderId: string,
  adminName: string,
): Promise<RealOrder | null>;

export async function rejectOrderPayment(
  orderId: string,
  adminName: string,
  reason: string,
): Promise<RealOrder | null>;
```

Verification sets `paymentStatus='Verified'`, `verifiedBy`, `verifiedAt`, and clears rejection fields. Rejection requires a trimmed reason, sets `paymentStatus='Rejected'`, `rejectedBy`, `rejectedAt`, and `rejectionReason`, and leaves proof/history intact.

- [ ] **Step 3: Add the verification route**

`POST /api/orders/[id]/verify` accepts:

```ts
{ action: 'verify' }
```

or:

```ts
{ action: 'reject'; reason: string }
```

Require admin/superadmin. Return 400 for unknown action, missing rejection reason, or an already completed order; return 404 for unknown ID.

- [ ] **Step 4: Guard every fulfillment entry point**

Before claim, lock, or dispatch, load the order and call `canTransitionOrder`. Return status 409 with:

```json
{ "error": "Payment must be verified before fulfillment." }
```

Do not rely on button disabling; the server route is authoritative.

- [ ] **Step 5: Verify illegal and legal transitions**

Expected sequence:

```text
Verification Pending + Pending -> claim: 409
Verified + Pending -> claim: 200, becomes Claimed
Verified + Claimed -> dispatch: 200, becomes Completed
Rejected + Pending -> claim: 409
```

Run: `cd shared && npm test`

Run: `cd ../crm && npm run build`

Expected: PASS.

- [ ] **Step 6: Commit verification enforcement**

```bash
git add shared/src/orders* crm/src/lib/db.ts crm/src/app/api/orders
git commit -m "feat: verify payments before fulfillment"
```

---

### Task 10: Add the Staff Verification Queue and Safe Customer Status Views

**Files:**
- Create: `crm/src/components/admin/PaymentVerificationQueue.tsx`
- Modify: `crm/src/app/admin/page.tsx`
- Modify: `crm/src/app/page.tsx`
- Modify: `crm/src/app/track/[id]/page.tsx`
- Modify: `crm/src/app/api/orders/route.ts`

- [ ] **Step 1: Define safe customer serialization**

Add a pure helper in `crm/src/lib/db.ts` or a focused `crm/src/lib/orderView.ts`:

```ts
export function toCustomerOrder(order: RealOrder) {
  const {
    paymentProof,
    rejectionReason,
    notes,
    ...safe
  } = order;
  return {
    ...safe,
    hasSubmittedProof: Boolean(
      paymentProof.transactionHash ||
      paymentProof.screenshotFile ||
      paymentProof.giftCardCodeMasked
    ),
  };
}
```

Use it for every non-admin order response. Never return raw/full gift-card codes, private proof filenames, staff notes, or internal rejection reasons to customers. For single-order lookup, require either an admin session or a customer session whose email matches the order; possession of an order ID alone is not authorization.

- [ ] **Step 2: Build the verification queue**

`PaymentVerificationQueue.tsx` filters `paymentStatus === 'Verification Pending'` and renders:

- Order ID and age.
- Customer name/email/Discord.
- Product, variant, offer, and USD amount snapshot.
- Payment method.
- Transaction hash when supplied.
- Authenticated screenshot link when supplied.
- Masked card-code display plus a staff-only reveal action that reads `giftCardCodeFile` through the authenticated private-proof endpoint.
- Verify button.
- Reject button that requires a nonempty reason.
- Loading/error/success feedback.

After a successful action, update the parent order state without a full page reload.

- [ ] **Step 3: Integrate queue and fulfillment gating in admin**

Add the queue as its own admin section. Existing pending/claimed/completed columns should use `fulfillmentStatus`. Disable/hide Claim and Dispatch actions until `paymentStatus === 'Verified'`, while retaining the server guards from Task 9.

Display verifier/rejector identity and timestamp in the order detail modal.

- [ ] **Step 4: Update customer dashboard status cards**

In `crm/src/app/page.tsx`, replace the single `ord.status` badge with:

```tsx
<PaymentStatusBadge status={ord.paymentStatus} />
<FulfillmentStatusBadge status={ord.fulfillmentStatus} />
```

During verification show `Payment verification pending — your order is being processed.` Do not show `Allocating key` until payment is verified.

- [ ] **Step 5: Replace track redirect with a safe tracking page**

`track/[id]/page.tsx` requires customer authentication, loads `/api/orders?id=<id>`, verifies that the active customer's email owns the order, and displays:

- Order ID.
- Product, variant, offer, and amount snapshot.
- Payment method.
- Payment status.
- Fulfillment status.
- Created/updated timestamps.
- Support link.

It must not display proof contents, private filenames, card codes, notes, verifier identity, or internal rejection reason.

- [ ] **Step 6: Verify staff/customer data separation**

Inspect logged-out, customer, admin, and superadmin order responses.

Expected: only staff responses contain payment proof and audit detail; customer/tracking responses are sanitized.

Run: `cd crm && npm run build`

Expected: PASS.

- [ ] **Step 7: Commit admin and tracking views**

```bash
git add crm/src/components/admin crm/src/app/admin/page.tsx crm/src/app/page.tsx crm/src/app/track crm/src/app/api/orders crm/src/lib
git commit -m "feat: add payment verification workflow"
```

---

### Task 11: Remove Migration Aliases and Run the Full Acceptance Audit

**Files:**
- Modify: `crm/src/lib/types.ts`
- Modify: `crm/src/lib/db.ts`
- Modify: all remaining legacy order consumers reported by `rg`
- Modify: `app/README.md`
- Modify: `crm/README.md` if created; otherwise add `crm/OPERATIONS.md`

- [ ] **Step 1: Find and remove obsolete order/catalog contracts**

Run:

```bash
rg -n "gameName|planTier|amount\b|status\b|pricing\.(day|week|month|lifetime)|allZadeyoProducts" app/src crm/src
```

Classify every result. Replace legacy order display fields with `productName`, `variantName`, `offerLabel`, `amountUsd`, `paymentStatus`, and `fulfillmentStatus`. Remove compatibility aliases from `RealOrder` and the DB normalization output once no runtime consumer needs them.

Expected: remaining generic `status` matches belong only to tickets, catalog availability, or unrelated UI.

- [ ] **Step 2: Run exact catalog audits**

Run: `cd shared && npm test`

Expected: all catalog and order-domain tests PASS, including exactly 23 products and 34 variants.

Compare every catalog offer against Section 3 of the approved specification. Pay special attention to:

```text
ARC Raiders Temporary Account 200–300 Hours = $6.49
ARC Raiders Temporary Account 300+ Hours = $5.99
Fortnite / Fortnite 3 Days = $7.99
NBA 2K26 Internal Lifetime = $499.99
The Finals Arcane 1 Month = $41.99
```

- [ ] **Step 3: Run artwork audit**

Run: `cd app && node scripts/compose-product-artwork.mjs --check`

Expected: exactly 34 files, 34 unique hashes, valid dimensions, and no missing catalog artwork.

- [ ] **Step 4: Run both production builds**

Run: `cd app && npm run build`

Run: `cd ../crm && npm run build`

Expected: both PASS with no TypeScript, route-generation, or missing-asset errors.

- [ ] **Step 5: Execute the end-to-end payment matrix**

Test these four orders:

| Selection | Method | Proof | Expected total |
|---|---|---|---:|
| Valorant / Avlon / 1 Day | BTC | Transaction hash only | $9.99 |
| ARC Raiders / Temporary Account / 300+ Hours | LTC | Screenshot only | $5.99 |
| NBA 2K26 / Internal / Lifetime | USDT TRC20 | Hash + screenshot | $499.99 |
| The Finals / Arcane / 1 Month | Gift Card | Card code | $41.99 |

For each order verify:

1. Checkout ignores any forged amount.
2. The order starts `Verification Pending` + `Pending`.
3. Claim fails before verification.
4. Staff can inspect the submitted proof.
5. Verify records staff and timestamp.
6. Claim then dispatch succeeds.
7. Customer tracking shows safe split statuses without private proof data.

- [ ] **Step 6: Document operations**

Document:

- How to update catalog prices through code review.
- How to regenerate/check artwork.
- How superadmins update public addresses, QR images, and the gift-card URL.
- That only public receiving information belongs in settings.
- How staff verifies or rejects payments.
- That filesystem persistence requires durable writable storage in production because the current CRM already uses JSON/file persistence.

- [ ] **Step 7: Review the final diff with the human partner**

Show the complete diff and the test/build/artwork audit output. Do not publish, push, or open a pull request without explicit human approval. If contributing upstream, also follow every PR-template and duplicate-search requirement in the repository instructions.

- [ ] **Step 8: Commit the verified end-to-end feature**

```bash
git add app crm shared docs
git commit -m "feat: complete ArrowX catalog and payment verification"
```

Skip commits in a non-Git workspace; never initialize a repository or publish changes without user authorization.

---

## Final Definition of Done

- [ ] The shared catalog contains exactly 23 parent products and 34 variants.
- [ ] Every offer label and price matches the approved specification.
- [ ] Storefront variant selection remains on one route per parent product.
- [ ] All 34 unique artworks contain deterministic green ArrowX corner branding.
- [ ] CRM resolves price from catalog IDs and ignores client amounts.
- [ ] BTC, LTC, and USDT TRC20 require a transaction hash, screenshot, or both.
- [ ] Gift-card checkout requires a submitted card code and makes no automatic-verification claim.
- [ ] Public addresses, QR images, and gift-card URL are staff-managed.
- [ ] Payment and fulfillment states are separate.
- [ ] Unverified/rejected orders cannot enter fulfillment.
- [ ] Private proof and staff notes never reach customer responses.
- [ ] Shared tests and both production builds pass.
- [ ] The complete diff receives explicit human review before publication.
