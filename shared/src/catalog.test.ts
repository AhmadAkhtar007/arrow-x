import assert from 'node:assert/strict';
import test from 'node:test';

import {
  catalog,
  findOffer,
  findProduct,
  findVariant,
  getOfferSummary,
  getStartingPrice,
  searchCatalog,
} from './catalog.ts';

const expectedCatalog = [
  ['Valorant', [['RAGE', [['1 Day', 12], ['1 Week', 40], ['1 Month', 70], ['1 Year', 300]]], ['Pandora', [['1 Day', 12], ['1 Week', 45], ['1 Month', 70]]], ['Unlocker', [['1 Day', 8], ['1 Week', 25], ['1 Month', 50]]], ['Spoofer', [['1 Month', 70], ['Lifetime', 350]]]]],
  ['Apex Legends', [['Arcane', [['1 Day', 10], ['1 Week', 30], ['1 Month', 70]]]]],
  ['ARC Raiders', [['Ancient', [['1 Day', 10], ['1 Week', 35], ['1 Month', 70]]], ['Arcane', [['1 Day', 10], ['1 Week', 45], ['1 Month', 80]]], ['Arcane Web', [['1 Day', 5], ['1 Week', 25], ['1 Month', 40]]], ['Temporary Account', [['0–99 Hours', 3.99], ['100–200 Hours', 4.99], ['200–300 Hours', 6.49], ['300+ Hours', 5.99]]], ['15-Day Inactive', [['0–99 Hours', 4.99], ['100–200 Hours', 5.99], ['200+ Hours', 7.99]]]]],
  ['Arena Breakout', [['Full', [['1 Day', 12], ['1 Week', 40], ['1 Month', 70]]]]],
  ['Battlefield 6', [['Ancient', [['1 Day', 10], ['1 Week', 40], ['1 Month', 70]]]]],
  ['Call of Duty: Black Ops 7 / Warzone', [['BO7 / Warzone', [['1 Day', 10], ['1 Week', 25], ['1 Month', 70], ['Lifetime', 250]]]]],
  ['COD MW19', [['Byte', [['1 Week', 12], ['1 Month', 40], ['Lifetime', 150]]]]],
  ['Counter-Strike 2', [['Predator', [['1 Week', 10], ['1 Month', 25], ['3 Months', 65]]]]],
  ['DayZ', [['Arcane', [['1 Day', 10], ['1 Week', 25], ['1 Month', 50]]]]],
  ['Dead by Daylight', [['Arcane', [['1 Day', 3.99], ['1 Week', 14.99], ['1 Month', 29.99]]]]],
  ['Delta Force', [['Full', [['1 Day', 12], ['1 Week', 35], ['1 Month', 90], ['Lifetime', 450]]]]],
  ['Escape from Tarkov', [['Full', [['1 Day', 10], ['1 Week', 30], ['1 Month', 80], ['3 Months', 200]]], ['Lite', [['1 Day', 7], ['1 Week', 20], ['1 Month', 60], ['3 Months', 150]]]]],
  ['FiveM', [['Keyser', [['1 Day', 10], ['1 Week', 30], ['1 Month', 50], ['Lifetime', 150]]]]],
  ['Fortnite', [['Exodus', [['1 Day', 10], ['3 Days', 25], ['1 Week', 40], ['1 Month', 80]]], ['Wackey', [['3 Days', 12], ['1 Week', 35], ['1 Month', 65]]]]],
  ['Marvel Rivals', [['Predator', [['1 Day', 10], ['1 Week', 25], ['1 Month', 50], ['3 Months', 125]]]]],
  ['Mecha Chamelion', [['Hidden', [['1 Month', 25], ['Lifetime', 150]]]]],
  ['Mistfall Hunter', [['Arcane', [['1 Day', 10], ['1 Week', 25], ['1 Month', 70]]]]],
  ['NBA 2K26', [['Internal', [['1 Week', 50], ['1 Month', 100], ['Lifetime', 500]]]]],
  ['Palworld', [['Palcore Internal', [['1 Day', 10], ['1 Week', 25], ['1 Month', 50], ['Lifetime', 150]]]]],
  ['Rainbow Six Siege', [['Ivy', [['1 Day', 10], ['1 Week', 30], ['1 Month', 70]]], ['Exodus', [['1 Day', 10], ['3 Days', 20], ['1 Week', 35], ['1 Month', 60]]], ['Crusader', [['1 Day', 4.99], ['1 Week', 22.99], ['1 Month', 44.99]]]]],
  ['Rust', [['Ancient', [['1 Day', 5.99], ['1 Week', 27.99], ['1 Month', 54.99]]]]],
  ['Spoofers', [['Temporary', [['3 Days', 15], ['1 Week', 30], ['1 Month', 50]]], ['Permanent', [['One-Time Use', 50], ['Unlimited Use', 150]]]]],
  ['Squad', [['Arcane', [['1 Day', 10], ['1 Week', 25], ['1 Month', 50]]]]],
  ['The Finals', [['Arcane', [['1 Day', 10], ['1 Week', 40], ['1 Month', 70]]]]],
] as const;

