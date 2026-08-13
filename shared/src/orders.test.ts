import assert from 'node:assert/strict';
import test from 'node:test';
import { catalog } from './catalog.ts';

import {
  canFulfillOrder,
  createCatalogGiftCardLinks,
  findGiftCardPurchaseLink,
  getRequiredGiftCardDenomination,
  isPaymentMethod,
  resolveOrderSelection,
  validateGiftCardLinks,
  validatePaymentProof,
} from './orders.ts';

test('resolves valid product, variant, and offer from catalog with server authority', () => {
  const selection = resolveOrderSelection('valorant', 'avlon', '1-day');
  assert.ok(selection);
  assert.equal(selection.productId, 'valorant');
  assert.equal(selection.productName, 'Valorant');
  assert.equal(selection.variantId, 'avlon');
  assert.equal(selection.variantName, 'Avlon');
  assert.equal(selection.offerId, '1-day');
  assert.equal(selection.offerLabel, '1 Day');
  assert.equal(selection.amountUsd, 9.99);

  // Special offer labels and prices
  const arcSelection = resolveOrderSelection('arc-raiders', 'temporary-account', '300-plus-hours');
  assert.ok(arcSelection);
  assert.equal(arcSelection.offerLabel, '300+ Hours');
  assert.equal(arcSelection.amountUsd, 5.99);

  const spooferSelection = resolveOrderSelection('spoofers', 'permanent', 'unlimited-use');
  assert.ok(spooferSelection);
  assert.equal(spooferSelection.offerLabel, 'Unlimited Use');
  assert.equal(spooferSelection.amountUsd, 69.99);
});

test('rejects invalid product, variant, or offer selections', () => {
  assert.equal(resolveOrderSelection('invalid', 'avlon', '1-day'), null);
  assert.equal(resolveOrderSelection('valorant', 'invalid', '1-day'), null);
  assert.equal(resolveOrderSelection('valorant', 'avlon', 'invalid'), null);
});

test('validates crypto payment proof (requires hash, screenshot, or both)', () => {
  // Hash only
  const btcHashOnly = validatePaymentProof('BTC', { txHash: 'abc123hash' });
  assert.equal(btcHashOnly.valid, true);

  // Screenshot only
  const solScreenOnly = validatePaymentProof('SOL', { screenshotUrl: '/uploads/proofs/screenshot1.png' });
  assert.equal(solScreenOnly.valid, true);

  // Both hash and screenshot
  const usdtBoth = validatePaymentProof('USDT_TRC20', {
    txHash: 'trc20txhash789',
    screenshotUrl: '/uploads/proofs/screen2.jpg',
  });
  assert.equal(usdtBoth.valid, true);

  // Neither provided -> invalid
  const emptyCrypto = validatePaymentProof('BTC', {});
  assert.equal(emptyCrypto.valid, false);

  const blankCrypto = validatePaymentProof('BTC', { txHash: '   ', screenshotUrl: '' });
  assert.equal(blankCrypto.valid, false);
});

test('supports the configured BTC, SOL, and USDT TRC20 crypto networks', () => {
  assert.equal(isPaymentMethod('BTC'), true);
  assert.equal(isPaymentMethod('SOL'), true);
  assert.equal(isPaymentMethod('USDT_TRC20'), true);
  assert.equal(isPaymentMethod('LTC'), false);
  assert.equal(isPaymentMethod('GIFT_CARD'), true);
});

test('validates gift card payment proof (requires non-empty card code)', () => {
  const validGiftCard = validatePaymentProof('GIFT_CARD', { giftCardCode: 'REW-9948-2849' });
  assert.equal(validGiftCard.valid, true);

  const missingGiftCard = validatePaymentProof('GIFT_CARD', {});
  assert.equal(missingGiftCard.valid, false);

  const blankGiftCard = validatePaymentProof('GIFT_CARD', { giftCardCode: '   ' });
  assert.equal(blankGiftCard.valid, false);
});

