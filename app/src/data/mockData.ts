import { catalog } from '@arrowx/shared/catalog';
import type { Product, Review, Announcement } from '../types';

// Official game catalogue products
export const productsData: readonly Product[] = catalog;

export const reviewsData: Review[] = [
  {
    id: 'rev-1',
    author: 'Alex K.',
    avatarLetter: 'A',
    rating: 5,
    timeAgo: '1 day ago',
    content: 'Hit Immortal 3 this season with total peace of mind. Everything feels buttery smooth and completely natural in high-elo lobbies.',
    productName: 'Valorant',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Marcus T.',
    avatarLetter: 'M',
    rating: 5,
    timeAgo: '2 days ago',
    content: 'Setup took literally 90 seconds. Cleanest UI I have seen and zero FPS drop even during intense final rings.',
    productName: 'Apex Legends',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Liam V.',
    avatarLetter: 'L',
    rating: 5,
    timeAgo: '2 days ago',
    content: 'Extracted with every high-tier item I needed this wipe. Makes solo runs relaxing instead of stressful.',
    productName: 'Escape from Tarkov (EFT)',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Daniel R.',
    avatarLetter: 'D',
    rating: 5,
    timeAgo: '3 days ago',
    content: 'The consistency is unmatched. You just launch and play without fiddling with complex menus or configs.',
    productName: 'Counter-Strike 2',
    verified: true
  },
  {
    id: 'rev-5',
    author: 'Jordan P.',
    avatarLetter: 'J',
    rating: 5,
    timeAgo: '3 days ago',
    content: 'Finally a service that values user safety and instant delivery. Got my key in the dashboard seconds after payment.',
    productName: 'Call of Duty: Warzone & BO6',
    verified: true
  },
  {
    id: 'rev-6',
    author: 'Soren H.',
    avatarLetter: 'S',
    rating: 5,
    timeAgo: '4 days ago',
    content: 'Clean visuals that blend right into the game. My duo did not even realize I had an edge until we won 4 in a row.',
    productName: 'Fortnite',
    verified: true
  },
  {
    id: 'rev-7',
    author: 'Ethan B.',
    avatarLetter: 'E',
    rating: 5,
    timeAgo: '4 days ago',
    content: 'Smooth performance from day one. Support answered my question on ticket within 4 minutes. 10/10 experience.',
    productName: 'ARC Raiders',
    verified: true
  },
  {
    id: 'rev-8',
    author: 'Kai M.',
    avatarLetter: 'K',
    rating: 5,
    timeAgo: '5 days ago',
    content: 'Super responsive and easy to configure. Gives you the confidence you need to take every engagement.',
    productName: 'The Finals',
    verified: true
  },
  {
    id: 'rev-9',
    author: 'Tyler W.',
    avatarLetter: 'T',
    rating: 5,
    timeAgo: '5 days ago',
    content: 'Ranked up to Champion without breaking a sweat. It feels like unlocking an unfair amount of game sense.',
    productName: 'Rainbow Six Siege',
    verified: true
  },
  {
    id: 'rev-10',
    author: 'Felix G.',
    avatarLetter: 'F',
    rating: 5,
    timeAgo: '6 days ago',
    content: 'Saved our clan base multiple times. Knowing where key threats are before they flank changes everything.',
    productName: 'Rust',
    verified: true
  },
  {
    id: 'rev-11',
    author: 'Ryan S.',
    avatarLetter: 'R',
    rating: 5,
    timeAgo: '6 days ago',
    content: 'Flawless launch day support. Jumped straight into competitive matches with zero delays.',
    productName: 'Marvel Rivals',
    verified: true
  },
  {
    id: 'rev-12',
    author: 'Noah C.',
    avatarLetter: 'N',
    rating: 5,
    timeAgo: '1 week ago',
    content: 'Super crisp and reliable. The dashboard keeps all my keys organized and easy to access anytime.',
    productName: 'Overwatch 2',
    verified: true
  },
  {
    id: 'rev-13',
    author: 'Christian D.',
    avatarLetter: 'C',
    rating: 5,
    timeAgo: '1 week ago',
    content: 'Stalker runs feel completely different now. Surviving for weeks without losing high-end gear is a game changer.',
    productName: 'DayZ',
    verified: true
  },
  {
    id: 'rev-14',
    author: 'Viktor B.',
    avatarLetter: 'V',
    rating: 5,
    timeAgo: '1 week ago',
    content: 'Adds unbelievable awareness for tactical comms with the squad. Smooth overlays with zero frame drops.',
    productName: 'Squad',
    verified: true
  },
  {
    id: 'rev-15',
    author: 'Sean M.',
    avatarLetter: 'S',
    rating: 5,
    timeAgo: '1 week ago',
    content: 'Top-tier reliability. Whenever the game updates, ArrowX is already prepared. Truly professional service.',
    productName: 'Battlefield 2042',
    verified: true
  },
  {
    id: 'rev-16',
    author: 'Gabriel L.',
    avatarLetter: 'G',
    rating: 5,
    timeAgo: '2 weeks ago',
    content: 'Fastest checkout and activation I have had on any platform. No headaches, just straightforward results.',
    productName: 'Delta Force',
    verified: true
  },
  {
    id: 'rev-17',
    author: 'Anton K.',
    avatarLetter: 'A',
    rating: 5,
    timeAgo: '2 weeks ago',
    content: 'Secured back-to-back chicken dinners all weekend. The visual clarity and smooth tracking feel phenomenal.',
    productName: 'PUBG: Battlegrounds',
    verified: true
  },
  {
    id: 'rev-18',
    author: 'Lucas F.',
    avatarLetter: 'L',
    rating: 5,
    timeAgo: '2 weeks ago',
    content: 'Early access ran like a dream. Gives you full situational control during chaotic lane teamfights.',
    productName: 'Deadlock',
    verified: true
  },
  {
    id: 'rev-19',
    author: 'Oliver W.',
    avatarLetter: 'O',
    rating: 5,
    timeAgo: '2 weeks ago',
    content: 'Flawless performance on huge 100-player servers. Spotting distant tanks and infantry makes every match a win.',
    productName: 'Hell Let Loose',
    verified: true
  },
  {
    id: 'rev-20',
    author: 'Erik N.',
    avatarLetter: 'E',
    rating: 5,
    timeAgo: '3 weeks ago',
    content: 'Looted full military gear sets and extracted cleanly every single run. ArrowX makes the game truly enjoyable.',
    productName: 'Arena Breakout: Infinite',
    verified: true
  }
];

export const announcementsData: Announcement[] = [
  {
    id: 'ann-1',
    title: 'The Competitive Advantage: Why Top Players Value Peace of Mind Over Raw Speed',
    date: 'August 12, 2026',
    category: 'Competitive Edge',
    readTime: '3 min read',
    summary: 'Discover how smooth, natural gameplay overlays and reliable protection empower players to dominate high-elo lobbies with total confidence and zero FPS drops.'
  },
  {
    id: 'ann-2',
    title: 'Zero Downtime Philosophy: What Happens Behind the Scenes When Games Push Big Updates',
    date: 'August 8, 2026',
    category: 'Player Safety',
    readTime: '4 min read',
    summary: 'An inside look at our automated over-the-air update system that protects your active sessions and eliminates manual reinstall headaches.'
  }
];
