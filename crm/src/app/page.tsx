'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Key, 
  CheckCircle2, 
  Clock, 
  Copy, 
  MessageSquare, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Plus, 
  ArrowRight, 
  Shield, 
  Package, 
  Send,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { RealOrder, RealSupportTicket } from '../lib/types';
import { ArrowXLogo } from '../components/ArrowXLogo';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Customer Data
  const [orders, setOrders] = useState<RealOrder[]>([]);
  const [tickets, setTickets] = useState<RealSupportTicket[]>([]);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Ticket Modal States
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Active Ticket Viewer / Chat Thread Modal
  const [viewingTicket, setViewingTicket] = useState<RealSupportTicket | null>(null);
  const [customerReplyText, setCustomerReplyText] = useState('');
  const [sendingCustomerReply, setSendingCustomerReply] = useState(false);

  // 1. Check Session & Load Customer Data on Mount
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();

        if (authData.authenticated && authData.user.role === 'customer') {
          setCurrentUser(authData.user);

          // Fetch orders for this customer
          const [ordRes, tckRes] = await Promise.all([
            fetch(`/api/orders?email=${encodeURIComponent(authData.user.email)}`),
            fetch(`/api/tickets?email=${encodeURIComponent(authData.user.email)}`),
          ]);

          const [ordData, tckData] = await Promise.all([
            ordRes.json(),
            tckRes.json(),
          ]);

          if (ordData.success && ordData.orders) {
            setOrders(ordData.orders);
            if (ordData.orders.length > 0) {
              setSelectedOrderId(ordData.orders[0].id);
            }
          }
          if (tckData.success && tckData.tickets) {
            setTickets(tckData.tickets);
          }
        } else if (authData.authenticated && (authData.user.role === 'admin' || authData.user.role === 'superadmin')) {
          router.replace('/admin');
          return;
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Session load error:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchCustomerData();
  }, [router]);

  // Real-time synchronization for customer profile updates across components
  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setCurrentUser((prev: any) => (prev ? { ...prev, ...e.detail } : e.detail));
      }
    };

    window.addEventListener('arrowx:profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('arrowx:profile-updated', handleProfileUpdate);
  }, []);

  const handleCopyKey = (key: string, orderId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(orderId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // 2. Submit Support / HWID Ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim() || !ticketSubject.trim()) return;

    setTicketSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderId || undefined,
          customerEmail: currentUser.email,
          customerName: currentUser.name || currentUser.username,
          discordHandle: currentUser.discordHandle,
          subject: ticketSubject.trim(),
          initialMessage: ticketMessage.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTickets((prev) => [data.ticket, ...prev]);
        setTicketSuccess(true);
        setTimeout(() => {
          setTicketSuccess(false);
          setShowTicketModal(false);
          setTicketSubject('');
          setTicketMessage('');
        }, 1200);
      }
    } catch (err) {
      console.error('Ticket submit error:', err);
    } finally {
      setTicketSubmitting(false);
    }
  };

  // 3. Customer Reply to Active Ticket
  const handleSendCustomerReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingTicket || !customerReplyText.trim()) return;

    setSendingCustomerReply(true);
    try {
      const res = await fetch(`/api/tickets/${viewingTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: customerReplyText.trim() }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setTickets((prev) => prev.map((t) => (t.id === viewingTicket.id ? data.ticket : t)));
        setViewingTicket(data.ticket);
        setCustomerReplyText('');
      }
    } catch (err) {
      console.error('Customer reply error:', err);
    } finally {
      setSendingCustomerReply(false);
    }
  };

  // 4. Customer Mark Ticket Resolved
  const handleCustomerResolveTicket = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? data.ticket : t)));
        if (viewingTicket?.id === ticketId) {
          setViewingTicket(data.ticket);
        }
      }
    } catch (err) {
      console.error('Resolve ticket error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-emerald-400 space-y-2">
        <div className="text-center space-y-3">
          <Clock className="h-8 w-8 mx-auto animate-spin" />
          <div>Synchronizing Your License Vault...</div>
        </div>
      </div>
    );
  }

  // If Not Authenticated, show seamless Sign In Gateway
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-[#080d0a]/95 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl space-y-6 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[120px] pointer-events-none opacity-20 bg-emerald-500" />

          <div className="flex justify-center">
            <ArrowXLogo size={48} variant="green" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
              Customer <span className="text-emerald-400">License Vault.</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md mx-auto">
              Sign in with your delivery email to access your active license keys, loader download links, and human support desk.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black font-display text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95"
            >
              <span>Sign In with Email (OTP)</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </div>

          <div className="text-[11px] font-mono text-zinc-500">
            Zero password friction. Instant verification code.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pt-4 pb-12">
      
      {/* 1. Customer Welcome Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#09140e] via-[#060a08] to-[#030604] border border-emerald-500/25 overflow-hidden shadow-2xl space-y-4">
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[140px] pointer-events-none opacity-25 bg-emerald-500"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-400 w-fit mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span>Customer Hub Active</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">{currentUser.name || currentUser.username}</span>
            </h1>
            <p className="text-xs text-zinc-400 font-mono pt-1">
              Account: <span className="text-white">{currentUser.email}</span> {currentUser.discordHandle && <span className="text-[#5865F2] ml-2">({currentUser.discordHandle})</span>}
            </p>
          </div>

          {/* Quick Support Trigger */}
          <button
            onClick={() => setShowTicketModal(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Open Support Ticket</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-emerald-500/20 space-y-1">
          <div className="text-xs text-zinc-400 flex items-center justify-between">
            <span>Active Licenses</span>
            <Key className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-display text-white">{orders.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-white/10 space-y-1">
          <div className="text-xs text-zinc-400 flex items-center justify-between">
            <span>Support Tickets</span>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-display text-white">{tickets.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-white/10 space-y-1">
          <div className="text-xs text-zinc-400 flex items-center justify-between">
            <span>Account Security</span>
            <ShieldCheck className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-xs font-bold text-emerald-400 pt-1">Registered & Protected</div>
        </div>
      </div>

      {/* 3. SECTION 1: MY ACTIVE LICENSES & ORDERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-bold font-display text-white uppercase tracking-wider">
              My Purchased Licenses
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">{orders.length} Total</span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#080d0a]/90 border border-white/10 text-center space-y-3">
            <Package className="h-10 w-10 mx-auto text-zinc-600" />
            <h3 className="text-base font-bold font-display text-white">No Licenses Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
              You do not have any active product licenses under <span className="text-emerald-400 font-mono">{currentUser.email}</span>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-6 rounded-3xl bg-[#080d0a]/95 border border-emerald-500/30 hover:border-emerald-500/50 transition-all space-y-5 shadow-xl relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-emerald-400 font-semibold mb-0.5">
                      {ord.id} • {ord.createdAt}
                    </div>
                    <div className="text-lg font-bold font-display text-white">
                      {ord.gameName}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      Plan: <strong className="text-emerald-300">{ord.planTier}</strong> (${ord.amount.toFixed(2)})
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 font-mono text-[10px]">
                    <span 
                      className={`px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                        ord.paymentStatus === 'VERIFIED'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : ord.paymentStatus === 'REJECTED'
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                          : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      }`}
                    >
                      {ord.paymentStatus === 'VERIFIED' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Payment Verified</span>
                        </>
                      ) : ord.paymentStatus === 'REJECTED' ? (
                        <span>Payment Rejected</span>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 animate-spin" />
                          <span>Verifying Payment</span>
                        </>
                      )}
                    </span>

                    <span className="text-zinc-500">
                      {ord.fulfillmentStatus === 'DISPATCHED' ? 'Delivered' :
                       ord.fulfillmentStatus === 'CLAIMED' ? 'In Fulfillment' : 'Pending Review'}
                    </span>
                  </div>
                </div>

                {/* Rejection notice if payment rejected */}
                {ord.paymentStatus === 'REJECTED' && ord.rejectionReason && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    <span className="font-bold">Staff Note:</span> {ord.rejectionReason}
                  </div>
                )}

                {/* License Key Box */}
                {ord.licenseKey ? (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1">
                      <Key className="h-3 w-3 text-emerald-400" />
                      <span>Assigned License Key:</span>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/80 border border-emerald-500/30 font-mono text-xs text-emerald-300">
                      <span className="flex-1 truncate select-all">{ord.licenseKey}</span>
                      <button
                        onClick={() => handleCopyKey(ord.licenseKey!, ord.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        {copiedKeyId === ord.id ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                    <Clock className="h-4 w-4 animate-spin flex-shrink-0" />
                    <span>
                      {ord.paymentStatus === 'VERIFIED'
                        ? 'Staff is allocating your license key. Ready shortly.'
                        : 'Manual review in progress. Key will be dispatched once verified.'}
                    </span>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Method: {ord.paymentMethod}</span>
                  
                  <button
                    onClick={() => {
                      setSelectedOrderId(ord.id);
                      setTicketSubject(`HWID / Support Inquiry for ${ord.gameName}`);
                      setShowTicketModal(true);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Get Help</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. SECTION 2: MY SUPPORT & HWID TICKETS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            <h2 className="text-base font-bold font-display text-white uppercase tracking-wider">
              My Support Tickets
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">{tickets.length} Total</span>
        </div>

        {tickets.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#080d0a]/90 border border-white/10 text-center space-y-2">
            <div className="text-xs font-mono text-zinc-400">No active support tickets opened.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((tck) => (
              <div
                key={tck.id}
                onClick={() => setViewingTicket(tck)}
                className="p-5 rounded-2xl bg-[#080d0a]/95 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer space-y-3 shadow-md group"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400">{tck.id}</span>
                    {tck.orderId && (
                      <span className="text-[10px] text-zinc-500 font-normal">
                        • Order: {tck.orderId.substring(0, 10)}
                      </span>
                    )}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    tck.status === 'Open' 
                      ? 'bg-amber-500/20 text-amber-300' 
                      : tck.status === 'Resolved'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : tck.status === 'Closed'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-sky-500/20 text-sky-300'
                  }`}>
                    {tck.status}
                  </span>
                </div>

                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {tck.subject}
                </div>

                {/* Latest message snippet */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-xs text-zinc-300 space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                    <span>Latest update from <strong className="text-slate-300">{tck.messages[tck.messages.length - 1]?.senderName || 'Staff'}</strong>:</span>
                    <span>{tck.messages[tck.messages.length - 1]?.timestamp ? new Date(tck.messages[tck.messages.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <p className="font-sans text-zinc-300 line-clamp-2">{tck.messages[tck.messages.length - 1]?.text}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-emerald-400 font-mono">
                  <span className="text-[11px] text-zinc-500">Click to open chat thread & reply</span>
                  <span className="flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Open Conversation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Support Ticket Submission Modal */}
      {showTicketModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowTicketModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#080d0a] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-display">
                <MessageSquare className="h-5 w-5" />
                <span>Create Support Request</span>
              </div>
            </div>

            {ticketSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-400 animate-bounce" />
                <h4 className="text-base font-bold text-white font-display">Ticket Dispatched to Staff</h4>
                <p className="text-xs text-zinc-400">Our engineering team has received your ticket and will respond directly on your dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-mono">
                {orders.length > 0 && (
                  <div>
                    <label className="block text-zinc-400 mb-1">Associated Order / Game</label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.gameName} ({o.planTier}) - {o.id}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-zinc-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="What is your question?"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-emerald-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Details</label>
                  <textarea
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe your issue or provide details..."
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-emerald-500 font-sans"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={ticketSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {ticketSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 6. Active Ticket Conversation Thread Modal */}
      {viewingTicket && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans"
          onClick={() => setViewingTicket(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#080d0a] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{viewingTicket.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    viewingTicket.status === 'Open'
                      ? 'bg-amber-500/20 text-amber-300'
                      : viewingTicket.status === 'Resolved'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : viewingTicket.status === 'Closed'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-sky-500/20 text-sky-300'
                  }`}>
                    {viewingTicket.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-display mt-1">{viewingTicket.subject}</h3>
                {viewingTicket.orderId && (
                  <div className="text-xs text-zinc-400 font-mono">Linked Order: {viewingTicket.orderId}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {viewingTicket.status !== 'Resolved' && (
                  <button
                    type="button"
                    onClick={() => handleCustomerResolveTicket(viewingTicket.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark Solved</span>
                  </button>
                )}
                <button
                  onClick={() => setViewingTicket(null)}
                  className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer p-1"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Chat Thread */}
            <div className="space-y-3.5 overflow-y-auto pr-2 py-2 flex-1 max-h-[380px]">
              {viewingTicket.messages.map((m) => {
                const isStaff = m.sender === 'staff';
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl max-w-[85%] text-xs space-y-1.5 ${
                      isStaff
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 mr-auto'
                        : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 ml-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 font-mono text-[10px]">
                      <span className="font-bold flex items-center gap-1.5">
                        <span>{m.senderName}</span>
                        {isStaff && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 text-[9px] uppercase font-bold">
                            STAFF
                          </span>
                        )}
                      </span>
                      <span className="text-zinc-500">
                        {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="leading-relaxed font-sans text-sm whitespace-pre-wrap">{m.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendCustomerReply} className="space-y-2 pt-3 border-t border-white/10">
              <textarea
                rows={2}
                value={customerReplyText}
                onChange={(e) => setCustomerReplyText(e.target.value)}
                placeholder="Reply to support staff..."
                className="w-full p-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-xs font-sans focus:outline-none focus:border-emerald-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={sendingCustomerReply || !customerReplyText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{sendingCustomerReply ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
