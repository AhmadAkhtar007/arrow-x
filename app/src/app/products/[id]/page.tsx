import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { catalog, findProduct, getOfferSummary } from '@arrowx/shared/catalog';
import { ProductPurchaseSelector } from '../../../components/ProductPurchaseSelector';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return catalog.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = findProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = `${product.name} Cheats & ESP Aimbot | Ring-0 Kernel | ArrowX`;
  const description = `Buy ${product.name} software with Ring-0 kernel injection, 3D ESP, Vector Aimbot, and manual payment verification. 100% Streamproof for Windows 10/11.`;

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
          url: product.heroImage,
          width: 600,
          height: 900,
          alt: `${product.name} Showcase`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.heroImage],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = findProduct(id);

  if (!product) {
    notFound();
  }

  const offerSummary = getOfferSummary(product.id);

  // Rich Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `ArrowX ${product.name}`,
    image: product.heroImage,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'ArrowX',
    },
    offers: offerSummary ? {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: offerSummary.lowPrice.toString(),
      highPrice: offerSummary.highPrice.toString(),
      offerCount: offerSummary.offerCount.toString(),
      availability: 'https://schema.org/InStock',
    } : undefined,
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
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-cyber-grid">
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* CORE PRODUCT PURCHASE STAGE (Focused Single Viewport Layout) */}
      <section className="lg:min-h-[calc(100dvh-7rem)] flex flex-col justify-center space-y-4 pt-2 pb-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Arsenal</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">{product.name}</span>
        </div>

        <ProductPurchaseSelector product={product} />
      </section>

    </div>
  );
}