test('rounds gift-card requirements up to a whole dollar without reducing exact totals', () => {
  assert.equal(getRequiredGiftCardDenomination(3.49), 4);
  assert.equal(getRequiredGiftCardDenomination(34.99), 35);
  assert.equal(getRequiredGiftCardDenomination(35), 35);
  assert.equal(getRequiredGiftCardDenomination(499.99), 500);
});

test('finds only an exact approved gift-card denomination', () => {
  const links = [
    { denominationUsd: 10, purchaseUrl: 'https://www.g2a.com/approved-10' },
    { denominationUsd: 35, purchaseUrl: 'https://www.g2a.com/approved-35' },
  ];

  assert.equal(findGiftCardPurchaseLink(34.99, links)?.purchaseUrl, 'https://www.g2a.com/approved-35');
  assert.equal(findGiftCardPurchaseLink(39.99, links), undefined);
});

test('rejects unsafe or ambiguous gift-card link mappings', () => {
  assert.equal(validateGiftCardLinks([]).valid, true);
  assert.equal(validateGiftCardLinks([
    { denominationUsd: 35, purchaseUrl: 'https://www.g2a.com/approved-35' },
  ]).valid, true);
  assert.equal(validateGiftCardLinks([
    { denominationUsd: 35, purchaseUrl: 'https://www.g2a.com/a' },
    { denominationUsd: 35, purchaseUrl: 'https://www.g2a.com/b' },
  ]).valid, false);
  assert.equal(validateGiftCardLinks([
    { denominationUsd: 34.99, purchaseUrl: 'https://www.g2a.com/a' },
  ]).valid, false);
  assert.equal(validateGiftCardLinks([
    { denominationUsd: 0, purchaseUrl: 'https://www.g2a.com/a' },
  ]).valid, false);
  assert.equal(validateGiftCardLinks([
    { denominationUsd: 35, purchaseUrl: 'http://www.g2a.com/a' },
  ]).valid, false);
  assert.equal(validateGiftCardLinks([null] as unknown as []).valid, false);
});

test('provides a denomination-specific G2A destination for every catalog offer', () => {
  const links = createCatalogGiftCardLinks();
  const expectedDenominations = [3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 20, 22, 23, 25, 26, 27, 28, 30, 35, 40, 42, 45, 50, 55, 60, 70, 80, 100, 160, 200, 250, 400, 500];

  assert.deepEqual(links.map((link) => link.denominationUsd), expectedDenominations);
  assert.equal(validateGiftCardLinks(links).valid, true);
  for (const product of catalog) {
    for (const variant of product.variants) {
      for (const offer of variant.offers) {
        const link = findGiftCardPurchaseLink(offer.priceUsd, links);
        assert.ok(link, `${product.name} / ${variant.name} / ${offer.label} lacks a gift-card destination`);
        assert.match(link.purchaseUrl, new RegExp(`REWARBLE%20VISA%20Gift%20Card%20${Math.ceil(offer.priceUsd)}%20USD$`));
      }
    }
  }
});

test('enforces that fulfillment cannot proceed unless payment is verified', () => {
  // Unverified / Pending payment
  assert.equal(canFulfillOrder('VERIFICATION_PENDING', 'PENDING', 'CLAIMED'), false);
  assert.equal(canFulfillOrder('VERIFICATION_PENDING', 'PENDING', 'DISPATCHED'), false);
  assert.equal(canFulfillOrder('REJECTED', 'PENDING', 'CLAIMED'), false);

  // Verified payment
  assert.equal(canFulfillOrder('VERIFIED', 'PENDING', 'CLAIMED'), true);
  assert.equal(canFulfillOrder('VERIFIED', 'CLAIMED', 'DISPATCHED'), true);

  // Invalid transition even if verified
  assert.equal(canFulfillOrder('VERIFIED', 'PENDING', 'DISPATCHED'), false);
  assert.equal(canFulfillOrder('VERIFIED', 'DISPATCHED', 'CLAIMED'), false);
});
