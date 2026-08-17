import { catalog } from '@arrowx/shared/catalog';
import type { Product, Review, Announcement } from '../types';

// Official game catalogue products
export const productsData: readonly Product[] = catalog;

export const reviewsData: Review[] = [
  {
    id: 'rev-1',
    author: 'k4i_v2',
    avatarLetter: 'K',
    rating: 5,
    timeAgo: '14m ago',
    content: 'hit radiant last night no cap. rage edition is butter smooth on 240hz, zero frame drops or weird lag',
    productName: 'Valorant',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'z1p.exe',
    avatarLetter: 'Z',
    rating: 5,
    timeAgo: '1h ago',
    content: 'bro the setup took like 45 seconds max. arcane on apex is so clean, streamproof works 100% on discord screenshare',
    productName: 'Apex Legends',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'lucas_eft',
    avatarLetter: 'L',
    rating: 5,
    timeAgo: '3h ago',
    content: 'extracted 14 raids in a row on streets rn. full pack makes solo runs actually chill instead of stressful',
    productName: 'Escape from Tarkov',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'frosty_fps',
    avatarLetter: 'F',
    rating: 5,
    timeAgo: '5h ago',
    content: 'predator on cs2 is goated. visual clarity is crazy and it injects with zero issues every time',
    productName: 'Counter-Strike 2',
    verified: true
  },
  {
    id: 'rev-5',
    author: 'kyle_wz',
    avatarLetter: 'K',
    rating: 5,
    timeAgo: '8h ago',
    content: 'bo7 warzone lifetime was lowkey the best purchase this year. instant key in dashboard right after payment',
    productName: 'Call of Duty: Black Ops 7 / Warzone',
    verified: true
  },
  {
    id: 'rev-6',
    author: 'blitz.fn',
    avatarLetter: 'B',
    rating: 5,
    timeAgo: '12h ago',
    content: 'wackey on fn is crazy good. my duo literally had no idea and we dropped 6 crowns in a row',
    productName: 'Fortnite',
    verified: true
  },
  {
    id: 'rev-7',
    author: 'dexter.cc',
    avatarLetter: 'D',
    rating: 5,
    timeAgo: '1d ago',
    content: 'delta force full edition goes crazy. loot esp and player tracking are pixel perfect',
    productName: 'Delta Force',
    verified: true
  },
  {
    id: 'rev-8',
    author: 'zeno_r6',
    avatarLetter: 'Z',
    rating: 5,
    timeAgo: '1d ago',
    content: 'hit champ on siege in 3 days with ivy. undetected status has been rock solid forever',
    productName: 'Rainbow Six Siege',
    verified: true
  },
  {
    id: 'rev-9',
    author: 'ryzo_',
    avatarLetter: 'R',
    rating: 5,
    timeAgo: '1d ago',
    content: 'perm spoofer saved my whole setup after getting hwid flagged. 1 click and im back in games fr',
    productName: 'Spoofers',
    verified: true
  },
  {
    id: 'rev-10',
    author: 'h4wk.gg',
    avatarLetter: 'H',
    rating: 5,
    timeAgo: '2d ago',
    content: 'marvel rivals predator is actually nutty. playing dive characters with full awareness is too fun',
    productName: 'Marvel Rivals',
    verified: true
  },
  {
    id: 'rev-11',
    author: 't0xic_',
    avatarLetter: 'T',
    rating: 5,
    timeAgo: '2d ago',
    content: 'ancient on rust is undefeated for roam pvp. saved our 6-man compound like 4 times this wipe',
    productName: 'Rust',
    verified: true
  },
  {
    id: 'rev-12',
    author: 'mikey.vlt',
    avatarLetter: 'M',
    rating: 5,
    timeAgo: '2d ago',
    content: 'keyser fivem is clean af. super easy to load and zero menu crashes on heavy custom servers',
    productName: 'FiveM',
    verified: true
  },
  {
    id: 'rev-13',
    author: 'sammyd_fr',
    avatarLetter: 'S',
    rating: 5,
    timeAgo: '3d ago',
    content: 'support answered my ticket in discord at 3am in like 3 mins flat. goat tier customer service',
    productName: 'Valorant',
    verified: true
  },
  {
    id: 'rev-14',
    author: 'v1ral.exe',
    avatarLetter: 'V',
    rating: 5,
    timeAgo: '3d ago',
    content: 'arcane on arc raiders made the whole playtest a breeze. smooth esp and 0 stutter',
    productName: 'ARC Raiders',
    verified: true
  },
  {
    id: 'rev-15',
    author: 'noahfr',
    avatarLetter: 'N',
    rating: 5,
    timeAgo: '4d ago',
    content: 'arena breakout full build is insane for military armory runs. extracted with 2m+ loot every raid',
    productName: 'Arena Breakout',
    verified: true
  },
  {
    id: 'rev-16',
    author: 'drewski_',
    avatarLetter: 'D',
    rating: 5,
    timeAgo: '4d ago',
    content: 'dbd arcane makes survivor & killer matches way too easy lol. skill check auto hit is flawless',
    productName: 'Dead by Daylight',
    verified: true
  },
  {
    id: 'rev-17',
    author: 'solofps_',
    avatarLetter: 'S',
    rating: 5,
    timeAgo: '5d ago',
    content: 'paid with solana and got verified in like 2 mins. the otp login dashboard makes managing keys so easy',
    productName: 'Call of Duty: Black Ops 7 / Warzone',
    verified: true
  },
  {
    id: 'rev-18',
    author: 'kxng_dayz',
    avatarLetter: 'K',
    rating: 5,
    timeAgo: '5d ago',
    content: 'dayz arcane is a lifesaver on high pop servers. avoiding geared sniper squads with ease',
    productName: 'DayZ',
    verified: true
  },
  {
    id: 'rev-19',
    author: 'xeno_w',
    avatarLetter: 'X',
    rating: 5,
    timeAgo: '6d ago',
    content: 'the finals arcane is so responsive. tracking light dashers in chaotic cashouts is effortless',
    productName: 'The Finals',
    verified: true
  },
  {
    id: 'rev-20',
    author: 'n3xus.v',
    avatarLetter: 'N',
    rating: 5,
    timeAgo: '1w ago',
    content: 'mw19 byte lifetime still working flawlessly years later. developers actually care about updates here',
    productName: 'COD MW19',
    verified: true
  }
];

export const announcementsData: Announcement[] = [];
