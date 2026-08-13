'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { VisitorHero } from '../components/VisitorHero';
import { AboutSection } from '../components/AboutSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { FAQSection } from '../components/FAQSection';

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* 1. Main Hero Stage */}
      <VisitorHero
        onShopClick={() => router.push('/products')}
      />

      {/* 2. About & Longevity Section */}
      <AboutSection />

      {/* 5. Live Customer Reviews Showcase */}
      <ReviewsSection />

      {/* 6. Frequently Asked Questions */}
      <FAQSection />
    </>
  );
}
