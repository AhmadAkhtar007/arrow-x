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
    ['rage', 'RAGE', [['1-day', '1 Day', 12], ['1-week', '1 Week', 40], ['1-month', '1 Month', 70], ['1-year', '1 Year', 300]]],
    ['pandora', 'Pandora', [['1-day', '1 Day', 12], ['1-week', '1 Week', 45], ['1-month', '1 Month', 70]]],
    ['unlocker', 'Unlocker', [['1-day', '1 Day', 8], ['1-week', '1 Week', 25], ['1-month', '1 Month', 50]]],
    ['spoofer', 'Spoofer', [['1-month', '1 Month', 70], ['lifetime', 'Lifetime', 350]]],
  ]),
  product('apex-legends', 'Apex Legends', 'Battle Royale', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 10], ['1-week', '1 Week', 30], ['1-month', '1 Month', 70]]],
  ]),
  product('arc-raiders', 'ARC Raiders', 'Shooter', [
    ['ancient', 'Ancient', [['1-day', '1 Day', 10], ['1-week', '1 Week', 35], ['1-month', '1 Month', 70]]],
    ['arcane', 'Arcane', [['1-day', '1 Day', 10], ['1-week', '1 Week', 45], ['1-month', '1 Month', 80]]],
    ['arcane-web', 'Arcane Web', [['1-day', '1 Day', 5], ['1-week', '1 Week', 25], ['1-month', '1 Month', 40]]],
    ['temporary-account', 'Temporary Account', [['0-99-hours', '0–99 Hours', 3.99], ['100-200-hours', '100–200 Hours', 4.99], ['200-300-hours', '200–300 Hours', 6.49], ['300-plus-hours', '300+ Hours', 5.99]]],
    ['15-day-inactive', '15-Day Inactive', [['0-99-hours', '0–99 Hours', 4.99], ['100-200-hours', '100–200 Hours', 5.99], ['200-plus-hours', '200+ Hours', 7.99]]],
  ]),
  product('arena-breakout', 'Arena Breakout', 'Shooter', [
    ['full', 'Full', [['1-day', '1 Day', 12], ['1-week', '1 Week', 40], ['1-month', '1 Month', 70]]],
  ]),
  product('battlefield-6', 'Battlefield 6', 'Shooter', [
    ['ancient', 'Ancient', [['1-day', '1 Day', 10], ['1-week', '1 Week', 40], ['1-month', '1 Month', 70]]],
  ]),
  product('call-of-duty-black-ops-7-warzone', 'Call of Duty: Black Ops 7 / Warzone', 'Shooter', [
    ['bo7-wz', 'BO7 / Warzone', [['1-day', '1 Day', 10], ['1-week', '1 Week', 25], ['1-month', '1 Month', 70], ['lifetime', 'Lifetime', 250]]],
  ]),
  product('cod-mw19', 'COD MW19', 'Shooter', [
    ['byte', 'Byte', [['1-week', '1 Week', 12], ['1-month', '1 Month', 40], ['lifetime', 'Lifetime', 150]]],
  ]),
  product('counter-strike-2', 'Counter-Strike 2', 'Shooter', [
    ['predator', 'Predator', [['1-week', '1 Week', 10], ['1-month', '1 Month', 25], ['3-months', '3 Months', 65]]],
  ]),
  product('dayz', 'DayZ', 'Survival', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 10], ['1-week', '1 Week', 25], ['1-month', '1 Month', 50]]],
  ]),
  product('dead-by-daylight', 'Dead by Daylight', 'Survival', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 3.99], ['1-week', '1 Week', 14.99], ['1-month', '1 Month', 29.99]]],
  ]),
  product('delta-force', 'Delta Force', 'Shooter', [
    ['full', 'Full', [['1-day', '1 Day', 12], ['1-week', '1 Week', 35], ['1-month', '1 Month', 90], ['lifetime', 'Lifetime', 450]]],
  ]),
  product('escape-from-tarkov', 'Escape from Tarkov', 'Survival', [
    ['full', 'Full', [['1-day', '1 Day', 10], ['1-week', '1 Week', 30], ['1-month', '1 Month', 80], ['3-months', '3 Months', 200]]],
    ['lite', 'Lite', [['1-day', '1 Day', 7], ['1-week', '1 Week', 20], ['1-month', '1 Month', 60], ['3-months', '3 Months', 150]]],
  ]),
  product('fivem', 'FiveM', 'Tools', [
    ['keyser', 'Keyser', [['1-day', '1 Day', 10], ['1-week', '1 Week', 30], ['1-month', '1 Month', 50], ['lifetime', 'Lifetime', 150]]],
  ]),
  product('fortnite', 'Fortnite', 'Battle Royale', [
    ['exodus', 'Exodus', [['1-day', '1 Day', 10], ['3-days', '3 Days', 25], ['1-week', '1 Week', 40], ['1-month', '1 Month', 80]]],
    ['wackey', 'Wackey', [['3-days', '3 Days', 12], ['1-week', '1 Week', 35], ['1-month', '1 Month', 65]]],
  ]),
  product('marvel-rivals', 'Marvel Rivals', 'Shooter', [
    ['predator', 'Predator', [['1-day', '1 Day', 10], ['1-week', '1 Week', 25], ['1-month', '1 Month', 50], ['3-months', '3 Months', 125]]],
  ]),
  product('mecha-chamelion', 'Mecha Chamelion', 'Shooter', [
    ['hidden', 'Hidden', [['1-month', '1 Month', 25], ['lifetime', 'Lifetime', 150]]],
  ]),
  product('mistfall-hunter', 'Mistfall Hunter', 'Survival', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 10], ['1-week', '1 Week', 25], ['1-month', '1 Month', 70]]],
  ]),
  product('nba-2k26', 'NBA 2K26', 'Sports', [
    ['internal', 'Internal', [['1-week', '1 Week', 50], ['1-month', '1 Month', 100], ['lifetime', 'Lifetime', 500]]],
  ]),
  product('palworld', 'Palworld', 'Survival', [
    ['palcore-internal', 'Palcore Internal', [['1-day', '1 Day', 10], ['1-week', '1 Week', 25], ['1-month', '1 Month', 50], ['lifetime', 'Lifetime', 150]]],
  ]),
  product('rainbow-six-siege', 'Rainbow Six Siege', 'Shooter', [
    ['ivy', 'Ivy', [['1-day', '1 Day', 10], ['1-week', '1 Week', 30], ['1-month', '1 Month', 70]]],
    ['exodus', 'Exodus', [['1-day', '1 Day', 10], ['3-days', '3 Days', 20], ['1-week', '1 Week', 35], ['1-month', '1 Month', 60]]],
    ['crusader', 'Crusader', [['1-day', '1 Day', 4.99], ['1-week', '1 Week', 22.99], ['1-month', '1 Month', 44.99]]],
  ]),
  product('rust', 'Rust', 'Survival', [
    ['ancient', 'Ancient', [['1-day', '1 Day', 5.99], ['1-week', '1 Week', 27.99], ['1-month', '1 Month', 54.99]]],
  ]),
  product('spoofers', 'Spoofers', 'Tools', [
    ['temporary', 'Temporary', [['3-days', '3 Days', 15], ['1-week', '1 Week', 30], ['1-month', '1 Month', 50]]],
    ['permanent', 'Permanent', [['one-time-use', 'One-Time Use', 50], ['unlimited-use', 'Unlimited Use', 150]]],
  ]),
  product('squad', 'Squad', 'Shooter', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 10], ['1-week', '1 Week', 25], ['1-month', '1 Month', 50]]],
  ]),
  product('the-finals', 'The Finals', 'Shooter', [
    ['arcane', 'Arcane', [['1-day', '1 Day', 10], ['1-week', '1 Week', 40], ['1-month', '1 Month', 70]]],
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

