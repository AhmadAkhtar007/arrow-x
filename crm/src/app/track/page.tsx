'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Copy, 
  ArrowLeft, 
  ExternalLink, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [currentOrderId, setCurrentOrderId] = useState(initialId);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(id.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.error || 'Order not found. Please check your order ID.');
      }

      setOrderData(data.order);
      setCurrentOrderId(id.trim());
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve order.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      fetchOrder(orderIdInput.trim());
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE TRACKING</span>
        </div>
      </div>

      {/* Header & Lookup Input */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090e0b]/90 border border-white/10 shadow-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
            Track <span className="text-emerald-400">Order & License</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Check payment verification progress and retrieve your license key
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Enter your Order ID (e.g. AX-12345)"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-black/70 border border-white/15 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-display text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Track Order</span>}
          </button>
        </form>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {orderData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090e0b]/95 border border-emerald-500/30 shadow-2xl space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono text-emerald-400 font-bold mb-0.5">
                ORDER ID: {orderData.id}
              </div>
              <h2 className="text-xl font-bold font-display text-white">
                {orderData.gameName}
              </h2>
              <div className="text-xs text-zinc-400 font-mono">
                {orderData.planTier} • ${Number(orderData.amount).toFixed(2)} USD
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-zinc-400 space-y-1">
              <div>Method: <strong className="text-white">{orderData.paymentMethod}</strong></div>
              <div>Placed: <span className="text-zinc-500">{orderData.createdAt}</span></div>
            </div>
          </div>

          {/* Dual Timeline Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Payment Verification Status */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Step 1: Payment Verification
              </div>
              
              <div className="flex items-center gap-2">
                {orderData.paymentStatus === 'VERIFIED' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-emerald-400 font-display">Payment Confirmed</span>
                  </>
                ) : orderData.paymentStatus === 'REJECTED' ? (
                  <>
                    <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-rose-400 font-display">Verification Failed</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-amber-400 animate-spin flex-shrink-0" />
                    <span className="text-sm font-bold text-amber-300 font-display">Staff Review In Progress</span>
                  </>
                )}
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                {orderData.paymentStatus === 'VERIFIED'
                  ? 'Your transaction has been verified on-chain by our security team.'
                  : orderData.paymentStatus === 'REJECTED'
                  ? 'The submitted proof could not be verified. Please open a support ticket for assistance.'
                  : 'Our staff is currently verifying your submitted transaction hash or payment receipt.'}
              </p>
            </div>

            {/* 2. License Dispatch Status */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Step 2: License Key Dispatch
              </div>

              <div className="flex items-center gap-2">
                {orderData.fulfillmentStatus === 'DISPATCHED' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-emerald-400 font-display">Dispatched to Vault</span>
                  </>
                ) : orderData.fulfillmentStatus === 'CLAIMED' ? (
                  <>
                    <Clock className="h-5 w-5 text-sky-400 animate-spin flex-shrink-0" />
                    <span className="text-sm font-bold text-sky-300 font-display">Acquiring from Provider</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                    <span className="text-sm font-bold text-zinc-400 font-display">Awaiting Verification</span>
                  </>
                )}
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                {orderData.fulfillmentStatus === 'DISPATCHED'
                  ? 'Your unique activation key is ready below.'
                  : orderData.fulfillmentStatus === 'CLAIMED'
                  ? 'Staff has claimed your order and is fetching your license key.'
                  : 'Fulfillment begins immediately after payment is marked verified.'}
              </p>
            </div>

          </div>

          {/* License Key Box (Only displayed when DISPATCHED) */}
          {orderData.licenseKey ? (
            <div className="p-5 rounded-2xl bg-[#050b07] border border-emerald-500/50 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-400 font-bold">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Key className="h-4 w-4" />
                  <span>Your Software License Key</span>
                </div>
                <span className="text-emerald-400">Ready to Activate</span>
              </div>

              <div className="p-4 rounded-xl bg-black/90 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="font-mono text-sm sm:text-base font-black text-white tracking-widest break-all select-all">
                  {orderData.licenseKey}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(orderData.licenseKey)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 shadow-md"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ) : null}

        </div>
      )}

    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="w-full pt-4 pb-12">
      <Suspense fallback={
        <div className="py-20 text-center text-xs font-mono text-emerald-400">
          <Clock className="h-8 w-8 mx-auto animate-spin mb-2" />
          <div>Loading Tracking Stream...</div>
        </div>
      }>
        <TrackContent />
      </Suspense>
    </div>
  );
}
