# ArrowX Catalog and Checkout Progress Walkthrough

**Checkpoint date:** 2026-08-12  
**Feature worktree:** `C:\Design\arrow-x\.worktrees\arrowx-catalog-checkout`  
**Branch:** `feature/arrowx-catalog-checkout`  
**Baseline branch:** `main` at `212657e`  
**Canonical requirements:** `docs/superpowers/specs/2026-08-12-arrowx-catalog-checkout-design.md`  
**Original full implementation plan:** `docs/superpowers/plans/2026-08-12-arrowx-catalog-checkout.md`

## 1. Client Requirements Formalized and Approved

The client conversation was converted into a reviewed design specification. The following decisions are final:

- The supplied pricing list is the ultimate source of truth, overriding screenshots and existing mock data.
- The storefront has 23 top-level game/category pages and 34 purchasable variants.
- Variants remain inside their parent page like a normal ecommerce product; they do not receive separate routes.
- Valorant has exactly Avlon, Unlocker, and Spoofer.
- The second Fortnite variant remains named exactly `Fortnite`.
- All offer labels remain exact, including hour ranges, `One-Time Use`, and `Unlimited Use`.
- Checkout belongs to the CRM application.
- The storefront passes only product, variant, and offer IDs.
- The CRM resolves the price from the canonical catalog and ignores browser-submitted prices.
- Crypto methods are BTC, LTC, and USDT TRC20.
- Crypto proof requires at least one of transaction hash or screenshot; either or both are accepted.
- Gift-card checkout sends the customer to a configured Rewarble/G2A URL and requires a returned card code.
- Payment verification is manual.
- Public wallet addresses, QR images, and the gift-card URL are managed by authorized CRM staff.
- Payment and fulfillment states are separate.
- Unverified orders cannot be claimed, dispatched, or completed.
- Each of the 34 variants needs unique artwork with the green ArrowX logo in the corners.

The exhaustive product/price matrix and acceptance criteria are in the approved design specification rather than duplicated here.

## 2. Repository and Isolation Setup Completed

The original directory was not a Git repository. With explicit user approval:

1. A root `.gitignore` was created.
2. Dependency folders, Next.js output, distribution output, environment files, worktrees, and runtime payment uploads were excluded.
3. A local Git repository was initialized at `C:\Design\arrow-x`.
4. The existing project was committed as baseline:

```text
212657e chore: establish ArrowX baseline
```

5. The isolated feature worktree and branch were created:

```text
C:\Design\arrow-x\.worktrees\arrowx-catalog-checkout
feature/arrowx-catalog-checkout
```

No remote was added and nothing was pushed or published.

## 3. Baseline Verification Completed

Fresh dependency installation repeatedly timed out on Windows. The worktree therefore uses directory junctions to the already-installed dependency trees in the baseline workspace.

Turbopack rejects dependency junctions outside its filesystem root, so development and build verification use Webpack mode:

```powershell
npx next build --webpack
npx next dev --webpack -p 3000
npx next dev --webpack -p 3001
```

Before feature implementation, both unchanged applications passed production builds:

- Storefront: compiled, TypeScript passed, 32 static pages generated.
- CRM: compiled, TypeScript passed, 18 routes generated.

This established a clean baseline independent of later changes.

## 4. Task 1 Completed: Canonical Shared Catalog

Task 1 is implemented and committed through three focused commits:

```text
a4c7de9 feat: add canonical ArrowX catalog
2249e4f fix: preserve readonly catalog and focused lockfiles
45957b4 fix: make canonical catalog deeply immutable
```

### Shared package

Created:

- `shared/package.json`
- `shared/src/catalog.ts`
- `shared/src/catalog.test.ts`

Both applications consume the local zero-dependency package as:

```json
"@arrowx/shared": "file:../shared"
```

Both Next.js configurations transpile `@arrowx/shared`.

### Canonical data model

The shared package exports:

- `CatalogCategory`
- `PriceOffer`
- `ProductVariant`
- `CatalogProduct`
- `catalog`
- `findProduct()`
- `findVariant()`
- `findOffer()`
- `getStartingPrice()`

The catalog contains exactly:

- 23 parent products.
- 34 variants.
- Every approved offer label and price.
- No unapproved product or offer.

Artwork paths already follow the intended convention:

```text
/products/variants/<product-id>--<variant-id>.webp
```

### Pricing integrity and immutability

The tests deep-compare the whole catalog against an independent expected matrix. They also check irregular labels and prices, starting prices, lookup behavior, and exact variant names.

The catalog is deeply immutable:

- Public contract properties are readonly.
- Products, variants, offers, and nested arrays are recursively frozen at runtime.
- A regression test attempts a forged price mutation and confirms the canonical price is unchanged.

### Review corrections completed

The original subagent-driven workflow caught and corrected:

