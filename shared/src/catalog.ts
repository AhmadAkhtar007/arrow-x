export type CatalogCategory =
  | 'Shooter'
  | 'Survival'
  | 'Battle Royale'
  | 'Sports'
  | 'Tools'
  | 'Accounts';

export type PriceOffer = {
  readonly id: string;
  readonly label: string;
  readonly priceUsd: number;
};

export type ProductVariant = {
  readonly id: string;
  readonly name: string;
  readonly artwork: string;
  readonly offers: readonly PriceOffer[];
};

export type CatalogProduct = {
  readonly id: string;
  readonly name: string;
  readonly category: CatalogCategory;
  readonly description: string;
  readonly heroImage: string;
  readonly status: 'Undetected' | 'Updating' | 'Testing' | 'Available';
  readonly features: readonly string[];
  readonly compatibility: readonly string[];
  readonly variants: readonly ProductVariant[];
};

type OfferInput = readonly [id: string, label: string, priceUsd: number];
type VariantInput = readonly [id: string, name: string, offers: readonly OfferInput[]];

const offers = (items: readonly OfferInput[]): readonly PriceOffer[] =>
  items.map(([id, label, priceUsd]) => ({ id, label, priceUsd }));

const product = (
  id: string,
  name: string,
  category: CatalogCategory,
  variants: readonly VariantInput[],
): CatalogProduct => ({
  id,
  name,
  category,
  description: `Catalog purchase options for ${name}.`,
  heroImage: `/products/${id}.webp`,
  status: 'Available',
  features: [],
  compatibility: [],
  variants: variants.map(([variantId, variantName, variantOffers]) => ({
    id: variantId,
    name: variantName,
    artwork: `/products/variants/${id}--${variantId}.webp`,
    offers: offers(variantOffers),
  })),
});

const deepFreeze = <T>(value: T, seen = new WeakSet<object>()): T => {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return value;

  seen.add(value);
  for (const key of Reflect.ownKeys(value)) {
    deepFreeze(Reflect.get(value, key), seen);
  }

  Object.freeze(value);
  return value;
};

