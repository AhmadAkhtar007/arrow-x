'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowXLogo } from '../../../components/ArrowXLogo';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('LivingLegend');
  const [password, setPassword] = useState('Admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: username,
          password,
          isAdminLogin: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid admin credentials.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#060913]/95 border border-blue-500/30 rounded-3xl p-8 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[120px] pointer-events-none opacity-20 bg-blue-600" />

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <ArrowXLogo size={42} variant="blue" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-display text-white uppercase tracking-tight">
              Command Desk Login
            </h1>
            <p className="text-xs text-zinc-400 font-sans">
              Authorized administrative access only.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-zinc-400 mb-1">Admin Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="LivingLegend"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all font-bold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black font-display text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.4)] cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Unlock Command Center'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] font-mono text-zinc-500">
          All login attempts are logged and protected with AES-256 session signatures.
        </div>

      </div>
    </div>
  );
}
