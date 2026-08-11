'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowXLogo } from '../../components/ArrowXLogo';
import { Mail, User, ArrowRight, ShieldCheck, AlertCircle, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  
  // Step 1: Email & Name; Step 2: 6-Digit OTP
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  // Step 1: Request 6-Digit OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      setIsNewUser(!!data.isNewUser);
      if (data.otpPreview) {
        setOtpPreview(data.otpPreview);
        setOtpCode(data.otpPreview); // Auto-fill for friction-free UX
      }

      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-Digit OTP & Complete Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode.trim(),
          name: name.trim() || undefined,
          discordHandle: discordHandle.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#080d0a]/95 border border-emerald-500/30 rounded-3xl p-8 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[120px] pointer-events-none opacity-20 bg-emerald-500" />

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <ArrowXLogo size={42} variant="green" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-display text-white uppercase tracking-tight">
              {step === 'email' ? 'Customer Sign In' : 'Enter Verification Code'}
            </h1>
            <p className="text-xs text-zinc-400 font-sans">
              {step === 'email' 
                ? 'Zero-password verification. Enter your email for instant access.' 
                : `We sent a 6-digit security code to ${email}`}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-zinc-400 mb-1">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Discord Handle (Optional)</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5865F2]" />
                <input
                  type="text"
                  value={discordHandle}
                  onChange={(e) => setDiscordHandle(e.target.value)}
                  placeholder="e.g. shadow_sniper"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-display text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Sending Code...' : 'Send Verification Code'}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs font-mono">
            {otpPreview && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-emerald-400" />
                  <span>Security Code: <strong className="text-white tracking-widest">{otpPreview}</strong></span>
                </div>
                <span className="text-[10px] text-zinc-400 font-sans">Auto-filled</span>
              </div>
            )}

            <div>
              <label className="block text-zinc-400 mb-1 text-center">6-Digit One-Time Code</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full py-3 text-center tracking-[0.5em] text-xl font-mono font-black rounded-2xl bg-black/60 border border-emerald-500/40 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-400 transition-all"
                required
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-display text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Verifying...' : 'Verify & Enter'}</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] font-mono text-zinc-500">
          Permanent on-device authentication with zero password friction.
        </div>

      </div>
    </div>
  );
}
