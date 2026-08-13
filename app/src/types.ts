export type {
  CatalogCategory,
  CatalogProduct as Product,
  PriceOffer,
  ProductVariant,
} from '@arrowx/shared/catalog';

export interface Review {
  id: string;
  author: string;
  avatarLetter: string;
  rating: number;
  timeAgo: string;
  content: string;
  productName: string;
  verified: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  summary: string;
}