export const catalog = deepFreeze([
  product('valorant', 'Valorant', 'Shooter', [
    ['avlon', 'Avlon', [['1-day', '1 Day', 9.99], ['1-week', '1 Week', 29.99], ['1-month', '1 Month', 59.99], ['1-year', '1 Year', 249.99]]],
    ['unlocker', 'Unlocker', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 14.99], ['1-month', '1 Month', 29.99]]],
    ['spoofer', 'Spoofer', [['1-month', '1 Month', 49.99], ['lifetime', 'Lifetime', 199.99]]],
  ]),
  product('apex-legends', 'Apex Legends', 'Battle Royale', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 22.99], ['1-month', '1 Month', 39.99]]],
  ]),
  product('arc-raiders', 'ARC Raiders', 'Shooter', [
    ['ancient', 'Ancient', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 19.99], ['1-month', '1 Month', 39.99]]],
    ['arcane', 'Arcane', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 24.99], ['1-month', '1 Month', 39.99]]],
    ['arcane-web', 'Arcane Web', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 19.99], ['1-month', '1 Month', 34.99]]],
    ['temporary-account', 'Temporary Account', [['0-99-hours', '0–99 Hours', 3.99], ['100-200-hours', '100–200 Hours', 4.99], ['200-300-hours', '200–300 Hours', 6.49], ['300-plus-hours', '300+ Hours', 5.99]]],
    ['15-day-inactive', '15-Day Inactive', [['0-99-hours', '0–99 Hours', 4.99], ['100-200-hours', '100–200 Hours', 5.99], ['200-plus-hours', '200+ Hours', 7.99]]],
  ]),
  product('arena-breakout', 'Arena Breakout', 'Shooter', [
    ['full', 'Full', [['1-day', '1 Day', 9.99], ['1-week', '1 Week', 29.99], ['1-month', '1 Month', 49.99]]],
  ]),
  product('battlefield-6', 'Battlefield 6', 'Shooter', [
    ['ancient', 'Ancient', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 19.99], ['1-month', '1 Month', 39.99]]],
  ]),
  product('call-of-duty-black-ops-7-warzone', 'Call of Duty: Black Ops 7 / Warzone', 'Shooter', [
    ['byte', 'Byte', [['1-week', '1 Week', 7.99], ['1-month', '1 Month', 15.99], ['lifetime', 'Lifetime', 39.99]]],
  ]),
  product('counter-strike-2', 'Counter-Strike 2', 'Shooter', [
    ['predator', 'Predator', [['1-week', '1 Week', 3.99], ['1-month', '1 Month', 6.49], ['3-months', '3 Months', 14.99]]],
  ]),
  product('dayz', 'DayZ', 'Survival', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 2.99], ['1-week', '1 Week', 12.99], ['1-month', '1 Month', 25.99]]],
  ]),
  product('dead-by-daylight', 'Dead by Daylight', 'Survival', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 3.99], ['1-week', '1 Week', 14.99], ['1-month', '1 Month', 29.99]]],
  ]),
  product('delta-force', 'Delta Force', 'Shooter', [
    ['full', 'Full', [['1-day', '1 Day', 9.99], ['1-week', '1 Week', 29.99], ['1-month', '1 Month', 59.99], ['lifetime', 'Lifetime', 399.99]]],
  ]),
  product('escape-from-tarkov', 'Escape from Tarkov', 'Survival', [
    ['full', 'Full', [['1-day', '1 Day', 6.99], ['1-week', '1 Week', 26.99], ['1-month', '1 Month', 69.99], ['3-months', '3 Months', 159.99]]],
    ['lite', 'Lite', [['1-day', '1 Day', 3.99], ['1-week', '1 Week', 14.99], ['1-month', '1 Month', 39.99], ['3-months', '3 Months', 99.99]]],
  ]),
  product('fivem', 'FiveM', 'Tools', [
    ['keyser', 'Keyser', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 9.99], ['1-month', '1 Month', 13.99], ['lifetime', 'Lifetime', 34.99]]],
  ]),
  product('fortnite', 'Fortnite', 'Battle Royale', [
    ['exodus', 'Exodus', [['1-day', '1 Day', 3.99], ['3-days', '3 Days', 7.99], ['1-week', '1 Week', 19.99], ['1-month', '1 Month', 39.99]]],
    ['fortnite', 'Fortnite', [['3-days', '3 Days', 7.99], ['1-week', '1 Week', 14.99], ['1-month', '1 Month', 29.99]]],
  ]),
  product('marvel-rivals', 'Marvel Rivals', 'Shooter', [
    ['predator', 'Predator', [['1-day', '1 Day', 3.49], ['1-week', '1 Week', 8.99], ['1-month', '1 Month', 19.99], ['3-months', '3 Months', 34.99]]],
  ]),
  product('mecha-chamelion', 'Mecha Chamelion', 'Shooter', [
    ['hidden', 'Hidden', [['1-month', '1 Month', 12.99], ['lifetime', 'Lifetime', 24.99]]],
  ]),
  product('mistfall-hunter', 'Mistfall Hunter', 'Survival', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 19.99], ['1-month', '1 Month', 39.99]]],
  ]),
  product('nba-2k26', 'NBA 2K26', 'Sports', [
    ['internal', 'Internal', [['1-week', '1 Week', 29.99], ['1-month', '1 Month', 79.99], ['lifetime', 'Lifetime', 499.99]]],
  ]),
  product('palworld', 'Palworld', 'Survival', [
    ['palcore-internal', 'Palcore Internal', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 9.99], ['1-month', '1 Month', 14.99], ['lifetime', 'Lifetime', 39.99]]],
  ]),
  product('rainbow-six-siege', 'Rainbow Six Siege', 'Shooter', [
    ['ivy', 'Ivy', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 24.99], ['1-month', '1 Month', 49.99]]],
    ['exodus', 'Exodus', [['1-day', '1 Day', 3.99], ['3-days', '3 Days', 7.99], ['1-week', '1 Week', 19.99], ['1-month', '1 Month', 39.99]]],
    ['crusader', 'Crusader', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 22.99], ['1-month', '1 Month', 44.99]]],
  ]),
  product('rust', 'Rust', 'Survival', [
    ['ancient', 'Ancient', [['1-day', '1 Day', 5.99], ['1-week', '1 Week', 27.99], ['1-month', '1 Month', 54.99]]],
  ]),
  product('spoofers', 'Spoofers', 'Tools', [
    ['temporary', 'Temporary', [['3-days', '3 Days', 5.99], ['1-week', '1 Week', 13.99], ['1-month', '1 Month', 21.99]]],
    ['permanent', 'Permanent', [['one-time-use', 'One-Time Use', 29.99], ['unlimited-use', 'Unlimited Use', 69.99]]],
  ]),
  product('squad', 'Squad', 'Shooter', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 2.99], ['1-week', '1 Week', 11.99], ['1-month', '1 Month', 21.99]]],
  ]),
  product('the-finals', 'The Finals', 'Shooter', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 22.99], ['1-month', '1 Month', 41.99]]],
  ]),
] as const satisfies readonly CatalogProduct[]);

export const findProduct = (productId: string) =>
  catalog.find((item) => item.id === productId);

export const findVariant = (productId: string, variantId: string) =>
  findProduct(productId)?.variants.find((item) => item.id === variantId);

export const findOffer = (productId: string, variantId: string, offerId: string) =>
  findVariant(productId, variantId)?.offers.find((item) => item.id === offerId);

export const getStartingPrice = (productId: string) => {
  const product = findProduct(productId);
  if (!product) return undefined;

  return Math.min(...product.variants.flatMap((variant) => variant.offers.map((offer) => offer.priceUsd)));
};

export const searchCatalog = (query: string): readonly CatalogProduct[] => {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return catalog;

  return catalog.filter((item) =>
    item.name.toLocaleLowerCase().includes(normalized) ||
    item.description.toLocaleLowerCase().includes(normalized) ||
    item.variants.some((variant) => variant.name.toLocaleLowerCase().includes(normalized)),
  );
};

export const getOfferSummary = (productId: string) => {
  const prices = findProduct(productId)?.variants.flatMap((variant) =>
    variant.offers.map((offer) => offer.priceUsd),
  ) ?? [];
  if (!prices.length) return undefined;
  return {
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: prices.length,
  };
};

