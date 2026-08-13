'use client';

import React, { useState } from 'react';
import { Shield, Zap, ShoppingCart } from 'lucide-react';
import type { CatalogProduct } from '@arrowx/shared/catalog';
import { useTheme } from '../context/ThemeContext';

interface ProductPurchaseSelectorProps {
  product: CatalogProduct;
}

export const ProductPurchaseSelector: React.FC<ProductPurchaseSelectorProps> = ({ product }) => {
  const { themeConfig } = useTheme();
  const [variantId, setVariantId] = useState<string>(product.variants[0]?.id ?? '');
  const [offerId, setOfferId] = useState<string>('');

  const currentVariant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const currentOffer = currentVariant?.offers.find((o) => o.id === offerId);

  const handleSelectVariant = (newVariantId: string) => {
    setVariantId(newVariantId);
    setOfferId('');
  };

  const checkoutUrl = currentOffer
    ? `http://localhost:3001/checkout?product=${encodeURIComponent(product.id)}&variant=${encodeURIComponent(currentVariant.id)}&offer=${encodeURIComponent(currentOffer.id)}`
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
      {/* Left: Interactive Variant Artwork Display */}
      <div className="lg:col-span-5 relative w-full h-[400px] sm:h-[480px] lg:h-[min(540px,calc(100dvh-12rem))] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-black group flex-shrink-0">
        <img
          key={currentVariant.id}
          src={currentVariant.artwork}
          alt={`${product.name} - ${currentVariant.name}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = product.heroImage || '/assets/logo-green.png';
          }}
          className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-transparent to-black/30 pointer-events-none" />

        {/* Top Status Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/80 backdrop-blur-md border border-white/10 text-emerald-400 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{product.status || 'Undetected'}</span>
        </div>

        {/* Variant Name Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-black/80 backdrop-blur-md text-zinc-200 border border-white/10 shadow-lg">
          {currentVariant.name}
        </div>

        {/* Bottom Card Info Strip */}
        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">Category:</span>
          <span className="text-emerald-400 font-bold">{product.category}</span>
        </div>
      </div>

      {/* Right: Variant Selector, Offer Matrix & Checkout */}
      <div className="lg:col-span-7 space-y-4 sm:space-y-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <Shield className="h-3 w-3" />
            <span>{product.category} Edition</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Variant Selection (if multiple variants exist) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
            <span>Select Edition</span>
            <span className="text-zinc-500 font-normal">{product.variants.length} available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {product.variants.map((v) => {
              const isSelected = v.id === currentVariant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectVariant(v.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                    isSelected
                      ? 'bg-[#0d1612] border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                      : 'bg-[#090e0b] border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-bold font-display ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {v.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {v.offers.length} {v.offers.length === 1 ? 'tier' : 'tiers'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Access Tier / Duration Offer Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
            <span>Select Access Duration</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {currentVariant.offers.map((offer) => {
              const isSelected = offer.id === offerId;
              return (
                <button
                  key={offer.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setOfferId(offer.id)}
                  className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-0.5 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0d1612] border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/60'
                      : 'bg-[#090e0b] border-white/10 hover:border-white/25 hover:bg-white/[0.02]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-black font-mono text-[8px] font-black px-1.5 py-0.5 rounded-bl-md">
                      SELECTED
                    </div>
                  )}
                  <div className="text-[10px] font-mono uppercase text-zinc-400 font-medium truncate">
                    {offer.label}
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-display text-white">
                    ${offer.priceUsd.toFixed(2)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Manual verification notice */}
          <p className="text-[11px] text-zinc-400 font-mono pt-0.5">
            All payments will be subject to manual verification
          </p>
        </div>

        {/* Selected Plan Summary Banner */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="space-y-0.5">
            <div className="text-zinc-400 text-[11px]">Selected Package:</div>
            <div className="text-white font-bold text-xs sm:text-sm">
              {currentVariant.name} — {currentOffer ? currentOffer.label : 'Choose duration above'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-zinc-400 text-[11px]">Total Price:</div>
            <div className="text-emerald-400 font-black text-base sm:text-lg font-display">
              {currentOffer ? `$${currentOffer.priceUsd.toFixed(2)}` : '—'}
            </div>
          </div>
        </div>

        {/* Action CTA Button Strip */}
        <div className="pt-1">
          {currentOffer && checkoutUrl ? (
            <a
              href={checkoutUrl}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-display text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Proceed to Checkout · ${currentOffer.priceUsd.toFixed(2)}</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3.5 px-6 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 font-bold font-display text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Select a duration to checkout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
