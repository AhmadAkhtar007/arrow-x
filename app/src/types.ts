export interface Product {
  id: string;
  name: string;
  category: 'Shooter' | 'Survival' | 'Battle Royale' | 'Spoofer' | 'Tools';
  tagline: string;
  image: string;
  heroImage?: string;
  status: 'Undetected' | 'Updating' | 'Testing';
  pricing: {
    day?: number;
    week?: number;
    month?: number;
    lifetime?: number;
  };
  rating: number;
  salesCount: number;
  isTopPick?: boolean;
  features: string[];
  compatibility: string[];
  lastUpdated: string;
}

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
