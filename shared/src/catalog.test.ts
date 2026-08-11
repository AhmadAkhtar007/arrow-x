import assert from 'node:assert/strict';
import test from 'node:test';

import {
  catalog,
  findOffer,
  findProduct,
  findVariant,
  getStartingPrice,
} from './catalog.ts';

const expectedCatalog = [
  ['Valorant', [['Avlon', [['1 Day', 9.99], ['1 Week', 29.99], ['1 Month', 59.99], ['1 Year', 249.99]]], ['Unlocker', [['1 Day', 4.99], ['1 Week', 14.99], ['1 Month', 29.99]]], ['Spoofer', [['1 Month', 49.99], ['Lifetime', 199.99]]]]],
  ['Apex Legends', [['Arcane', [['1 Day', 4.99], ['1 Week', 22.99], ['1 Month', 39.99]]]]],
  ['ARC Raiders', [['Ancient', [['1 Day', 4.99], ['1 Week', 19.99], ['1 Month', 39.99]]], ['Arcane', [['1 Day', 4.99], ['1 Week', 24.99], ['1 Month', 39.99]]], ['Arcane Web', [['1 Day', 4.99], ['1 Week', 19.99], ['1 Month', 34.99]]], ['Temporary Account', [['0–99 Hours', 3.99], ['100–200 Hours', 4.99], ['200–300 Hours', 6.49], ['300+ Hours', 5.99]]], ['15-Day Inactive', [['0–99 Hours', 4.99], ['100–200 Hours', 5.99], ['200+ Hours', 7.99]]]]],
  ['Arena Breakout', [['Full', [['1 Day', 9.99], ['1 Week', 29.99], ['1 Month', 49.99]]]]],
  ['Battlefield 6', [['Ancient', [['1 Day', 4.99], ['1 Week', 19.99], ['1 Month', 39.99]]]]],
  ['Call of Duty: Black Ops 7 / Warzone', [['Byte', [['1 Week', 7.99], ['1 Month', 15.99], ['Lifetime', 39.99]]]]],
  ['Counter-Strike 2', [['Predator', [['1 Week', 3.99], ['1 Month', 6.49], ['3 Months', 14.99]]]]],
  ['DayZ', [['Arcane', [['1 Day', 2.99], ['1 Week', 12.99], ['1 Month', 25.99]]]]],
  ['Dead by Daylight', [['Arcane', [['1 Day', 3.99], ['1 Week', 14.99], ['1 Month', 29.99]]]]],
  ['Delta Force', [['Full', [['1 Day', 9.99], ['1 Week', 29.99], ['1 Month', 59.99], ['Lifetime', 399.99]]]]],
  ['Escape from Tarkov', [['Full', [['1 Day', 6.99], ['1 Week', 26.99], ['1 Month', 69.99], ['3 Months', 159.99]]], ['Lite', [['1 Day', 3.99], ['1 Week', 14.99], ['1 Month', 39.99], ['3 Months', 99.99]]]]],
  ['FiveM', [['Keyser', [['1 Day', 4.99], ['1 Week', 9.99], ['1 Month', 13.99], ['Lifetime', 34.99]]]]],
  ['Fortnite', [['Exodus', [['1 Day', 3.99], ['3 Days', 7.99], ['1 Week', 19.99], ['1 Month', 39.99]]], ['Fortnite', [['3 Days', 7.99], ['1 Week', 14.99], ['1 Month', 29.99]]]]],
  ['Marvel Rivals', [['Predator', [['1 Day', 3.49], ['1 Week', 8.99], ['1 Month', 19.99], ['3 Months', 34.99]]]]],
  ['Mecha Chamelion', [['Hidden', [['1 Month', 12.99], ['Lifetime', 24.99]]]]],
  ['Mistfall Hunter', [['Arcane', [['1 Day', 4.99], ['1 Week', 19.99], ['1 Month', 39.99]]]]],
  ['NBA 2K26', [['Internal', [['1 Week', 29.99], ['1 Month', 79.99], ['Lifetime', 499.99]]]]],
  ['Palworld', [['Palcore Internal', [['1 Day', 4.99], ['1 Week', 9.99], ['1 Month', 14.99], ['Lifetime', 39.99]]]]],
  ['Rainbow Six Siege', [['Ivy', [['1 Day', 4.99], ['1 Week', 24.99], ['1 Month', 49.99]]], ['Exodus', [['1 Day', 3.99], ['3 Days', 7.99], ['1 Week', 19.99], ['1 Month', 39.99]]], ['Crusader', [['1 Day', 4.99], ['1 Week', 22.99], ['1 Month', 44.99]]]]],
  ['Rust', [['Ancient', [['1 Day', 5.99], ['1 Week', 27.99], ['1 Month', 54.99]]]]],
  ['Spoofers', [['Temporary', [['3 Days', 5.99], ['1 Week', 13.99], ['1 Month', 21.99]]], ['Permanent', [['One-Time Use', 29.99], ['Unlimited Use', 69.99]]]]],
  ['Squad', [['Arcane', [['1 Day', 2.99], ['1 Week', 11.99], ['1 Month', 21.99]]]]],
  ['The Finals', [['Arcane', [['1 Day', 4.99], ['1 Week', 22.99], ['1 Month', 41.99]]]]],
] as const;

test('contains exactly the canonical product and variant rows', () => {
  assert.equal(catalog.length, 23);
  assert.equal(catalog.flatMap((product) => product.variants).length, 34);
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
  assert.deepEqual(valorant?.variants.map((variant) => variant.name), ['Avlon', 'Unlocker', 'Spoofer']);
  assert.equal(findOffer('valorant', 'avlon', '1-year')?.priceUsd, 249.99);
  assert.equal(findOffer('valorant', 'spoofer', 'lifetime')?.priceUsd, 199.99);
  assert.equal(findOffer('arc-raiders', 'temporary-account', '200-300-hours')?.label, '200–300 Hours');
  assert.equal(findOffer('arc-raiders', 'temporary-account', '200-300-hours')?.priceUsd, 6.49);
  assert.equal(findOffer('arc-raiders', 'temporary-account', '300-plus-hours')?.priceUsd, 5.99);
  assert.equal(findOffer('spoofers', 'permanent', 'one-time-use')?.label, 'One-Time Use');
  assert.equal(findOffer('spoofers', 'permanent', 'unlimited-use')?.priceUsd, 69.99);
  assert.deepEqual(findProduct('fortnite')?.variants.map((variant) => variant.name), ['Exodus', 'Fortnite']);
});

test('finds catalog entries and their starting prices by stable ids', () => {
  assert.equal(findProduct('missing-product'), undefined);
  assert.equal(findVariant('valorant', 'missing-variant'), undefined);
  assert.equal(findOffer('valorant', 'avlon', 'missing-offer'), undefined);
  assert.equal(getStartingPrice('arc-raiders'), 3.99);
  assert.equal(getStartingPrice('valorant'), 4.99);
  assert.equal(getStartingPrice('the-finals'), 4.99);
});
