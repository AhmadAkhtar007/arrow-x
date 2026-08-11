import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Zap, 
  Check, 
  ArrowLeft, 
  Star, 
  Lock, 
  Activity, 
  ChevronRight, 
  Cpu, 
  Eye, 
  Crosshair, 
  Terminal, 
  Layers, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { productsData } from '../../../data/mockData';
import type { Product } from '../../../types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = productsData.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = `Undetected ${product.name} Cheats & ESP Aimbot | Ring-0 Kernel | ArrowX`;
  const description = `Buy undetected ${product.name} cheats with Ring-0 kernel injection, 3D ESP, Vector Aimbot, HWID Spoofer, and 24/7 Discord support. 100% Streamproof for Windows 10/11.`;

  return {
    title,
    description,
    keywords: [
      `${product.name.toLowerCase()} cheats`,
      `undetected ${product.name.toLowerCase()} hacks`,
      `${product.name.toLowerCase()} esp aimbot`,
      `${product.name.toLowerCase()} kernel driver`,
      `${product.name.toLowerCase()} hwid spoofer`,
      `${product.name.toLowerCase()} wallhack`,
      'arrowx undetected cheats',
      'ring-0 software'
    ],
    openGraph: {
      title,
      description,
      url: `https://arrowx.shop/products/${product.id}`,
      images: [
        {
          url: product.image,
          width: 600,
          height: 900,
          alt: `${product.name} Cheats Showcase`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = productsData.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Rich Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `ArrowX ${product.name} Pro Enhancement`,
    image: product.image,
    description: `Undetected Ring-0 kernel software for ${product.name} featuring bone ESP, smooth vector aimbot, stream-proof overlay, and built-in HWID protection.`,
    brand: {
      '@type': 'Brand',
      name: 'ArrowX',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: (product.salesCount || 240).toString(),
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: (product.pricing.day || 4.99).toString(),
      highPrice: (product.pricing.lifetime || 99.99).toString(),
      offerCount: '4',
      availability: 'https://schema.org/InStock',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://arrowx.shop',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://arrowx.shop/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://arrowx.shop/products/${product.id}`,
      },
    ],
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 bg-cyber-grid">
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-white transition-colors">Arsenal</Link>
        <span>/</span>
        <span className="text-emerald-400 font-semibold">{product.name}</span>
      </div>

      {/* SECTION 1: HERO SHOWCASE (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: High-Impact Game Poster Card */}
        <div className="lg:col-span-5 relative aspect-[2/3] max-w-md mx-auto lg:max-w-none w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-black group">
          <img
            src={product.image}
            alt={`Undetected ${product.name} Cheats & Aimbot Box Art`}
            className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-transparent to-black/30" />

          {/* Top Status Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{product.status} (Ring-0 Active)</span>
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-white/10">
            <Star className="h-3.5 w-3.5 fill-amber-300" />
            <span>{product.rating}</span>
            <span className="text-[10px] text-zinc-400 font-normal">({product.salesCount}+ sold)</span>
          </div>

          {/* Bottom Card Overlay Strip */}
          <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Anti-Cheat Target:</span>
            <span className="text-emerald-400 font-bold">Vanguard / EAC / BattlEye</span>
          </div>
        </div>

        {/* Right: Product Value Stack & Plan Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <Shield className="h-3.5 w-3.5" />
              <span>{product.category} Edition</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Undetected {product.name} Cheats & Aimbot
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              {product.tagline} Engineered with hypervisor-level Ring-0 memory virtualization, dynamic polymorphic mutated drivers per key, and 100% streamproof DirectX overlay.
            </p>
          </div>

          {/* Plan Tier Breakdown Cards Grid */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Available Access Tiers</div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* 1 Day */}
              <div className="p-4 rounded-2xl bg-[#090e0b] border border-white/10 hover:border-emerald-500/40 transition-all space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-400">1-Day Pass</div>
                <div className="text-2xl font-black font-display text-white">${product.pricing.day || 4.99}</div>
                <div className="text-[10px] text-emerald-400 font-mono">24h Testing</div>
              </div>

              {/* 7 Days */}
              <div className="p-4 rounded-2xl bg-[#090e0b] border border-white/10 hover:border-emerald-500/40 transition-all space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-400">7-Day Pass</div>
                <div className="text-2xl font-black font-display text-white">${product.pricing.week || 14.99}</div>
                <div className="text-[10px] text-emerald-400 font-mono">Ranked Grind</div>
              </div>

              {/* 30 Days (Popular) */}
              <div className="p-4 rounded-2xl bg-[#0d1612] border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-black font-mono text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                  POPULAR
                </div>
                <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">30-Day VIP</div>
                <div className="text-2xl font-black font-display text-white">${product.pricing.month || 39.99}</div>
                <div className="text-[10px] text-zinc-400 font-mono">Full Season</div>
              </div>

              {/* Lifetime */}
              <div className="p-4 rounded-2xl bg-[#090e0b] border border-white/10 hover:border-emerald-500/40 transition-all space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-400">Lifetime Pass</div>
                <div className="text-2xl font-black font-display text-white">${product.pricing.lifetime || 99.99}</div>
                <div className="text-[10px] text-emerald-400 font-mono">Permanent</div>
              </div>

            </div>
          </div>

          {/* Quick Hardware Specs Summary */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Intel & AMD Supported</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Windows 10 / 11 Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>0.0s Key Dispatch</span>
            </div>
          </div>

          {/* Action CTA Button Strip */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="http://localhost:3001/login"
              className="flex-1 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-display text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Get {product.name} Access</span>
            </a>

            <a
              href="http://localhost:3001/"
              className="py-4 px-5 rounded-2xl bg-[#090e0b] hover:bg-[#121a15] text-white border border-white/10 hover:border-emerald-500/40 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Track Order / Support</span>
            </a>
          </div>

        </div>

      </div>

      {/* SECTION 2: DEEP TECHNICAL CAPABILITY MATRIX (3 Pillars: Visuals, Aimbot, Security) */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Complete {product.name} Enhancement Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Visuals / ESP */}
          <div className="p-6 rounded-3xl bg-[#090e0b] border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Visuals & 3D Bone ESP
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-sans">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Real-time 3D Skeleton & Joint Bone ESP</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>2D/3D Corner & Dynamic Bounding Boxes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Player Health Bar, Armor & Shield Telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Directional Snaplines & Distance Readouts (Meters)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Loot, Weapon Tier & Explosive Warning Indicators</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Precision Aimbot */}
          <div className="p-6 rounded-3xl bg-[#090e0b] border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Crosshair className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Vector Aimbot Engine
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-sans">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Humanized Curve Smoothing & Variable FOV</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Bone Target Selector (Head, Neck, Chest, Nearest)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Recoil Control System (RCS) Pitch & Yaw Compensation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Ballistic Bullet Drop & Velocity Prediction Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Visibility Check (Only locks when target is visible)</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Kernel Stealth & HWID */}
          <div className="p-6 rounded-3xl bg-[#090e0b] border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Ring-0 Stealth & Spoofer
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-sans">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>UEFI Hypervisor Boot-Level Injection</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>100% Streamproof Overlay (Invisible on OBS/Discord)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Integrated Dynamic HWID Spoofer (Disk, MAC, SMBIOS)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Polymorphic Binary Mutator on every launch</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>Automatic Anti-Cheat Client Update Detection</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 3: SYSTEM COMPATIBILITY & REQUIREMENTS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#080d0a] border border-white/10 space-y-6">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-xl font-bold font-display text-white">
            System & Hardware Compatibility Matrix
          </h2>
          <p className="text-xs text-zinc-400">
            Verified across all standard gaming hardware and operating systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-zinc-500 uppercase">Operating System</div>
            <div className="text-white font-bold">Windows 10 / 11</div>
            <div className="text-[10px] text-emerald-400">Builds 20H2 to 24H2</div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-zinc-500 uppercase">Processor (CPU)</div>
            <div className="text-white font-bold">Intel & AMD</div>
            <div className="text-[10px] text-emerald-400">All generations supported</div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-zinc-500 uppercase">BIOS Mode</div>
            <div className="text-white font-bold">UEFI Enabled</div>
            <div className="text-[10px] text-emerald-400">Secure Boot Supported</div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-zinc-500 uppercase">Anti-Cheat Status</div>
            <div className="text-emerald-400 font-bold">Undetected</div>
            <div className="text-[10px] text-zinc-400">Zero Flags Reported</div>
          </div>
        </div>
      </div>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (SEO Rich Snippets) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090e0b] border border-white/10 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold font-display text-white">
            Frequently Asked Questions for {product.name}
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="font-bold text-white">How does ArrowX prevent bans in {product.name}?</div>
            <p className="text-zinc-400 leading-relaxed">
              Our software operates inside the Ring-0 kernel space before game anti-cheats initialize. By using mutated syscalls and hypervisor virtualization, memory hooks remain invisible to heuristic scanners.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="font-bold text-white">Is a Hardware ID (HWID) Spoofer included?</div>
            <p className="text-zinc-400 leading-relaxed">
              Yes, all {product.name} subscriptions include dynamic hardware serialization spoofing for Motherboard SMBIOS, Disk Serial UUID, Network Adapter MAC, and GPU identifiers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="font-bold text-white">Can I stream on Twitch or Discord with {product.name} ESP active?</div>
            <p className="text-zinc-400 leading-relaxed">
              Yes, our DirectX overlay is 100% streamproof. ESP visual overlays are rendered directly to your monitor while remaining completely invisible on OBS, Streamlabs, Discord Screen Share, and shadowplay recordings.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
