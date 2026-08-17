import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, FileCheck2, AlertCircle, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | ArrowX',
  description: 'Official Terms of Service governing the purchase, licensing, and usage of ArrowX software products, customer portals, and services.',
};

export default function TermsOfServicePage() {
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
            <Scale className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-300">LEGAL & SERVICE AGREEMENT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Effective Date: {lastUpdated} · Version 2.4
          </p>
        </div>
      </div>

      {/* Main Legal Content Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#090e0b]/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-8 text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed">
        
        {/* Core Notice */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
            <FileCheck2 className="h-4 w-4" />
            <span>Important Notice Regarding Digital Products</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            By accessing the ArrowX website, creating an account, or purchasing digital software licenses, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must refrain from using our services.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">01.</span>
            Digital License Grant & Single-User Scope
          </h2>
          <p>
            Upon verified payment, ArrowX grants you a limited, non-exclusive, non-transferable, revocable license to use the purchased digital software for personal, non-commercial purposes during the designated subscription duration:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-xs sm:text-sm">
            <li>
              <strong className="text-zinc-200">Hardware Identifier (HWID) Binding:</strong> Each license key is bound to a single computer hardware configuration. Sharing license keys, running across multiple simultaneous devices, or unauthorized multi-user usage is strictly prohibited and results in automatic license revocation without refund.
            </li>
            <li>
              <strong className="text-zinc-200">Prohibition on Reverse Engineering:</strong> You agree not to decompile, disassemble, reverse engineer, decrypt, analyze, modify, redistribute, or create derivative works of any ArrowX binary, kernel module, or loader.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">02.</span>
            Order Submission & Payment Verification
          </h2>
          <p>
            To maintain security and prevent unauthorized payment fraud, all orders are subject to manual staff verification:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Cryptocurrency Payments
              </div>
              <p className="text-[11px] text-zinc-400">
                You must send the exact requested USD equivalent to our designated wallet on the specified blockchain network (BTC, SOL, or USDT TRC-20). You are responsible for ensuring correct network selection.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Gift Card Vouchers (G2A)
              </div>
              <p className="text-[11px] text-zinc-400">
                When purchasing a Rewarble gift card through G2A, you must select the required denomination. Any fractional excess value above the product total is non-refundable and non-credited.
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400 pt-1">
            Once payment proof (transaction hash, receipt, or gift card code) is submitted, our operations desk reviews and verifies the deposit before dispatching your license key to your customer portal.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">03.</span>
            Digital Fulfillment & Refund Policy
          </h2>
          <p>
            Due to the irrevocable digital nature of software license keys and virtual tokens, all sales are considered final once a license key is dispatched:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-xs sm:text-sm">
            <li>
              <strong className="text-zinc-200">Pre-Fulfillment Cancellations:</strong> If an order is pending verification and has not yet been processed or dispatched, you may contact support to request an order cancellation.
            </li>
            <li>
              <strong className="text-zinc-200">Technical Compatibility Guarantee:</strong> In the rare event of an irreconcilable system incompatibility verified by our engineering desk on a clean, supported operating system (Windows 10/11 x64), support will provide subscription time extensions, alternative product replacements, or appropriate resolution at our discretion.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">04.</span>
            Anti-Cheat & Third-Party Game Compatibility Disclaimer
          </h2>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-200">
              <strong className="text-amber-300 font-bold block">User Responsibility & Third-Party Terms</strong>
              ArrowX software products interact with third-party video games. Game publishers continually alter and update their code and anti-cheat mechanisms. While ArrowX maintains automated over-the-air update telemetry, you acknowledge that software status may temporarily transition to &quot;Updating&quot; or &quot;Testing&quot; following unexpected game patches.
            </div>
          </div>
          <p>
            ArrowX does not guarantee that third-party game services will remain permanently compatible or that your third-party game account will never face moderation under a publisher&apos;s independent Terms of Service. You assume all operational risks associated with third-party game interactions.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">05.</span>
            Prohibited Activities & Account Termination
          </h2>
          <p>
            ArrowX reserves the right to immediately terminate, suspend, or revoke access to accounts and licenses without refund if a user engages in:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 text-xs sm:text-sm">
            <li>Submitting fraudulent transaction proofs, chargebacks, or expired voucher codes.</li>
            <li>Distributing, re-selling, or publishing private license keys on public forums.</li>
            <li>Attempting to exploit, scrape, DDoS, or breach ArrowX servers or databases.</li>
            <li>Harassment, abusive behavior, or threats directed at staff members or community users.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">06.</span>
            Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, ArrowX, its developers, and affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use of, or inability to use, our services or software.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold font-display text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">07.</span>
            Amendments & Contact Inquiries
          </h2>
          <p>
            We may revise these Terms of Service at any time. Continued use of our software or services following any modifications constitutes your acceptance of the revised terms.
          </p>
          <p>
            For legal inquiries, technical support, or order questions, reach out via our official <a href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/sMHzvy2QYT"} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Discord Support Desk</a>.
          </p>
        </section>

      </div>

    </div>
  );
}
