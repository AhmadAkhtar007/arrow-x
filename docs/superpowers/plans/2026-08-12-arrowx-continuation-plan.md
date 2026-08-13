# ArrowX Catalog and Checkout Continuation Plan

> **Starting point:** Continue from the uncommitted Task 2 checkpoint on branch `feature/arrowx-catalog-checkout` in `C:\Design\arrow-x\.worktrees\arrowx-catalog-checkout`.

**Goal:** Finish the approved 23-page/34-variant storefront and CRM manual-payment workflow, beginning by restoring the currently broken storefront build.

**Canonical references:**

- `docs/superpowers/specs/2026-08-12-arrowx-catalog-checkout-design.md`
- `docs/superpowers/plans/2026-08-12-arrowx-catalog-checkout.md`
- `docs/walkthroughs/2026-08-12-arrowx-progress-walkthrough.md`

## Phase 1: Stabilize and Complete the Storefront Migration

### 1.1 Revert unrelated generated files

- Inspect `app/next-env.d.ts` and `crm/next-env.d.ts`.
- Restore them from `HEAD` if changes contain only Next.js-generated path churn.
- Confirm no unrelated source file is included in the Task 2 commit.

### 1.2 Locate every legacy product-field consumer

Run:

```powershell
rg -n "product\.(image|tagline|rating|salesCount|isTopPick|pricing|lastUpdated)|pricing\.(day|week|month|lifetime)|allZadeyoProducts|ProductDetailModal" app/src -g '*.ts' -g '*.tsx'
```

Expected remaining hotspots include:

- `app/src/app/products/[id]/page.tsx`
- Possibly home/top-pick/status components not fully migrated.

Do not add compatibility shims for fabricated fields. Migrate each consumer to real canonical data.

### 1.3 Finish Task 2 parent-catalog views

- Clean up `ProductsCatalog.tsx` JSX and ensure it compiles.
- Ensure all prop array types accept readonly catalog arrays.
- Update `/products` cards to show parent name, category, option count, and real starting price.
- Ensure search by Avlon, Keyser, and Arcane Web returns the correct parent.
- Ensure price sorting uses `getStartingPrice()`.
- Update sitemap to derive exactly 23 parent routes from `catalog`.
- Keep status page parent-level; remove invented version/last-checked claims if they are not backed by data.
- Keep any top-picks choice deterministic and explicit; do not reintroduce fabricated popularity or ratings.
- Run `npm test` in `shared`.
- Run `npx next build --webpack` in `app`.
- Verify `http://localhost:3000` and `/products` return 200.
- Commit as `feat: render products from variant catalog` only after these checks pass.

## Phase 2: Build the Single-Page Variant Selector

### 2.1 Add aggregate-offer helper and tests

Add `getOfferSummary(productId)` to return exact `lowPrice`, `highPrice`, and `offerCount`. Test at least Valorant and Mecha Chamelion.

### 2.2 Create `ProductPurchaseSelector.tsx`

Required behavior:

- First variant selected visually on load.
- No offer selected on load.
- Variant controls use `aria-pressed`.
- Variant change resets the selected offer.
- Main artwork, variant name, offer list, and summary update together.
- Offer labels render exactly from the catalog.
- Checkout remains disabled until an offer is selected.
- Checkout URL passes only `product`, `variant`, and `offer` IDs to CRM port 3001.

### 2.3 Rewrite the parent detail route

Update `app/src/app/products/[id]/page.tsx` to:

- Use `findProduct()` for params, metadata, and rendering.
- Remove fixed tier cards and every fallback price.
- Remove fabricated ratings, sales counts, automatic delivery, and unverified capability claims.
- Use actual aggregate offer metadata in JSON-LD.
- Render one canonical route per parent and the in-page selector.
- Preserve only verified/minimal parent descriptions.

Verify at minimum:

- `/products/valorant`
- `/products/arc-raiders`
- `/products/spoofers`
- `/products/mecha-chamelion`

Test at 390px and 1440px widths, then commit `feat: add product variant selection`.

## Phase 3: Generate and Integrate 34 Branded Artworks

This phase must use the `imagegen` skill because the user explicitly requested unique AI artwork.

### 3.1 Build the artwork manifest/composition script

- Derive all filenames from canonical product and variant IDs.
- Require exactly 34 source images and 34 outputs.
- Use consistent landscape dimensions.
- Composite exact game and variant text deterministically rather than relying on generated text.
- Place the green ArrowX logo in both safe corners.
- Export WebP to `app/public/products/variants`.
- Add check mode for count, dimensions, nonzero size, and unique hashes.

### 3.2 Generate and review assets

- Generate one distinct source image per variant.
- Avoid generated logos/text and copyright-exact character replicas.
- Create a contact sheet.
- Inspect spelling, uniqueness, logo placement, legibility, and mobile crop.
- Verify exactly 34 unique hashes.

### 3.3 Parent hero images

The current catalog points to `/products/<product-id>.webp`. Either:

- Produce 23 parent hero images, or
- Change parent cards to use the first variant artwork as a deliberate canonical fallback.

Choose one consistent strategy and encode it in the catalog/component logic. Do not leave 404-backed logo fallbacks as the final visual system.

## Phase 4: Add Shared Order-Domain Rules and CRM Migration

