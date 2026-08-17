'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Ticket, X, Send, MessageSquare, CheckCircle2, Search, ArrowRight, ShieldCheck, RefreshCw, User, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TicketMessage {
  id: string;
  sender: 'customer' | 'staff';
  senderName: string;
  text: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  orderId?: string;
  customerEmail: string;
  customerName?: string;
  discordHandle?: string;
  subject: string;
  status: 'Open' | 'Pending Staff' | 'HWID Approved' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export const SupportFAB: React.FC = () => {
  const { themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'track'>('create');

  const crmUrl = process.env.NEXT_PUBLIC_CRM_URL || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : 'https://vault.arrowx.shop');

  // Form States for Creating Ticket
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');

  // Track & Chat States
  const [searchTicketQuery, setSearchTicketQuery] = useState('');
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-detect SSO User on Open
  useEffect(() => {
    if (!isOpen) return;

    const checkSso = async () => {
      try {
        const res = await fetch(`${crmUrl}/api/auth/me`, { credentials: 'include' });
        const data = await res.json();
        if (data.authenticated && data.user) {
          if (!customerEmail) setCustomerEmail(data.user.email || '');
          if (!customerName) setCustomerName(data.user.name || data.user.username || '');
          if (!discordHandle && data.user.discordHandle) setDiscordHandle(data.user.discordHandle);
        }
      } catch {
        // guest mode
      }
    };

    checkSso();
  }, [isOpen, crmUrl]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (activeTicket && activeTab === 'track') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTicket?.messages, activeTab]);

  // Submit New Support Ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim() || !subject.trim() || !message.trim()) return;

    setSubmitting(true);
    setCreateError('');

    try {
      const res = await fetch(`${crmUrl}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customerEmail: customerEmail.trim(),
          customerName: customerName.trim() || undefined,
          discordHandle: discordHandle.trim() || undefined,
          subject: subject.trim(),
          initialMessage: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.ticket) {
        throw new Error(data.error || 'Failed to submit ticket.');
      }

      setCreatedTicketId(data.ticket.id);
      setActiveTicket(data.ticket);
      setSearchTicketQuery(data.ticket.id);
      
      setTimeout(() => {
        setActiveTab('track');
        setCreatedTicketId(null);
        setSubject('');
        setMessage('');
      }, 1200);
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  // Track Ticket by ID or Email
  const handleTrackTicket = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTicketQuery.trim();
    if (!query) return;

    setTrackingLoading(true);
    setTrackError('');

    try {
      const isEmail = query.includes('@');
      const param = isEmail ? `email=${encodeURIComponent(query)}` : `id=${encodeURIComponent(query)}`;
      const res = await fetch(`${crmUrl}/api/tickets?${param}`, { credentials: 'include' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ticket not found.');
      }

      if (data.ticket) {
        setActiveTicket(data.ticket);
      } else if (data.tickets && data.tickets.length > 0) {
        setActiveTicket(data.tickets[0]);
      } else {
        throw new Error('No support tickets found matching this query.');
      }
    } catch (err: any) {
      setTrackError(err.message || 'Ticket not found.');
      setActiveTicket(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  // Reply to Active Ticket
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`${crmUrl}/api/tickets/${activeTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          text: replyText.trim(),
          senderName: customerName.trim() || activeTicket.customerName || 'Customer',
        }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setActiveTicket(data.ticket);
        setReplyText('');
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  // Mark Ticket as Solved
  const handleResolveTicket = async () => {
    if (!activeTicket) return;
    try {
      const res = await fetch(`${crmUrl}/api/tickets/${activeTicket.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'Resolved' }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setActiveTicket(data.ticket);
      }
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 sm:right-6 bottom-20 md:bottom-8 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: themeConfig.buttonBg,
          borderColor: themeConfig.badgeBorder,
          boxShadow: `0 0 30px ${themeConfig.glow}`,
        }}
        aria-label="24/7 Support Desk"
      >
        <div className="flex items-center justify-center" style={{ color: themeConfig.buttonText }}>
          <MessageSquare className="h-6 w-6 stroke-[2.2]" />
        </div>
        <span 
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#060907] animate-ping"
          style={{ backgroundColor: themeConfig.accent }}
        />
      </button>

      {/* Live Support Drawer / Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full sm:max-w-lg h-[620px] max-h-[90vh] bg-[#090f0c] border rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans"
            style={{ borderColor: themeConfig.surfaceBorder }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-[#0d1612] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-xl border flex items-center justify-center"
                  style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                >
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>ArrowX Live Help Desk</span>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">24/7 Engineering & License Support</div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-[#060907] p-1 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'create'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>Open New Ticket</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'track'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                <span>Track / Live Chat</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              
              {/* VIEW 1: OPEN TICKET FORM */}
              {activeTab === 'create' && (
                <div className="space-y-4">
                  {createdTicketId ? (
                    <div className="py-16 text-center space-y-3">
                      <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-400 animate-bounce" />
                      <h4 className="text-base font-bold text-white font-display">Ticket {createdTicketId} Dispatched</h4>
                      <p className="text-xs text-zinc-400 font-mono">Redirecting to live chat thread...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateTicket} className="space-y-3 text-xs font-mono">
                      {createError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                          {createError}
                        </div>
                      )}

                      <div>
                        <label className="block text-zinc-400 mb-1">Your Delivery Email *</label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                          style={{ borderColor: themeConfig.surfaceBorder }}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-zinc-400 mb-1">Name / Nickname</label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Alex"
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                            style={{ borderColor: themeConfig.surfaceBorder }}
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-400 mb-1">Discord Tag</label>
                          <input
                            type="text"
                            value={discordHandle}
                            onChange={(e) => setDiscordHandle(e.target.value)}
                            placeholder="_alex99_"
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                            style={{ borderColor: themeConfig.surfaceBorder }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1">Inquiry Subject *</label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. HWID Reset / Key Setup Help"
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none font-sans"
                          style={{ borderColor: themeConfig.surfaceBorder }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1">Describe Your Issue *</label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Please provide details, order number, or errors..."
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none font-sans"
                          style={{ borderColor: themeConfig.surfaceBorder }}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg disabled:opacity-50 mt-2"
                        style={{ backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }}
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{submitting ? 'Dispatching Ticket...' : 'Submit Support Request'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* VIEW 2: TRACK & LIVE CHAT */}
              {activeTab === 'track' && (
                <div className="space-y-4 flex flex-col h-full justify-between">
                  
                  {/* Search Bar */}
                  <form onSubmit={handleTrackTicket} className="flex gap-2">
                    <input
                      type="text"
                      value={searchTicketQuery}
                      onChange={(e) => setSearchTicketQuery(e.target.value)}
                      placeholder="Enter Ticket ID (ARX-...) or Email..."
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                      style={{ borderColor: themeConfig.surfaceBorder }}
                    />
                    <button
                      type="submit"
                      disabled={trackingLoading || !searchTicketQuery.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      style={{ backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }}
                    >
                      {trackingLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                      <span>Find</span>
                    </button>
                  </form>

                  {trackError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                      {trackError}
                    </div>
                  )}

                  {/* Active Ticket Thread */}
                  {activeTicket ? (
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      {/* Ticket Header */}
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-white">{activeTicket.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            activeTicket.status === 'Open'
                              ? 'bg-amber-500/20 text-amber-300'
                              : activeTicket.status === 'Resolved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-sky-500/20 text-sky-300'
                          }`}>
                            {activeTicket.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{activeTicket.subject}</h4>
                        <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500 font-mono">
                          <span>{activeTicket.customerEmail}</span>
                          {activeTicket.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={handleResolveTicket}
                              className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                            >
                              ✓ Mark Solved
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1 py-1 flex-1">
                        {activeTicket.messages.map((m) => {
                          const isStaff = m.sender === 'staff';
                          return (
                            <div
                              key={m.id}
                              className={`flex ${isStaff ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
                                  isStaff
                                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tl-none'
                                    : 'font-medium rounded-tr-none'
                                }`}
                                style={
                                  !isStaff
                                    ? { backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }
                                    : undefined
                                }
                              >
                                <div className="flex items-center justify-between gap-3 text-[10px] font-mono opacity-80">
                                  <span className="font-bold">{m.senderName}</span>
                                  <span>{m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                </div>
                                <p className="font-sans whitespace-pre-wrap">{m.text}</p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Reply Input Bar */}
                      <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-white/10">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type response to staff..."
                          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                          style={{ borderColor: themeConfig.surfaceBorder }}
                        />
                        <button
                          type="submit"
                          disabled={sendingReply || !replyText.trim()}
                          className="px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
                          style={{ backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </form>

                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-2">
                      <MessageSquare className="h-8 w-8 mx-auto text-zinc-600" />
                      <p className="text-xs font-mono text-zinc-500">
                        Enter your Ticket ID or Email above to view ticket status & talk directly with support staff.
                      </p>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
};
