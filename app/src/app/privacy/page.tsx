import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | ArrowX',
  description: 'Official Privacy Policy for ArrowX software, licensing services, and customer portal. Learn how we safeguard your data, payments, and privacy.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'August 17, 2026';

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Header */}
      <div className="space-y-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Store</span>
        </Link>

        <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0b120e] via-[#070c09] to-[#040705] border border-white/10 overflow-hidden shadow-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-300">LEGAL & DATA PROTECTION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Effective Date: {lastUpdated} · Version 2.4
          </p>
        </div>
      </div>

      {/* Main Legal Content Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#090e0b]/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-8 text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed">
        
        {/* Core Principles Callout */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Our Privacy Commitment</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            ArrowX operates under a strict minimal-data collection architecture. We do not harvest sensitive personal information, we never sell or monetize user data, and we do not store unencrypted financial credentials on our servers.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">01.</span>
            Information We Collect
          </h2>
          <p>
            When you interact with the ArrowX storefront, purchase software licenses, or access our customer portal, we collect only the minimal data necessary to fulfill orders, activate software licenses, and provide technical support:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-xs sm:text-sm">
            <li>
              <strong className="text-zinc-200">Account Credentials:</strong> Email address for secure One-Time Password (OTP) login authentication and account identification.
            </li>
            <li>
              <strong className="text-zinc-200">Order & Transaction Records:</strong> Purchased game title, software edition, duration tier, transaction timestamp, payment method (BTC, SOL, USDT, or Gift Card voucher), and order fulfillment status.
            </li>
            <li>
              <strong className="text-zinc-200">Hardware Telemetry (HWID):</strong> An anonymized hardware identifier generated solely to bind and validate your software license key to your authorized machine.
            </li>
            <li>
              <strong className="text-zinc-200">Support Interactions:</strong> Communication records, support ticket logs, and voluntarily provided Discord handles required for ticket resolution.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">02.</span>
            How We Use Your Information
          </h2>
          <p>
            Collected information is utilized strictly for service delivery and fraud prevention:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                License Delivery & Binding
              </div>
              <p className="text-[11px] text-zinc-400">
                To issue, authorize, and renew digital license keys associated with your user profile and bound machine.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Manual Payment Verification
              </div>
              <p className="text-[11px] text-zinc-400">
                To verify on-chain blockchain transaction hashes or voucher codes submitted during checkout.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Customer Support Operations
              </div>
              <p className="text-[11px] text-zinc-400">
                To triage tickets, resolve software configuration inquiries, and process authorized HWID resets.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                System Security & Telemetry
              </div>
              <p className="text-[11px] text-zinc-400">
                To safeguard infrastructure against automated brute-force attempts, chargeback fraud, and abuse.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">03.</span>
            Payment Processing & Financial Privacy
          </h2>
          <p>
            ArrowX does not collect, process, or store credit card numbers, CVVs, or banking credentials on our infrastructure:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-xs sm:text-sm">
            <li>
              <strong className="text-zinc-200">Cryptocurrency Payments (BTC, SOL, USDT):</strong> Transactions occur directly on public blockchains. We only view the public transaction hash and sender/receiver addresses for manual receipt confirmation.
            </li>
            <li>
              <strong className="text-zinc-200">Gift Card Payments (G2A / Rewarble):</strong> When paying via G2A, your financial transaction is processed entirely by G2A and its authorized payment gateways. ArrowX receives only the alphanumeric redemption code you submit in our checkout form.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">04.</span>
            Data Storage, Encryption & Retention
          </h2>
          <p>
            All network communication with our servers is encrypted in transit using industry-standard TLS 1.3 encryption. Internal database records utilize strict Row-Level Security (RLS) policies ensuring that only authorized operations personnel can view customer order records.
          </p>
          <p>
            We retain account and transaction records only for as long as your account remains active or as required for ongoing licensing support and fraud prevention. Inactive order proofs (such as uploaded screenshots) are automatically purged on a periodic schedule.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">05.</span>
            Third-Party Disclosure & Advertising
          </h2>
          <p>
            We do not sell, rent, trade, or otherwise disclose customer information to third-party data brokers or marketing agencies. Information is shared only with necessary infrastructure providers (such as hosting and database services) bound by strict confidentiality and data-processing terms.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">06.</span>
            User Rights & Account Erasure
          </h2>
          <p>
            You have the right to request access to the data associated with your email address, request corrections, or request complete account erasure. To request data deletion or an account purge, submit a ticket through the <a href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/sMHzvy2QYT"} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">ArrowX Discord Support Desk</a>.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">07.</span>
            Updates to This Policy
          </h2>
          <p>
            We may periodically update this Privacy Policy to reflect changes in our software, infrastructure, or applicable regulatory standards. Any material changes will be reflected with an updated Effective Date at the top of this page.
          </p>
        </section>

      </div>

    </div>
  );
}