Create `shared/src/orders.ts` and tests for:

- Server-side selection resolution.
- Payment method types.
- Crypto proof rule: transaction hash or screenshot or both.
- Gift-card proof rule: code required.
- Payment availability based on configured public data.
- Separate payment and fulfillment states.
- Legal fulfillment transitions only after verification.
- Forged amount ignored.

Extend CRM order storage with immutable snapshot fields:

- Product/variant/offer IDs.
- Product/variant/offer display names.
- `amountUsd`.
- `paymentStatus`.
- `fulfillmentStatus`.
- Payment proof references.
- Verification/rejection audit metadata.

Normalize legacy orders on read so existing fulfilled records are not stranded.

## Phase 5: Add CRM Payment Settings

Implement staff-only settings for:

- BTC public address and QR.
- LTC public address and QR.
- USDT TRC20 public address and QR.
- Gift-card purchase URL.

Add safe upload helpers:

- PNG/JPEG/WebP only.
- 5 MiB maximum.
- Server-generated filenames.
- Resolved-path containment checks.
- No private keys, seed phrases, or exchange credentials.

Add a focused `PaymentSettingsPanel` to the CRM admin interface without refactoring unrelated CRM behavior.

## Phase 6: Implement Server-Authoritative Order Creation

Replace the permissive current order API. The new POST route must:

- Require customer authentication.
- Derive customer identity from the session.
- Accept only product/variant/offer IDs, payment method, and method-specific proof.
- Resolve the exact price from the shared catalog.
- Ignore/reject browser amounts and display names.
- Disable incompletely configured methods.
- Store screenshots and gift-card codes privately.
- Create `Verification Pending` + `Pending` orders.
- Return a stable order ID and safe customer representation.

Add a staff-authenticated private-proof endpoint with `Cache-Control: private, no-store`.

## Phase 7: Build Authenticated Checkout

Create CRM `/checkout` and `CheckoutForm`:

- Safely preserve a local login continuation URL.
- Resolve selection server-side.
- Show immutable game, variant, offer, and USD total.
- Show only configured methods.
- Show address and QR for crypto.
- Emphasize USDT TRC20 network.
- Accept hash, screenshot, or both.
- Require gift-card code and open the configured external purchase URL.
- Keep inputs after upload/submission errors.
- Prevent duplicate submission.
- Show order ID, verification-pending status, and tracking link on success.

Keep the CRM live on port 3001 for user review as this phase lands.

## Phase 8: Add Verification and Fulfillment Enforcement

Add authenticated Verify/Reject API actions:

- Verify records staff and time.
- Reject requires an internal reason and records staff/time.
- Proof and history are retained.

Guard all claim, lock, and dispatch routes server-side:

```text
Verification Pending + Pending -> claim must fail
Verified + Pending -> claim succeeds
Verified + Claimed -> dispatch succeeds
Rejected + Pending -> claim must fail
```

Do not rely only on disabled buttons.

## Phase 9: Add Staff Queue and Customer Tracking

Create a focused payment verification queue showing:

- Order/customer details.
- Product snapshot and amount.
- Method and submitted proof.
- Verify and Reject actions.
- Required rejection reason.
- Audit metadata.

Update customer dashboard and tracking to show payment and fulfillment separately.

Customer APIs/pages must never expose:

- Raw card codes.
- Private proof filenames.
- Staff notes.
- Internal rejection reasons.
- Other customers' orders.

Single-order lookup must require an admin or the authenticated owner; order ID possession alone is not authorization.

## Phase 10: Final Verification and Handoff

### Automated checks

- Shared catalog and order tests pass.
- Storefront Webpack production build passes.
- CRM Webpack production build passes.
- No legacy fixed pricing or fabricated fallback remains.
- Artwork audit reports 34/34 unique assets.

### End-to-end payment matrix

Test:

| Product | Method | Proof | Expected total |
|---|---|---|---:|
| Valorant / Avlon / 1 Day | BTC | Hash only | $9.99 |
| ARC Raiders / Temporary Account / 300+ Hours | LTC | Screenshot only | $5.99 |
| NBA 2K26 / Internal / Lifetime | USDT TRC20 | Hash + screenshot | $499.99 |
| The Finals / Arcane / 1 Month | Gift Card | Card code | $41.99 |

For each, verify price authority, pending initial state, pre-verification fulfillment block, staff verification, claim/dispatch, and safe customer tracking.

### Documentation and review

- Document catalog updates, artwork regeneration, payment settings, staff verification, and filesystem persistence requirements.
- Show the user the complete final diff and live localhost results.
- Do not push or open a PR without explicit approval.

## Immediate Resume Checklist

When continuing, do these first:

1. Work in `C:\Design\arrow-x\.worktrees\arrowx-catalog-checkout`.
2. Confirm branch is `feature/arrowx-catalog-checkout`.
3. Confirm uncommitted Task 2 files match the walkthrough.
4. Revert only unrelated `next-env.d.ts` churn.
5. Run the legacy-consumer `rg` command.
6. Fix remaining storefront consumers, starting with `app/src/app/products/[id]/page.tsx`.
7. Run shared tests and storefront Webpack build sequentially.
8. Restore HTTP 200 at `http://localhost:3000/products`.
9. Commit Task 2 before proceeding to the variant selector.

