'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ChevronLeft, RotateCw, ShieldCheck, ArrowRight } from 'lucide-react';
import { ArrowXLogo } from '../../components/ArrowXLogo';
import { sanitizeReturnUrl } from '../../lib/customerAuth';

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function CustomerLoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = useMemo(() => sanitizeReturnUrl(params.get('returnUrl') || params.get('redirect')), [params]);
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(params.get('oauthError') || '');

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not send your verification code.');
      }
      setIsNewUser(Boolean(data.isNewUser));
      setOtpPreview(data.otpPreview || null);
      if (data.otpPreview) {
        setOtpCode(data.otpPreview);
      }
      setCooldown(30);
      setStep('otp');
    } catch (cause: any) {
      setError(cause instanceof Error ? cause.message : 'Could not send your code.');
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendOtp();
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'That code could not be verified.');
      }
      router.replace(returnUrl);
      router.refresh();
    } catch (cause: any) {
      setError(cause instanceof Error ? cause.message : 'Verification failed.');
      setLoading(false);
    }
  };

  const oauthHref = (provider: 'discord' | 'google') =>
    `/api/auth/signin/${provider}?returnUrl=${encodeURIComponent(returnUrl)}`;

  return (
    <div className="w-full max-w-[420px] rounded-[28px] bg-[#0c0d0e]/95 border border-white/10 p-8 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-2xl">
      {/* Subtle Ambient Top Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 rounded-full blur-[70px] pointer-events-none" />

      {/* Brand Logo */}
      <div className="flex justify-center mb-6 relative z-10">
        <ArrowXLogo size={42} variant="green" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="text-center space-y-1.5 mb-6 relative z-10">
        {returnUrl.startsWith('/checkout') && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono flex items-center justify-center gap-2 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Preserving Active Checkout Selection</span>
          </div>
        )}
        <h1 className="text-2xl sm:text-[26px] font-black font-display tracking-tight text-white">
          {step === 'email' ? 'Access your license vault' : 'Check your email'}
        </h1>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-[32ch] mx-auto">
          {step === 'email'
            ? 'Zero-password verification. Enter your email for instant access.'
            : `We sent a 6-digit security code to ${email}`}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-mono text-center">
          {error}
        </div>
      )}

      {step === 'email' ? (
        <div className="space-y-5 relative z-10">
          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={oauthHref('google')}
              className="flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-[#161719] hover:bg-[#1f2024] hover:border-white/20 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
            >
              <GoogleIcon />
              <span>Google</span>
            </a>

            <a
              href={oauthHref('discord')}
              className="flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-[#161719] hover:bg-[#1f2024] hover:border-white/20 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
            >
              <DiscordIcon />
              <span>Discord</span>
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-normal">
            <span className="h-px flex-1 bg-white/10" />
            <span>or sign in with email</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* Email Form */}
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#121316] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white hover:bg-zinc-200 text-black text-sm font-bold transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Sending code...' : 'Continue'}</span>
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-5 relative z-10">
          {otpPreview && (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-center text-xs text-emerald-300 font-mono">
              Development Security Code: <strong className="text-white tracking-[0.2em]">{otpPreview}</strong>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-2 text-center">
              Security Code (Email OTP)
            </label>
            <input
              type="text"
              maxLength={8}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••••"
              autoFocus
              required
              className="h-16 w-full rounded-2xl border border-white/15 bg-[#111214] text-center font-mono text-2xl font-black tracking-[0.35em] text-white outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length < 6}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white hover:bg-zinc-200 text-black text-sm font-bold transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-40"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{loading ? 'Verifying...' : 'Verify & Enter Vault'}</span>
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtpCode('');
                setError('');
              }}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Change email</span>
            </button>

            <button
              type="button"
              onClick={sendOtp}
              disabled={cooldown > 0 || loading}
              className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors disabled:text-zinc-600 cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Footer Note */}
      <p className="mt-8 text-center text-[11px] text-zinc-500 leading-relaxed relative z-10">
        By continuing, you agree to ArrowX's{' '}
        <span className="text-zinc-400 underline underline-offset-2">Terms of Service</span> and{' '}
        <span className="text-zinc-400 underline underline-offset-2">Privacy Policy</span>.
      </p>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="font-mono text-xs text-emerald-400">Loading vault sign-in...</div>}>
        <CustomerLoginContent />
      </Suspense>
    </div>
  );
}
