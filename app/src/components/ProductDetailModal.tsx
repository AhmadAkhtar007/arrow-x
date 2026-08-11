'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Zap, 
  Copy, 
  Lock,
  Sparkles
} from 'lucide-react';
import type { Product } from '../types';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderSuccess?: (product: Product, plan: string, key: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOrderSuccess,
}) => {
  if (!product) return null;

  const { themeConfig } = useTheme();
  type PlanKey = 'day' | 'week' | 'month' | 'lifetime';
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('month');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedKey, setPurchasedKey] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const plans: { key: PlanKey; label: string; period: string; price: number; badge?: string }[] = [
    { 
      key: 'day', 
      label: '1-Day Pass', 
      period: '24h Testing', 
      price: product.pricing?.day ?? 4.99,
    },
    { 
      key: 'week', 
      label: '7-Day Pass', 
      period: '7 Days Access', 
      price: product.pricing?.week ?? 14.99,
    },
    { 
      key: 'month', 
      label: '30-Day VIP', 
      period: '30 Days Access', 
      price: product.pricing?.month ?? 39.99, 
      badge: 'Popular' 
    },
    { 
      key: 'lifetime', 
      label: 'Lifetime Pass', 
      period: 'Permanent Access', 
      price: product.pricing?.lifetime ?? 99.99, 
      badge: 'Best Value' 
    },
  ];

  const currentPlan = plans.find((p) => p.key === selectedPlan) || plans[2] || plans[0];

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedKey = `AX-${product.id.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-LIV4`;
      setPurchasedKey(generatedKey);
      setIsProcessing(false);
      if (onOrderSuccess) {
        onOrderSuccess(product, currentPlan.label, generatedKey);
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: [themeConfig.accent, '#ffffff', '#a1a1aa']
        });
      } catch (e) {}
    }, 900);
  };

  const handleCopyKey = () => {
    if (!purchasedKey) return;
    navigator.clipboard.writeText(purchasedKey);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  // High-signal conversion features (1 line each)
  const coreFeatures = [
    'Ring-0 Kernel Hypervisor (Undetected)',
    '100% Streamproof for OBS & Discord',
    '3D Bone ESP & Smooth Vector Aimbot',
    'Windows 10 / 11 • Intel & AMD CPUs'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#080d0a] border rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-300 max-h-[90vh] flex flex-col md:flex-row my-auto"
        style={{ borderColor: themeConfig.surfaceBorder }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ========================================================
            LEFT: MINIMAL PORTRAIT ARTWORK (DOMINANT VISUAL)
        ======================================================== */}
        <div className="md:w-5/12 relative bg-[#060907] p-5 sm:p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
          
          {/* Ambient Glow */}
          <div 
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[90px] pointer-events-none opacity-20"
            style={{ backgroundColor: themeConfig.accent }}
          />

          {/* Portrait Cover Art */}
          <div className="relative w-full max-w-[200px] md:max-w-none aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <img
              src={product.image}
              alt={product.name}
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://cdn.cloudflare.steamstatic.com/steam/apps/1808500/library_600x900.jpg';
              }}
              className="w-full h-full object-cover object-center filter brightness-95"
            />
            
            {/* Live Status Badge */}
            <div className="absolute top-2.5 left-2.5">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md border border-white/10 text-white">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
                <span>{product.status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT: CONVERSION ENGINE (2 PLANS • 1-LINE SIGNAL ONLY)
        ======================================================== */}
        <div className="md:w-7/12 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto space-y-5">
          
          {purchasedKey ? (
            /* ==================== FULFILLED KEY STATE ==================== */
            <div className="py-4 text-center space-y-4 my-auto">
              <div 
                className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center border shadow-xl"
                style={{ 
                  backgroundColor: themeConfig.badgeBg, 
                  borderColor: themeConfig.badgeBorder,
                  color: themeConfig.accent 
                }}
              >
                <Check className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black font-headline text-white">
                  Access Key Generated
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 truncate">
                  {product.name} • {currentPlan.label}
                </p>
              </div>

              {/* License Key Card */}
              <div className="p-3 rounded-xl bg-black/60 border border-white/15 space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.04] border border-white/10">
                  <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider truncate">
                    {purchasedKey}
                  </span>
                  
                  <button
                    onClick={handleCopyKey}
                    className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{hasCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full max-w-sm mx-auto py-3 px-4 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-102"
                style={{
                  backgroundColor: themeConfig.buttonBg,
                  color: themeConfig.buttonText,
                }}
              >
                Done
              </button>
            </div>
          ) : (
            /* ==================== CLEAN CONVERSION VIEW ==================== */
            <>
              {/* Product Title (1 line) */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-headline uppercase tracking-tight text-white truncate">
                  {product.name}
                </h2>
                <p className="text-xs text-zinc-400 truncate mt-0.5 font-sans">
                  Kernel Ring-0 driver with streamproof DirectX overlay.
                </p>
              </div>

              {/* 2 Plans Selection: Monthly & Lifetime */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">
                  Select License Plan:
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.key;
                    return (
                      <button
                        key={plan.key}
                        onClick={() => setSelectedPlan(plan.key)}
                        className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white/[0.08] shadow-md scale-[1.02]'
                            : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                        }`}
                        style={{
                          borderColor: isSelected ? themeConfig.accent : undefined,
                        }}
                      >
                        {/* Clean Value Badge */}
                        {plan.badge && (
                          <span 
                            className="absolute -top-2 right-2 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase text-black shadow"
                            style={{ backgroundColor: themeConfig.accent }}
                          >
                            {plan.badge}
                          </span>
                        )}

                        <div>
                          <div className="text-xs font-bold text-white font-display">
                            {plan.label}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {plan.period}
                          </div>
                        </div>

                        <div className="mt-2 text-lg sm:text-xl font-black font-headline text-white">
                          ${typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Core Features (Single Line Only) */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" style={{ color: themeConfig.accent }} />
                  <span>Key Signals:</span>
                </div>

                <div className="space-y-1 pt-0.5">
                  {coreFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 truncate">
                      <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: themeConfig.accent }} />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Velocity Checkout Button */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-5 rounded-xl font-black font-display text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:scale-[1.02] hover:brightness-110 active:scale-[0.99]"
                  style={{
                    backgroundColor: themeConfig.buttonBg,
                    color: themeConfig.buttonText,
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Generating Key...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>Unlock {product.name} — ${typeof currentPlan.price === 'number' ? currentPlan.price.toFixed(2) : currentPlan.price}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Lock className="h-2.5 w-2.5" />
                    Instant 0s Delivery
                  </span>
                  <span>24/7 Discord Support</span>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
