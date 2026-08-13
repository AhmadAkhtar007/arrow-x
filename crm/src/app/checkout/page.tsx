import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import { resolveOrderSelection } from '@arrowx/shared/orders';
import { getCurrentSession } from '../../lib/auth';
import { CrmNavbar } from '../../components/CrmNavbar';
import { CheckoutForm } from '../../components/CheckoutForm';

interface CheckoutPageProps {
  searchParams: Promise<{
    product?: string;
    variant?: string;
    offer?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Secure Checkout | Manual Payment Verification | ArrowX',
  description: 'Complete your ArrowX software purchase securely with Bitcoin, Solana, USDT TRC-20, or Gift Card manual verification.',
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { product, variant, offer } = await searchParams;
  const session = await getCurrentSession();

  const productId = product || '';
  const variantId = variant || '';
  const offerId = offer || '';

  const selection = productId && variantId && offerId 
    ? resolveOrderSelection(productId, variantId, offerId)
    : null;

  return (
    <div className="min-h-screen bg-[#040705] text-zinc-100 flex flex-col font-sans">
      <CrmNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* Navigation Breadcrumb / Back Button */}
        <div className="flex items-center justify-between">
          <a
            href="http://localhost:3000/products"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Store Catalog</span>
          </a>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SSL 256-BIT ENCRYPTED</span>
          </div>
        </div>

        {selection ? (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
                Complete Your Order
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans">
                Review your selected package and provide payment verification proof below
              </p>
            </div>

            <CheckoutForm 
              selection={selection} 
              currentUser={session?.email ? { 
                id: session.id, 
                email: session.email, 
                name: session.name, 
                username: session.username 
              } : null} 
            />
          </div>
        ) : (
          <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-[#090e0b]/90 border border-white/10 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
              <AlertCircle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black font-display text-white">
                No Product Selected
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Please select a product and duration from our store catalog to start checkout.
              </p>
            </div>

            <a
              href="http://localhost:3000/products"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-display text-xs uppercase tracking-wider transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Browse Catalog</span>
            </a>
          </div>
        )}

      </main>
    </div>
  );
}
