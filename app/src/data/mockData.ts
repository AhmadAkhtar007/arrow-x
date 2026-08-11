import type { Product, Review, Announcement } from '../types';
import allZadeyoProductsRaw from './allZadeyoProducts.json';

// Official game catalogue products
export const productsData: Product[] = allZadeyoProductsRaw as Product[];

export const reviewsData: Review[] = [
  {
    id: 'rev-1',
    author: 'Flux',
    avatarLetter: 'F',
    rating: 5,
    timeAgo: '2 days ago',
    content: 'Arham and Wolfy spent over an hour on my ticket with near instant replies until everything worked. Smooth setup and 0 fps drop.',
    productName: 'Valorant',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'JDWest',
    avatarLetter: 'J',
    rating: 5,
    timeAgo: '7 days ago',
    content: 'Aris is the goat best help I have had installing anything saved me hours. Instant key delivery in dashboard.',
    productName: 'CS2',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Zach L.',
    avatarLetter: 'Z',
    rating: 4,
    timeAgo: 'Apr 25, 2026',
    content: 'Legit and does what it promises. Support tickets answered in under 3 minutes even late at night.',
    productName: 'Fortnite',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Torsten J.',
    avatarLetter: 'T',
    rating: 5,
    timeAgo: 'May 12, 2026',
    content: 'Opened a ticket when Windows Defender flagged the loader, staff explained the memory hook process clearly. 10/10 service.',
    productName: 'Escape from Tarkov (EFT)',
    verified: true
  },
  {
    id: 'rev-5',
    author: 'Nathan S.',
    avatarLetter: 'N',
    rating: 5,
    timeAgo: 'Jun 02, 2026',
    content: 'Had service within five minutes. Arham walked me through something I never would have figured out alone.',
    productName: 'ARC Raiders',
    verified: true
  }
];

export const announcementsData: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Vanguard 14.12 Compatibility Update Deployed',
    date: 'August 9, 2026',
    category: 'System Update',
    readTime: '2 min read',
    summary: 'Our kernel driver has been quietly updated for the latest client patch. All users may resume play without reinstalling.'
  },
  {
    id: 'ann-2',
    title: 'ArrowX Ring-0 Hypervisor v4.2 Released',
    date: 'August 5, 2026',
    category: 'New Feature',
    readTime: '3 min read',
    summary: 'Enhanced TPM 2.0 virtualization and automatic clean-up routines for Asus and Gigabyte motherboards.'
  }
];
