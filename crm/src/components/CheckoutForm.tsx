'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Upload, 
  ExternalLink, 
  Lock, 
  AlertTriangle, 
  CreditCard, 
  Bitcoin, 
  Coins, 
  ArrowRight,
  Sparkles,
  Info,
  MessageSquare,
  X,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import type { PaymentMethod, PaymentSettings, ResolvedSelection } from '@arrowx/shared/orders';
import { findGiftCardPurchaseLink, getRequiredGiftCardDenomination, createCatalogGiftCardLinks, G2A_REWARBLE_PURCHASE_URL } from '@arrowx/shared/orders';

interface CheckoutFormProps {
  selection: ResolvedSelection;
  currentUser: { id: string; email: string; name?: string; username?: string } | null;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ selection, currentUser }) => {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BTC');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  
  // Proof inputs
  const [txHash, setTxHash] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Checkout Support Ticket State
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketEmail, setTicketEmail] = useState(currentUser?.email || '');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);
  const [ticketError, setTicketError] = useState('');

  const handleOpenSupportTicket = () => {
    setTicketSubject(`Pre-Purchase Inquiry: ${selection.productName} (${selection.variantName} - ${selection.offerLabel})`);
    setTicketEmail(currentUser?.email || '');
    setTicketMessage('');
    setTicketError('');
    setCreatedTicket(null);
    setShowTicketModal(true);
  };

  const handleSubmitCheckoutTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketEmail.trim() || !ticketSubject.trim() || !ticketMessage.trim()) {
      setTicketError('Email, subject, and message are required.');
      return;
    }

    setTicketSubmitting(true);
    setTicketError('');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: ticketEmail.trim(),
          customerName: currentUser?.name || currentUser?.username || ticketEmail.split('@')[0],
          discordHandle: discordHandle.trim() || undefined,
          subject: ticketSubject.trim(),
          initialMessage: ticketMessage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit support ticket.');
      }

      setCreatedTicket(data.ticket);
    } catch (err: any) {
      setTicketError(err.message || 'Could not submit your support ticket.');
    } finally {
      setTicketSubmitting(false);
    }
  };

  useEffect(() => {
    fetch('/api/payment-settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setPaymentSettings(data.settings);
        }
      })
      .catch((err) => console.error('Failed to load payment settings:', err));
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Screenshot file exceeds 5MB size limit.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload screenshot.');
      }

      setScreenshotUrl(data.url);
      setScreenshotFileName(data.fileName);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser) {
      setErrorMessage('Please log in to your account to complete checkout.');
      return;
    }

    if (paymentMethod === 'GIFT_CARD') {
      if (!giftCardLink) {
        setErrorMessage('Gift-card payment is unavailable for this order. Please choose a crypto payment method or contact support.');
        return;
      }
      if (!giftCardCode.trim()) {
        setErrorMessage('Please enter your purchased gift card code.');
        return;
      }
    } else {
      if (!txHash.trim() && !screenshotUrl.trim()) {
        setErrorMessage('Please provide either your transaction hash, payment screenshot, or both.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selection.productId,
          variantId: selection.variantId,
          offerId: selection.offerId,
          paymentMethod,
          txHash: txHash.trim() || undefined,
          screenshotUrl: screenshotUrl.trim() || undefined,
          giftCardCode: giftCardCode.trim() || undefined,
          discordHandle: discordHandle.trim() || undefined,
          notes: customerNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order.');
      }

      setCreatedOrderId(data.order.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (createdOrderId) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#090e0b]/95 border border-emerald-500/40 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>PAYMENT VERIFICATION PENDING</span>
          </div>

          <h2 className="text-3xl font-black font-display text-white">
            Order Received · {createdOrderId}
          </h2>

          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for your order! Your payment proof has been queued for manual review by our staff. Once verified, your license key will be dispatched directly to your dashboard.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono text-left space-y-2 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-zinc-500">Order ID:</span>
            <span className="text-white font-bold">{createdOrderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Product:</span>
            <span className="text-emerald-400">{selection.productName} ({selection.variantName})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Duration:</span>
            <span className="text-white">{selection.offerLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Amount:</span>
            <span className="text-white font-bold">${selection.amountUsd.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Method:</span>
            <span className="text-white">{paymentMethod}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`/track?id=${createdOrderId}`}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-display text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Track Order Status
          </a>
          <a
            href="/"
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-black/40 hover:bg-white/5 text-zinc-300 border border-white/10 text-xs font-mono font-semibold transition-all"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Active deposit info based on selected method
  const currentAddress = 
    paymentMethod === 'BTC' ? (paymentSettings?.btcAddress || '156uWuAoK4MZpZGcJcXeZ4pvqetc8zrsdA') :
    paymentMethod === 'SOL' ? (paymentSettings?.solAddress || '6Thyxoq4WwyobyTepmiqxN6n2JpQfsFfwQpz9c1gv6m8') :
    paymentMethod === 'USDT_TRC20' ? (paymentSettings?.usdtTrc20Address || 'THYKE8YXanrBSCvFtiihVLYstNNprKUhoC') :
    '';

  const currentQr =
    paymentMethod === 'BTC' ? (paymentSettings?.btcQrUrl || '/assets/payments/btc.png') :
    paymentMethod === 'SOL' ? (paymentSettings?.solQrUrl || '/assets/payments/sol.png') :
    paymentMethod === 'USDT_TRC20' ? (paymentSettings?.usdtTrc20QrUrl || '/assets/payments/usdt-trc20.png') :
    undefined;

  const currentNetwork =
    paymentMethod === 'BTC' ? { name: 'Bitcoin', code: 'BTC', accent: 'text-amber-400', warning: 'Send only BTC using the Bitcoin network.' } :
    paymentMethod === 'SOL' ? { name: 'Solana', code: 'SOL', accent: 'text-cyan-300', warning: 'Send only SOL using the Solana network. The address is case-sensitive.' } :
    { name: 'Tether USD', code: 'TRON · TRC-20', accent: 'text-emerald-400', warning: 'Send only USDT using the TRON (TRC-20) network.' };

  const requiredGiftCardDenomination = getRequiredGiftCardDenomination(selection.amountUsd);
  const activeGiftCardLinks = 
    paymentSettings?.giftCardLinks && paymentSettings.giftCardLinks.length > 0 
      ? paymentSettings.giftCardLinks 
      : createCatalogGiftCardLinks();
  const giftCardLink = findGiftCardPurchaseLink(selection.amountUsd, activeGiftCardLinks);
  const giftCardOverage = requiredGiftCardDenomination - selection.amountUsd;
  const giftCardUnavailable = paymentMethod === 'GIFT_CARD' && !giftCardLink;

  return (
    <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Order Summary & Customer Authentication State */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Order Summary Card */}
        <div className="p-6 rounded-3xl bg-[#090e0b]/90 border border-white/10 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Order Summary</div>
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
              VERIFIED PRICING
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-2xl font-black font-display text-white">
                {selection.productName}
              </div>
              <div className="text-xs font-mono text-emerald-400 mt-0.5">
                Edition: {selection.variantName}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Selected Plan:</span>
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <span>{selection.offerLabel}</span>
                  {(() => {
                    const id = selection.offerId.toLowerCase();
                    const label = selection.offerLabel.toLowerCase();
                    const badge = 
                      (id.includes('lifetime') || label.includes('lifetime') || id.includes('unlimited')) ? 'BEST VALUE' :
                      (id.includes('1-year') || label.includes('year')) ? 'BEST DEAL' :
                      (id.includes('3-month') || label.includes('3 month')) ? 'BEST VALUE' :
                      (id.includes('1-month') || label.includes('1 month')) ? 'MOST POPULAR' :
                      null;
                    if (!badge) return null;
                    return (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-400">
                        {badge}
                      </span>
                    );
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Fulfillment:</span>
                <span className="text-zinc-300">Staff Verified Key Dispatch</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-white/5">
                <span className="text-zinc-400 font-bold">Total Due:</span>
                <span className="text-emerald-400 font-black text-base font-display">
                  ${selection.amountUsd.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Account Authentication Banner */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-300 font-bold font-display">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Customer Account</span>
            </div>
            {currentUser ? (
              <div className="space-y-0.5 text-zinc-400 font-mono text-[11px]">
                <div>Logged in as: <span className="text-white font-bold">{currentUser.email}</span></div>
                {currentUser.name && <div>Customer: <span className="text-zinc-300">{currentUser.name}</span></div>}
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-amber-400 font-mono text-[11px] leading-relaxed">
                  You are not logged in. Sign in to link this purchase directly to your account.
                </p>
                <a
                  href={`/login?returnUrl=${encodeURIComponent(`/checkout?product=${selection.productId}&variant=${selection.variantId}&offer=${selection.offerId}`)}`}
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Log In / Sign In with Email OTP</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Security & Verification Notice */}
        <div className="p-5 rounded-3xl bg-[#090e0b]/60 border border-white/5 text-xs text-zinc-400 space-y-2 font-sans">
          <div className="flex items-center gap-2 font-bold text-white font-display">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Manual Payment Verification</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            To protect against fraudulent transactions and chargebacks, our security team verifies crypto on-chain confirmations and gift card codes before issuing product access.
          </p>
        </div>

        {/* Priority Checkout Support Card */}
        <div className="p-5 rounded-3xl bg-[#090e0b]/80 border border-emerald-500/20 text-xs space-y-3 font-sans shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white font-display">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span>Need Help with Checkout?</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
              PRIORITY DESK
            </span>
          </div>
          <p className="leading-relaxed text-[11px] text-zinc-400">
            Have questions regarding crypto confirmations, gift cards, or PC/hardware compatibility? Open a ticket directly with staff.
          </p>
          <button
            type="button"
            onClick={handleOpenSupportTicket}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/35 text-zinc-200 hover:text-emerald-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group shadow-sm"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Open Support Ticket &rarr;</span>
          </button>
        </div>

      </div>

      {/* Right Column: Payment Method Selection, Deposit Addresses & Proof Submission */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Payment Method Selector Tabs */}
        <div className="p-6 rounded-3xl bg-[#090e0b]/90 border border-white/10 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-display text-white">
              Select Payment Method
            </h3>
            <p className="text-xs text-zinc-400">
              Choose your preferred manual payment channel
            </p>
          </div>

          {/* Method Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            
            {/* BTC */}
            <button
              type="button"
              onClick={() => setPaymentMethod('BTC')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                paymentMethod === 'BTC'
                  ? 'bg-[#0d1612] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <Bitcoin className="h-5 w-5 text-amber-400" />
              <div className="text-xs font-bold text-white font-display">Bitcoin</div>
              <div className="text-[10px] text-zinc-500 font-mono">BTC Network</div>
            </button>

            {/* SOL */}
            <button
              type="button"
              onClick={() => setPaymentMethod('SOL')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                paymentMethod === 'SOL'
                  ? 'bg-[#0d1612] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <Coins className="h-5 w-5 text-cyan-300" />
              <div className="text-xs font-bold text-white font-display">Solana</div>
              <div className="text-[10px] text-zinc-500 font-mono">SOL Network</div>
            </button>

            {/* USDT TRC-20 */}
            <button
              type="button"
              onClick={() => setPaymentMethod('USDT_TRC20')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                paymentMethod === 'USDT_TRC20'
                  ? 'bg-[#0d1612] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <Coins className="h-5 w-5 text-emerald-400" />
              <div className="text-xs font-bold text-white font-display">USDT</div>
              <div className="text-[10px] text-emerald-400 font-mono font-bold">TRC-20 Only</div>
            </button>

            {/* Gift Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod('GIFT_CARD')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                paymentMethod === 'GIFT_CARD'
                  ? 'bg-[#0d1612] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <CreditCard className="h-5 w-5 text-purple-400" />
              <div className="text-xs font-bold text-white font-display">Gift Card</div>
              <div className="text-[10px] text-zinc-500 font-mono">G2A / Rewarble</div>
            </button>

          </div>

          {/* CRYPTO PAYMENT DETAILS */}
          {paymentMethod !== 'GIFT_CARD' ? (
            <div className="space-y-4 pt-2">
              
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/45">
                <div className="grid gap-5 p-5 sm:grid-cols-[220px_1fr] sm:p-6">
                  <div className="mx-auto w-full max-w-[220px]">
                    <div className="rounded-2xl bg-white p-3 shadow-[0_16px_50px_rgba(0,0,0,0.45)]">
                      {currentQr && (
                        <img
                          src={currentQr}
                          alt={`${currentNetwork.name} payment QR code`}
                          className="aspect-square w-full object-contain"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      Scan to copy address
                    </p>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-mono text-xs font-black uppercase tracking-[0.16em] ${currentNetwork.accent}`}>
                          {currentNetwork.code}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                          Manual verification
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-xl font-black text-white">Pay with {currentNetwork.name}</h4>
                      <p className="mt-1 text-xs text-zinc-400">Send exactly <span className="font-bold text-white">${selection.amountUsd.toFixed(2)} USD</span> in the selected currency.</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#050806] p-3.5">
                      <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">Deposit address</div>
                      <div className="select-all break-all font-mono text-sm font-semibold leading-relaxed text-emerald-300">{currentAddress}</div>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentAddress, 'addr')}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2.5 font-mono text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-400/15"
                      >
                        {copiedField === 'addr' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedField === 'addr' ? 'Address copied' : 'Copy full address'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-amber-400/20 bg-amber-400/[0.07] px-5 py-4 text-xs leading-relaxed text-amber-200 sm:px-6">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                  <p><span className="font-bold">Check the network before sending.</span> {currentNetwork.warning} Payments sent through another network may be permanently lost.</p>
                </div>
              </div>

              {/* Crypto Proof Inputs (Hash + Screenshot) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-400">
                  <span>Payment Verification Proof</span>
                  <span className="text-emerald-400 font-normal">Hash, Screenshot, or Both</span>
                </div>

                {/* Tx Hash */}
                <div className="space-y-1">
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Enter on-chain Transaction Hash / TxID (e.g. 8f9b...)"
                    className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Screenshot Uploader */}
                <div className="p-4 rounded-2xl bg-black/40 border border-dashed border-white/20 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white font-display">Upload Receipt Screenshot</div>
                      <div className="text-[10px] text-zinc-500 font-mono">PNG, JPEG, WebP (Max 5MB)</div>
                    </div>

                    <label className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {screenshotUrl && (
                    <div className="flex items-center gap-2 pt-2 text-xs font-mono text-emerald-400 border-t border-white/5">
                      <Check className="h-4 w-4" />
                      <span className="truncate">Attached: {screenshotFileName || 'Payment Screenshot'}</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ) : (
            /* GIFT CARD DETAILS */
            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-3xl space-y-4 text-xs bg-purple-500/10 border border-purple-500/30">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-purple-300 font-display text-sm">
                    <CreditCard className="h-4 w-4 text-purple-400" />
                    <span>Pay with G2A Rewarble Gift Card</span>
                  </div>
                  <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-purple-300 font-bold">
                    Credit Card · PayPal · Apple Pay
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
                    <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Order Total</div>
                    <div className="mt-1 text-lg font-black text-white">${selection.amountUsd.toFixed(2)}</div>
                  </div>
                  <div className="rounded-2xl border border-purple-400/30 bg-purple-950/30 p-3.5 ring-1 ring-purple-500/20">
                    <div className="text-[9px] uppercase tracking-wider text-purple-300 font-bold">Select on G2A</div>
                    <div className="mt-1 text-lg font-black text-purple-300">${requiredGiftCardDenomination} USD</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-2 text-[11px] leading-relaxed text-zinc-300">
                  <div className="font-mono text-[10px] uppercase font-bold text-zinc-400">Step-by-step instructions:</div>
                  <ol className="list-decimal space-y-1.5 pl-4 text-zinc-300">
                    <li>Click the button below to open the official <strong className="text-white">Rewarble Gift Card</strong> listing on G2A.</li>
                    <li>In the G2A value / denomination dropdown, select the <strong className="text-purple-300">${requiredGiftCardDenomination} USD</strong> card.</li>
                    <li>Complete checkout on G2A with your preferred payment method.</li>
                    <li>Once G2A delivers your code, copy and paste it into the field below.</li>
                  </ol>
                </div>

                {giftCardOverage > 0 && (
                  <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-[10px] leading-relaxed text-amber-300">
                    This card is ${(giftCardOverage).toFixed(2)} above your exact order total. The excess value is non-refundable.
                  </p>
                )}

                <a
                  href={giftCardLink?.purchaseUrl || G2A_REWARBLE_PURCHASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-500 px-5 py-3.5 font-mono text-xs font-bold text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.25)] cursor-pointer"
                >
                  <span>Open G2A to Buy ${requiredGiftCardDenomination} USD Card</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Gift Card Code Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400 font-medium">
                  Gift Card / Voucher Code:
                </label>
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  placeholder="Paste the complete gift-card code here (e.g. REW-XXXX-XXXX)"
                  className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Optional Discord & Notes */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">
                  Discord Username (Optional):
                </label>
                <input
                  type="text"
                  value={discordHandle}
                  onChange={(e) => setDiscordHandle(e.target.value)}
                  placeholder="e.g. user#1234 or @username"
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs font-mono focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">
                  Order Note (Optional):
                </label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Special instructions for staff"
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 text-xs font-mono focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit / Login Button */}
          {!currentUser ? (
            <a
              href={`/login?returnUrl=${encodeURIComponent(`/checkout?product=${selection.productId}&variant=${selection.variantId}&offer=${selection.offerId}`)}`}
              className="w-full py-4 px-6 rounded-2xl font-black font-display text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Lock className="h-5 w-5" />
              <span>Sign In to Complete Purchase · ${selection.amountUsd.toFixed(2)}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || isUploading || giftCardUnavailable}
              className={`w-full py-4 px-6 rounded-2xl font-black font-display text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl ${
                giftCardUnavailable
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
              }`}
            >
              <ShieldCheck className="h-5 w-5 fill-current" />
              <span>
                {isSubmitting
                  ? 'Submitting Order...'
                  : giftCardUnavailable
                    ? `No Approved $${requiredGiftCardDenomination} Gift Card Link`
                    : `Submit Payment for Verification · $${selection.amountUsd.toFixed(2)}`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

        </div>

    </form>

    {/* Pre-Purchase Support Ticket Modal Overlay */}
    {showTicketModal && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={() => setShowTicketModal(false)}
      >
        <div 
          className="w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden bg-[#080d0a]/95 border border-emerald-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow backdrop */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[120px] pointer-events-none opacity-20 bg-emerald-500" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-white">Pre-Purchase Support Desk</h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Priority Assistance for active checkout
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTicketModal(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Package Context Pill */}
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-300 font-bold">{selection.productName} ({selection.variantName} - {selection.offerLabel})</span>
            <span className="text-emerald-400 font-black">${selection.amountUsd.toFixed(2)} USD</span>
          </div>

          {createdTicket ? (
            <div className="space-y-5 text-center py-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold font-display text-white">Support Ticket Dispatched</h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Ticket ID: <span className="text-emerald-400 font-bold">#{createdTicket.id}</span>
                </p>
                <p className="text-xs text-zinc-400 max-w-[34ch] mx-auto pt-1 font-sans">
                  Our staff has received your inquiry and will respond directly to your email.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-display uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Return to Checkout
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitCheckoutTicket} className="space-y-4 text-xs font-mono">
              {ticketError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  {ticketError}
                </div>
              )}

              <div>
                <label className="block text-zinc-400 mb-1">Your Email Address</label>
                <input
                  type="email"
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Your Question or Message</label>
                <textarea
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your inquiry (e.g. crypto confirmation help, gift card redemption, PC compatibility)..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-display uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-2"
                >
                  {ticketSubmitting ? (
                    <>
                      <Clock className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    )}
  </>
  );
};