- A TypeScript inference issue where the catalog array was not genuinely readonly.
- Unrelated Tailwind WASM records introduced by lockfile-only installation.
- Runtime mutability of direct catalog references.

Task 1 received specification approval after these corrections. Shared tests and both Webpack production builds passed at the committed Task 1 checkpoint.

## 5. Inline Workflow and Live Preview Setup

At the user's request, the slower three-agent-per-task workflow was stopped. Work continued inline in the same feature worktree.

Two hidden development processes were started:

- Storefront: `http://localhost:3000`
- CRM: `http://localhost:3001`

They use Webpack mode because of the dependency junction limitation.

The development processes were alive when the storefront migration began. At this checkpoint, the storefront `/products` request returns HTTP 500 because Task 2 is paused mid-migration; this is documented below. The CRM source has not yet been changed by the feature implementation.

## 6. Task 2 In Progress: Storefront Parent Catalog Migration

The following work exists as an uncommitted diff on top of `45957b4`.

### Shared search helper

Added `searchCatalog(query)` to search:

- Parent product name.
- Parent description.
- Variant names.

It returns parent products so searches for Avlon, Keyser, and Arcane Web lead to Valorant, FiveM, and ARC Raiders respectively.

A test was added. Current shared test result:

```text
5 tests passed
0 failed
```

### Storefront type and data migration

Changed `app/src/types.ts` to re-export the shared catalog types rather than retain the obsolete fixed pricing model.

Changed `app/src/data/mockData.ts` so `productsData` comes from the canonical shared catalog.

Deleted the obsolete `app/src/data/allZadeyoProducts.json`, which contained unrelated products and fabricated fixed prices.

### Catalog component migration

`ProductsCatalog.tsx` is partially migrated to:

- Use variant-aware search.
- Show all approved categories.
- Render `heroImage`.
- Show variant counts instead of fabricated rating/sales values.
- List variant names instead of fabricated feature claims.
- Calculate `Starts from` across all child offers.
- Remove the misleading `/day` suffix.

### Products page migration

`app/src/app/products/page.tsx` is partially migrated to:

- Use canonical search.
- Use name or starting-price sorting.
- Remove fake popularity/rating sorting.
- Add the full approved category set.
- Use `heroImage`.
- Remove the obsolete instant-key modal.

### Other storefront consumers

`TopPicksSection.tsx` and `GameArtworkTicker.tsx` now read `heroImage` and use canonical starting prices/counts.

The obsolete `ProductDetailModal.tsx` was deleted because it fabricated fixed tiers, generated fake instant keys, and contradicted the approved manual verification workflow.

## 7. Current Uncommitted Files

Feature work currently modifies or deletes:

```text
M app/src/app/products/page.tsx
M app/src/components/GameArtworkTicker.tsx
D app/src/components/ProductDetailModal.tsx
M app/src/components/ProductsCatalog.tsx
M app/src/components/TopPicksSection.tsx
D app/src/data/allZadeyoProducts.json
M app/src/data/mockData.ts
M app/src/types.ts
M shared/src/catalog.test.ts
M shared/src/catalog.ts
```

Next.js also rewrote `app/next-env.d.ts` and `crm/next-env.d.ts` during builds/dev startup. These generated changes are unrelated and should be reverted before the next feature commit unless Next.js requires their new contents.

## 8. Exact Verification State at Pause

Confirmed:

- Committed Task 1 shared tests passed.
- Committed Task 1 storefront Webpack build passed.
- Committed Task 1 CRM Webpack build passed.
- Current uncommitted shared tests pass: 5/5.

Not yet confirmed:

- The current uncommitted storefront migration has not passed a production build.
- A combined test/build command failed to spawn the parallel Windows process before the build ran.
- A subsequent request to `http://localhost:3000/products` returned HTTP 500.

Likely reason for the HTTP 500:

- The canonical `Product` type replaced the legacy fields globally while `app/src/app/products/[id]/page.tsx` and possibly other consumers still reference `image`, `tagline`, `rating`, `salesCount`, and fixed `pricing.day/week/month/lifetime` fields.
- The remaining consumer migration is explicitly part of Tasks 2 and 3.

Do not treat the current uncommitted Task 2 work as complete or commit it before resolving all remaining legacy consumers and passing the storefront build.

## 9. Important Operational Notes

- All work must continue in `C:\Design\arrow-x\.worktrees\arrowx-catalog-checkout`.
- Do not edit `C:\Design\arrow-x` main workspace directly.
- Use `npx next ... --webpack` because Turbopack rejects the dependency junctions.
- Do not delete worktree `node_modules`; they are junctions used to avoid repeated failed installs.
- Keep localhost ports 3000 and 3001 for the storefront and CRM.
- Do not push, publish, or open a PR without explicit user approval and full diff review.
- The client pricing list remains authoritative even if existing UI copy or screenshots disagree.

