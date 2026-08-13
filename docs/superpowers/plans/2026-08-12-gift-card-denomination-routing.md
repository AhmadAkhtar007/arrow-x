# Gift Card Denomination Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Safely route each gift-card order to a staff-approved whole-dollar G2A/Rewarble listing that covers the exact catalog price.

**Architecture:** Put denomination calculation, catalog-wide G2A search mapping, lookup, and settings validation in the shared payment module so checkout, APIs, and admin use one contract. Seed every catalog denomination, allow staff to replace search destinations with verified direct listings, expose mappings through the public settings endpoint, and fail closed only if a mapping is deliberately removed.

**Tech Stack:** TypeScript, Node test runner, React, Next.js App Router, JSON-backed CRM settings.

---

### Task 1: Shared gift-card routing contract

**Files:**
- Modify: `shared/src/orders.ts`
- Test: `shared/src/orders.test.ts`

- [ ] Add failing tests asserting `getRequiredGiftCardDenomination(34.99) === 35`, exact dollars remain unchanged, `findGiftCardPurchaseLink` requires an exact configured denomination, and `validateGiftCardLinks` rejects duplicates, fractional/non-positive values, and non-HTTPS URLs.
- [ ] Run `npm test` in `shared` and verify the new exports are missing.
- [ ] Add `GiftCardLink`, `giftCardLinks`, the rounding helper, exact lookup helper, and validator with no network dependency.
- [ ] Run `npm test` in `shared` and verify all tests pass.

### Task 2: Persist and expose approved mappings

**Files:**
- Modify: `crm/src/lib/db.ts`
- Modify: `crm/data/arrowx-db.json`
- Modify: `crm/src/app/api/admin/payment-settings/route.ts`
- Modify: `crm/src/app/api/payment-settings/route.ts`

- [ ] Seed `giftCardLinks: []` without inventing external URLs and normalize legacy settings to include the array.
- [ ] Validate the complete mapping in the authenticated admin PUT route before persistence; return HTTP 400 with the validation error on failure.
- [ ] Expose only the validated mapping through the public endpoint.
- [ ] Preserve wallet settings and unrelated database records byte-for-byte except for the payment-settings object.

### Task 3: Admin denomination editor

**Files:**
- Modify: `crm/src/app/admin/page.tsx`

- [ ] Replace the single vendor URL field with denomination/HTTPS URL rows.
- [ ] Add a blank row button and per-row removal button.
- [ ] Keep server validation authoritative and show its returned error in the existing settings error panel.
- [ ] Use specific labels explaining that only approved G2A/Rewarble listings belong here.

### Task 4: Fail-safe customer checkout

**Files:**
- Modify: `crm/src/components/CheckoutForm.tsx`

- [ ] Derive the rounded-up required denomination and exact mapping from shared helpers.
- [ ] For mapped orders, show exact total, required card value, overage, three-step G2A/Rewarble instructions, and `Buy $N Gift Card on G2A`.
- [ ] For unmapped orders, remove the outbound link, disable the code input and submission, and direct customers to crypto or support.
- [ ] Keep gift-card orders verification-pending after code submission; do not automate redemption.

### Task 5: Verification

**Files:**
- Verify only.

- [ ] Run `npm test` in `shared`; expect all tests to pass.
- [ ] Run `npx next build --webpack` in `crm`; expect TypeScript and all routes to compile.
- [ ] Inspect `/checkout` with a mapped test setting and verify the rounded denomination, correct link, code input, and overage disclosure.
- [ ] Remove the test mapping and verify the gift-card method fails closed while crypto methods remain usable.
- [ ] Run `git diff --check` and distinguish pre-existing whitespace findings from lines introduced by this feature.
