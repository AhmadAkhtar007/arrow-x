'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Shield, CheckCircle2, AlertCircle, Key, AtSign, X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onUserUpdated?: (updatedUser: any) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}) => {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const [username, setUsername] = useState(currentUser?.username || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [discordHandle, setDiscordHandle] = useState(currentUser?.discordHandle || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setName(currentUser.name || '');
      setDiscordHandle(currentUser.discordHandle || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (isAdmin && newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (isAdmin && newPassword && !currentPassword) {
      setError('Please provide your current password to set a new password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          name: name.trim(),
          discordHandle: !isAdmin ? discordHandle.trim() : undefined,
          currentPassword: isAdmin ? currentPassword || undefined : undefined,
          newPassword: isAdmin ? newPassword || undefined : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setSuccess(true);
      if (onUserUpdated) {
        onUserUpdated(data.user);
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const accentColor = isAdmin ? 'blue' : 'emerald';
  const borderFocus = isAdmin ? 'focus:border-blue-500' : 'focus:border-emerald-500';
  const btnBg = isAdmin ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]';
  const textAccent = isAdmin ? 'text-blue-400' : 'text-emerald-400';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all ${
          isAdmin 
            ? 'bg-[#060913]/95 border border-blue-500/30' 
            : 'bg-[#080d0a]/95 border border-emerald-500/30'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div 
          className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[120px] pointer-events-none opacity-20 ${
            isAdmin ? 'bg-blue-500' : 'bg-emerald-500'
          }`} 
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${textAccent}`}>
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">{isAdmin ? 'Account Settings & Security' : 'Profile Settings'}</h2>
              <p className="text-xs text-zinc-400 font-mono">
                {currentUser.email} • <span className="capitalize">{currentUser.role}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success Alert */}
        {success && (
          <div className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2.5 ${
            isAdmin ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{isAdmin ? 'Profile and credentials updated successfully!' : 'Profile updated successfully!'}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          
          {/* Identity Fields */}
          {isAdmin ? (
            <div>
              <label className="block text-zinc-400 mb-1">Administrative Username</label>
              <div className="relative">
                <AtSign className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${textAccent}`} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none ${borderFocus}`}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none ${borderFocus}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Discord Handle</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5865F2]" />
                  <input
                    type="text"
                    value={discordHandle}
                    onChange={(e) => setDiscordHandle(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none ${borderFocus}`}
                    placeholder="e.g. shadow_sniper"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Password Change Section (admin accounts only) */}
          {isAdmin && <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="text-zinc-400 font-bold flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5" />
              <span>Change Password (Optional)</span>
            </div>

            <div>
              <label className="block text-zinc-500 mb-1">Current Password (Required for changes)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 focus:outline-none ${borderFocus}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 focus:outline-none ${borderFocus}`}
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 focus:outline-none ${borderFocus}`}
                />
              </div>
            </div>
          </div>}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-xl ${btnBg} text-black font-bold font-display uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 ${
                isAdmin ? 'text-white' : 'text-black'
              }`}
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
