import { catalog, findOffer, findProduct, findVariant } from './catalog.ts';

export const PAYMENT_METHODS = ['BTC', 'SOL', 'USDT_TRC20', 'GIFT_CARD'] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === 'string' && PAYMENT_METHODS.includes(value as PaymentMethod);
}

export type PaymentStatus = 'VERIFICATION_PENDING' | 'VERIFIED' | 'REJECTED';

export type FulfillmentStatus = 'PENDING' | 'CLAIMED' | 'DISPATCHED';

export interface ResolvedSelection {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  offerId: string;
  offerLabel: string;
  amountUsd: number;
}

export interface PaymentProof {
  txHash?: string;
  screenshotUrl?: string;
  giftCardCode?: string;
}

export interface GiftCardLink {
  denominationUsd: number;
  purchaseUrl: string;
}

export interface PaymentSettings {
  btcAddress: string;
  btcQrUrl?: string;
  solAddress: string;
  solQrUrl?: string;
  usdtTrc20Address: string;
  usdtTrc20QrUrl?: string;
  giftCardLinks: GiftCardLink[];
}

export function getRequiredGiftCardDenomination(amountUsd: number): number {
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    throw new RangeError('Order amount must be a positive number.');
  }
  return Math.ceil(amountUsd);
}

export const G2A_REWARBLE_PURCHASE_URL =
  'https://www.g2a.com/rewarble-crypto-gift-card-5-aud-by-rewarble-key-global-i10000505309030';

export function createCatalogGiftCardLinks(): GiftCardLink[] {
  const denominations = new Set(
    catalog.flatMap((product) =>
      product.variants.flatMap((variant) =>
        variant.offers.map((offer) => getRequiredGiftCardDenomination(offer.priceUsd)),
      ),
    ),
  );

  return [...denominations]
    .sort((a, b) => a - b)
    .map((denominationUsd) => ({
      denominationUsd,
      purchaseUrl: G2A_REWARBLE_PURCHASE_URL,
    }));
}

export function findGiftCardPurchaseLink(
  amountUsd: number,
  links: readonly GiftCardLink[],
): GiftCardLink | undefined {
  const denomination = getRequiredGiftCardDenomination(amountUsd);
  return links.find((link) => link.denominationUsd === denomination);
}

export function validateGiftCardLinks(
  links: readonly GiftCardLink[],
): { valid: boolean; error?: string } {
  const seen = new Set<number>();

  for (const link of links) {
    if (!link || typeof link !== 'object' || typeof link.purchaseUrl !== 'string') {
      return { valid: false, error: 'Each gift-card mapping must include a denomination and HTTPS purchase URL.' };
    }
    if (!Number.isInteger(link.denominationUsd) || link.denominationUsd <= 0) {
      return { valid: false, error: 'Gift-card denominations must be positive whole-dollar values.' };
    }
    if (seen.has(link.denominationUsd)) {
      return { valid: false, error: `Duplicate $${link.denominationUsd} gift-card denomination.` };
    }
    seen.add(link.denominationUsd);

    try {
      const url = new URL(link.purchaseUrl);
      if (url.protocol !== 'https:') throw new Error('Unsafe protocol');
    } catch {
      return { valid: false, error: `The $${link.denominationUsd} gift-card link must be a valid HTTPS URL.` };
    }
  }

  return { valid: true };
}

export interface OrderSnapshot {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  offerId: string;
  offerLabel: string;
  amountUsd: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  customerName?: string;
  product: OrderSnapshot;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  proof: PaymentProof;
  licenseKey?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  claimedBy?: string;
  claimedAt?: string;
  dispatchedBy?: string;
  dispatchedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function resolveOrderSelection(
  productId: string,
  variantId: string,
  offerId: string,
): ResolvedSelection | null {
  const prod = findProduct(productId);
  if (!prod) return null;

  const variant = findVariant(productId, variantId);
  if (!variant) return null;

  const offer = findOffer(productId, variantId, offerId);
  if (!offer) return null;

  return {
    productId: prod.id,
    productName: prod.name,
    variantId: variant.id,
    variantName: variant.name,
    offerId: offer.id,
    offerLabel: offer.label,
    amountUsd: offer.priceUsd,
  };
}

export function validatePaymentProof(
  method: PaymentMethod,
  proof: PaymentProof,
): { valid: boolean; error?: string } {
  if (method === 'GIFT_CARD') {
    const code = proof.giftCardCode?.trim();
    if (!code) {
      return { valid: false, error: 'A valid gift card code is required.' };
    }
    return { valid: true };
  }

  // Crypto methods: BTC, SOL, USDT_TRC20
  const txHash = proof.txHash?.trim();
  const screenshotUrl = proof.screenshotUrl?.trim();

  if (!txHash && !screenshotUrl) {
    return {
      valid: false,
      error: 'Please provide either a transaction hash, payment screenshot, or both.',
    };
  }

  return { valid: true };
}

export function canFulfillOrder(
  paymentStatus: PaymentStatus,
  currentStatus: FulfillmentStatus,
  nextStatus: FulfillmentStatus,
): boolean {
  if (paymentStatus !== 'VERIFIED') {
    return false;
  }

  if (currentStatus === 'PENDING' && nextStatus === 'CLAIMED') {
    return true;
  }

  if (currentStatus === 'CLAIMED' && nextStatus === 'DISPATCHED') {
    return true;
  }

  return false;
}
