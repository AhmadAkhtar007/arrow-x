'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { VisitorHero } from '../components/VisitorHero';
import { GameArtworkTicker } from '../components/GameArtworkTicker';
import { TopPicksSection } from '../components/TopPicksSection';
import { AboutSection } from '../components/AboutSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { FAQSection } from '../components/FAQSection';
import { productsData } from '../data/mockData';

export default function HomePage() {
  const router = useRouter();

  const scrollToReviews = () => {
    const el = document.getElementById('customer-feedback');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Main Hero Stage */}
      <VisitorHero
        onShopClick={() => router.push('/products')}
        onReviewsClick={scrollToReviews}
        onStatusClick={() => router.push('/status')}
      />

      {/* 2. Zadeyo-Style Portrait Game Poster Artwork Ticker */}
      <GameArtworkTicker />

      {/* 3. Top Picks Spotlight */}
      <TopPicksSection
        products={productsData}
        onSelectProduct={(p) => router.push(`/products/${p.id}`)}
        onSeeAll={() => router.push('/products')}
      />

      {/* 4. About & Longevity Section */}
      <AboutSection />

      {/* 5. Live Customer Reviews Showcase */}
      <ReviewsSection />

      {/* 6. Frequently Asked Questions */}
      <FAQSection />
    </>
  );
}