test('contains exactly the canonical product and variant rows', () => {
  assert.equal(catalog.length, 24);
  assert.equal(catalog.flatMap((product) => product.variants).length, 36);
  assert.deepEqual(
    catalog.map((product) => [
      product.name,
      product.variants.map((variant) => [
        variant.name,
        variant.offers.map((offer) => [offer.label, offer.priceUsd]),
      ]),
    ]),
    expectedCatalog,
  );
});

test('preserves the required exact catalog labels and prices', () => {
  const valorant = findProduct('valorant');
  assert.deepEqual(valorant?.variants.map((variant) => variant.name), ['RAGE', 'Pandora', 'Unlocker', 'Spoofer']);
  assert.equal(findOffer('valorant', 'rage', '1-year')?.priceUsd, 300);
  assert.equal(findOffer('valorant', 'spoofer', 'lifetime')?.priceUsd, 350);
  assert.equal(findOffer('arc-raiders', 'temporary-account', '200-300-hours')?.label, '200–300 Hours');
  assert.equal(findOffer('arc-raiders', 'temporary-account', '200-300-hours')?.priceUsd, 6.49);
  assert.equal(findOffer('arc-raiders', 'temporary-account', '300-plus-hours')?.priceUsd, 5.99);
  assert.equal(findOffer('spoofers', 'permanent', 'one-time-use')?.label, 'One-Time Use');
  assert.equal(findOffer('spoofers', 'permanent', 'unlimited-use')?.priceUsd, 150);
  assert.deepEqual(findProduct('fortnite')?.variants.map((variant) => variant.name), ['Exodus', 'Wackey']);
});

test('finds catalog entries and their starting prices by stable ids', () => {
  assert.equal(findProduct('missing-product'), undefined);
  assert.equal(findVariant('valorant', 'missing-variant'), undefined);
  assert.equal(findOffer('valorant', 'rage', 'missing-offer'), undefined);
  assert.equal(getStartingPrice('arc-raiders'), 3.99);
  assert.equal(getStartingPrice('valorant'), 8);
  assert.equal(getStartingPrice('the-finals'), 10);
});

test('keeps canonical catalog data deeply immutable at runtime', () => {
  const product = findProduct('valorant');
  const variant = findVariant('valorant', 'rage');
  const offer = findOffer('valorant', 'rage', '1-day');
  assert.ok(product);
  assert.ok(variant);
  assert.ok(offer);

  const originalPrice = offer.priceUsd;
  const mutableOffer = offer as { priceUsd: number };
  let mutationError: unknown;

  try {
    mutableOffer.priceUsd = 0;
  } catch (error) {
    mutationError = error;
  }

  const priceAfterMutation = mutableOffer.priceUsd;
  if (!mutationError) mutableOffer.priceUsd = originalPrice;

  assert.ok(mutationError instanceof TypeError);
  assert.equal(priceAfterMutation, originalPrice);
  assert.equal(findOffer('valorant', 'rage', '1-day')?.priceUsd, originalPrice);
  assert.ok(Object.isFrozen(catalog));
  assert.ok(Object.isFrozen(product));
  assert.ok(Object.isFrozen(product.features));
  assert.ok(Object.isFrozen(product.compatibility));
  assert.ok(Object.isFrozen(product.variants));
  assert.ok(Object.isFrozen(variant));
  assert.ok(Object.isFrozen(variant.offers));
  assert.ok(Object.isFrozen(offer));
});

test('searches parent and variant names while returning parent products', () => {
  assert.deepEqual(searchCatalog('RAGE').map((product) => product.id), ['valorant']);
  assert.deepEqual(searchCatalog('Keyser').map((product) => product.id), ['fivem']);
  assert.deepEqual(searchCatalog('Arcane Web').map((product) => product.id), ['arc-raiders']);
  assert.deepEqual(searchCatalog('  ').map((product) => product.id), catalog.map((product) => product.id));
});

test('builds structured offer summaries without fallback tiers', () => {
  assert.deepEqual(getOfferSummary('valorant'), {
    lowPrice: 8,
    highPrice: 350,
    offerCount: 12,
  });
  assert.deepEqual(getOfferSummary('mecha-chamelion'), {
    lowPrice: 25,
    highPrice: 150,
    offerCount: 2,
  });
  assert.equal(getOfferSummary('non-existent'), undefined);
});

test('ensures all 24 products have valid heroImage paths', () => {
  for (const p of catalog) {
    assert.ok(p.heroImage, `Product ${p.id} missing heroImage`);
    assert.equal(p.heroImage, `/products/${p.id}.webp`);
  }
});


