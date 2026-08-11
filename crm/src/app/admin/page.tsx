'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  Layers,
  MessageSquare,
  Contact,
  Users,
  User,
  DollarSign,
  Clock,
  CheckCircle2,
  Search,
  Key,
  Copy,
  Send,
  RefreshCw,
  ExternalLink,
  Plus,
  Shield,
  UserCheck,
  UserPlus,
  LogOut,
  Settings,
  ChevronRight,
  TrendingUp,
  Zap,
  Lock
} from 'lucide-react';
import { RealOrder, RealSupportTicket, AdminAccount, UserAccount } from '../../lib/types';
import { ArrowXLogo } from '../../components/ArrowXLogo';
import { ProfileModal } from '../../components/ProfileModal';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'tickets' | 'customers' | 'team'>('overview');

  // Authentication & Profile
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Live Operations Data
  const [orders, setOrders] = useState<RealOrder[]>([]);
  const [tickets, setTickets] = useState<RealSupportTicket[]>([]);
  const [customers, setCustomers] = useState<UserAccount[]>([]);
  const [team, setTeam] = useState<AdminAccount[]>([]);

  // Customer Directory
  const [searchCustomer, setSearchCustomer] = useState('');

  // Orders Page Filters
  const [searchOrder, setSearchOrder] = useState('');
  const [selectedGameFilter, setSelectedGameFilter] = useState('All');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Dispatch Modal States
  const [selectedOrder, setSelectedOrder] = useState<RealOrder | null>(null);
  const [customKey, setCustomKey] = useState('');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Tickets Page States
  const [selectedTicket, setSelectedTicket] = useState<RealSupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Team Page Modal States
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'superadmin'>('admin');
  const [addAdminError, setAddAdminError] = useState('');
  const [addAdminSuccess, setAddAdminSuccess] = useState(false);

  // 1. Authenticate on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (!res.ok || !data.authenticated || (data.user.role !== 'admin' && data.user.role !== 'superadmin')) {
          router.push('/admin/login');
          return;
        }

        setCurrentAdmin(data.user);
        fetchDashboardData();
      } catch {
        router.push('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // 2. Fetch Live Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const [ordRes, tckRes, customersRes, teamRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/tickets'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/team'),
      ]);

      const [ordData, tckData, customersData, teamData] = await Promise.all([
        ordRes.json(),
        tckRes.json(),
        customersRes.json(),
        teamRes.json(),
      ]);

      if (ordData.success && ordData.orders) setOrders(ordData.orders);
      if (tckData.success && tckData.tickets) {
        setTickets(tckData.tickets);
        if (tckData.tickets.length > 0 && !selectedTicket) {
          setSelectedTicket(tckData.tickets[0]);
        }
      }
      if (customersData.success && customersData.customers) setCustomers(customersData.customers);
      if (teamData.success && teamData.admins) setTeam(teamData.admins);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // 3. Admin Claim / Unclaim Order
  const handleToggleClaim = async (orderId: string, isClaimed: boolean) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isClaimed ? 'unclaim' : 'claim' }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      }
    } catch (err) {
      console.error('Error updating claim status:', err);
    }
  };

  // 4. Dispatch 3rd Party Key
  const handleDispatchKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !customKey.trim()) return;

    setDispatching(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: customKey.trim(),
          notes: dispatchNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? data.order : o)));
        setDispatchSuccess(true);
        setTimeout(() => {
          setDispatchSuccess(false);
          setSelectedOrder(null);
          setCustomKey('');
          setDispatchNotes('');
        }, 1200);
      }
    } catch (err) {
      console.error('Error dispatching key:', err);
    } finally {
      setDispatching(false);
    }
  };

  // 5. Send Ticket Reply
  const handleSendTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? data.ticket : t)));
        setSelectedTicket(data.ticket);
        setReplyText('');
      }
    } catch (err) {
      console.error('Error sending ticket reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  // 6. 1-Click HWID Reset Approval
  const handleApproveHwidReset = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/hwid`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? data.ticket : t)));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(data.ticket);
        }
      }
    } catch (err) {
      console.error('Error approving HWID:', err);
    }
  };

  // 7. Create New Admin (Super Admin)
  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminError('');

    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newAdminUsername.trim(),
          password: newAdminPassword.trim(),
          role: newAdminRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create admin.');
      }

      setTeam((prev) => [...prev, data.admin]);
      setAddAdminSuccess(true);
      setTimeout(() => {
        setAddAdminSuccess(false);
        setShowAddAdminModal(false);
        setNewAdminUsername('');
        setNewAdminPassword('');
      }, 1200);
    } catch (err: any) {
      setAddAdminError(err.message || 'Failed to create admin.');
    }
  };

  // 8. Admin Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleCopyOrderSpec = (ord: RealOrder) => {
    const spec = `Game: ${ord.gameName} | Tier: ${ord.planTier} | Customer: ${ord.customerEmail}`;
    navigator.clipboard.writeText(spec);
    setCopiedOrderId(ord.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs text-blue-400 space-y-3 bg-[#03060c]">
        <div className="text-center space-y-2">
          <Clock className="h-8 w-8 mx-auto animate-spin" />
          <div>Initializing Operations Desk...</div>
        </div>
      </div>
    );
  }

  // Calculated Stats
  const unclaimedOrders = orders.filter((o) => o.status === 'Pending');
  const inFulfillmentOrders = orders.filter((o) => o.status === 'Claimed');
  const completedOrders = orders.filter((o) => o.status === 'Completed');

  // Filtered Orders for Orders Page
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchOrder.toLowerCase()) ||
      ord.gameName.toLowerCase().includes(searchOrder.toLowerCase());

    const matchesGame = selectedGameFilter === 'All' || ord.gameName.toLowerCase().includes(selectedGameFilter.toLowerCase());
    return matchesSearch && matchesGame;
  });

  const gamesList = ['All', 'Valorant', 'CS2', 'Escape from Tarkov', 'Fortnite', 'Apex Legends', 'Delta Force'];

  const filteredCustomers = customers.filter((customer) => {
    const query = searchCustomer.trim().toLowerCase();
    if (!query) return true;
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.username.toLowerCase().includes(query) ||
      customer.discordHandle?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-[100dvh] flex bg-[#03060c] text-slate-100 font-sans -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      
      {/* ======================================================== */}
      {/* 1. LEFT SHRINKABLE / COLLAPSIBLE SIDEBAR NAVBAR           */}
      {/* ======================================================== */}
      <aside 
        className="sticky top-0 hidden h-screen w-[76px] flex-col justify-between overflow-hidden border-r border-white/[0.07] bg-[linear-gradient(180deg,rgba(13,17,27,0.98)_0%,rgba(7,10,17,0.99)_100%)] shadow-[18px_0_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl z-30 flex-shrink-0 md:flex"
      >
        {/* Brand */}
        <div className="border-b border-white/[0.07] px-2 py-4">
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center">
              <ArrowXLogo size={42} variant="blue" showText={false} />
            </div>
          </div>
        </div>

        {/* Navigation Items (4 Distinct Pages) */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 font-sans" aria-label="Admin navigation">
          <div className="space-y-1.5">
          
          {/* 1. Overview Page */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`group relative w-full flex items-center justify-center overflow-hidden rounded-[14px] px-2.5 py-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 cursor-pointer ${
              activeTab === 'overview'
                ? 'border border-blue-400/20 bg-[linear-gradient(90deg,rgba(59,130,246,0.18),rgba(255,255,255,0.055))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.18)]'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Overview"
            aria-current={activeTab === 'overview' ? 'page' : undefined}
          >
            {activeTab === 'overview' && <span className="absolute inset-y-2 right-0 w-0.5 rounded-l-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />}
            <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] border transition-colors ${activeTab === 'overview' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] bg-white/[0.025] text-slate-500 group-hover:text-slate-300'}`}>
              <LayoutDashboard className="h-4 w-4" strokeWidth={1.8} />
            </span>
          </button>

          {/* 2. Orders Page */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`group relative w-full flex items-center justify-center overflow-hidden rounded-[14px] px-2.5 py-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 cursor-pointer ${
              activeTab === 'orders'
                ? 'border border-blue-400/20 bg-[linear-gradient(90deg,rgba(59,130,246,0.18),rgba(255,255,255,0.055))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.18)]'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Orders"
            aria-current={activeTab === 'orders' ? 'page' : undefined}
          >
            <div className="flex items-center gap-3">
              {activeTab === 'orders' && <span className="absolute inset-y-2 right-0 w-0.5 rounded-l-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />}
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] border transition-colors ${activeTab === 'orders' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] bg-white/[0.025] text-slate-500 group-hover:text-slate-300'}`}>
                <Layers className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </div>
          </button>

          {/* 3. Tickets Page */}
          <button
            onClick={() => setActiveTab('tickets')}
            className={`group relative w-full flex items-center justify-center overflow-hidden rounded-[14px] px-2.5 py-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 cursor-pointer ${
              activeTab === 'tickets'
                ? 'border border-blue-400/20 bg-[linear-gradient(90deg,rgba(59,130,246,0.18),rgba(255,255,255,0.055))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.18)]'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Support Tickets"
            aria-current={activeTab === 'tickets' ? 'page' : undefined}
          >
            <div className="flex items-center gap-3">
              {activeTab === 'tickets' && <span className="absolute inset-y-2 right-0 w-0.5 rounded-l-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />}
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] border transition-colors ${activeTab === 'tickets' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] bg-white/[0.025] text-slate-500 group-hover:text-slate-300'}`}>
                <MessageSquare className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </div>
          </button>

          {/* 4. Customers Page */}
          <button
            onClick={() => setActiveTab('customers')}
            className={`group relative w-full flex items-center justify-center overflow-hidden rounded-[14px] px-2.5 py-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 cursor-pointer ${
              activeTab === 'customers'
                ? 'border border-blue-400/20 bg-[linear-gradient(90deg,rgba(59,130,246,0.18),rgba(255,255,255,0.055))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.18)]'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Customers"
            aria-current={activeTab === 'customers' ? 'page' : undefined}
          >
            {activeTab === 'customers' && <span className="absolute inset-y-2 right-0 w-0.5 rounded-l-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />}
            <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] border transition-colors ${activeTab === 'customers' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] bg-white/[0.025] text-slate-500 group-hover:text-slate-300'}`}>
              <Contact className="h-4 w-4" strokeWidth={1.8} />
            </span>
          </button>

          {/* 5. Team Page (Super Admin Only) */}
          {currentAdmin?.role === 'superadmin' && (
            <button
              onClick={() => setActiveTab('team')}
              className={`group relative w-full flex items-center justify-center overflow-hidden rounded-[14px] px-2.5 py-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 cursor-pointer ${
                activeTab === 'team'
                  ? 'border border-blue-400/20 bg-[linear-gradient(90deg,rgba(59,130,246,0.18),rgba(255,255,255,0.055))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.18)]'
                  : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
              }`}
              title="Team Management"
              aria-current={activeTab === 'team' ? 'page' : undefined}
            >
              <div className="flex items-center gap-3">
                {activeTab === 'team' && <span className="absolute inset-y-2 right-0 w-0.5 rounded-l-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />}
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] border transition-colors ${activeTab === 'team' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] bg-white/[0.025] text-slate-500 group-hover:text-slate-300'}`}>
                  <Users className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </div>
            </button>
          )}
          </div>
        </nav>

        {/* Bottom Left Profile & Settings Button */}
        <div className="border-t border-white/[0.07] p-3 font-sans">
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-full rounded-[14px] border border-white/[0.075] bg-white/[0.035] p-1.5 transition-colors hover:border-white/[0.13] hover:bg-white/[0.065] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 cursor-pointer flex items-center justify-center"
            title="Profile & Password Settings"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[11px] border border-blue-400/20 bg-blue-400/10 text-blue-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </div>
          </button>
        </div>

      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
        <nav
          className="mx-auto flex w-full max-w-md items-center justify-around rounded-[20px] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(18,22,32,0.96),rgba(8,11,18,0.98))] p-2 shadow-[0_-16px_50px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-2xl"
          aria-label="Mobile admin navigation"
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`relative flex h-12 min-w-12 flex-1 items-center justify-center rounded-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${activeTab === 'overview' ? 'bg-blue-400/12 text-blue-200' : 'text-slate-500 active:bg-white/[0.05]'}`}
            title="Overview"
            aria-label="Overview"
            aria-current={activeTab === 'overview' ? 'page' : undefined}
          >
            {activeTab === 'overview' && <span className="absolute inset-x-4 top-0 h-0.5 rounded-b-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.75)]" />}
            <LayoutDashboard className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`relative flex h-12 min-w-12 flex-1 items-center justify-center rounded-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${activeTab === 'orders' ? 'bg-blue-400/12 text-blue-200' : 'text-slate-500 active:bg-white/[0.05]'}`}
            title="Orders"
            aria-label="Orders"
            aria-current={activeTab === 'orders' ? 'page' : undefined}
          >
            {activeTab === 'orders' && <span className="absolute inset-x-4 top-0 h-0.5 rounded-b-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.75)]" />}
            <Layers className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`relative flex h-12 min-w-12 flex-1 items-center justify-center rounded-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${activeTab === 'tickets' ? 'bg-blue-400/12 text-blue-200' : 'text-slate-500 active:bg-white/[0.05]'}`}
            title="Support Desk"
            aria-label="Support Desk"
            aria-current={activeTab === 'tickets' ? 'page' : undefined}
          >
            {activeTab === 'tickets' && <span className="absolute inset-x-4 top-0 h-0.5 rounded-b-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.75)]" />}
            <MessageSquare className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`relative flex h-12 min-w-12 flex-1 items-center justify-center rounded-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${activeTab === 'customers' ? 'bg-blue-400/12 text-blue-200' : 'text-slate-500 active:bg-white/[0.05]'}`}
            title="Customers"
            aria-label="Customers"
            aria-current={activeTab === 'customers' ? 'page' : undefined}
          >
            {activeTab === 'customers' && <span className="absolute inset-x-4 top-0 h-0.5 rounded-b-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.75)]" />}
            <Contact className="h-5 w-5" strokeWidth={1.8} />
          </button>

          {currentAdmin?.role === 'superadmin' && (
            <button
              onClick={() => setActiveTab('team')}
              className={`relative flex h-12 min-w-12 flex-1 items-center justify-center rounded-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${activeTab === 'team' ? 'bg-blue-400/12 text-blue-200' : 'text-slate-500 active:bg-white/[0.05]'}`}
              title="Team"
              aria-label="Team"
              aria-current={activeTab === 'team' ? 'page' : undefined}
            >
              {activeTab === 'team' && <span className="absolute inset-x-4 top-0 h-0.5 rounded-b-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.75)]" />}
              <Users className="h-5 w-5" strokeWidth={1.8} />
            </button>
          )}

          <button
            onClick={() => setShowProfileModal(true)}
            className="relative flex h-12 min-w-12 flex-1 items-center justify-center rounded-[14px] text-slate-500 transition-colors active:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
            title="Profile"
            aria-label="Profile and password settings"
          >
            <User className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </nav>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT VIEW (STRICT PAGE ISOLATION)             */}
      {/* ======================================================== */}
      <main className="mx-auto min-w-0 max-w-7xl flex-1 space-y-6 overflow-y-auto p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:space-y-8 md:p-8 md:pb-8 lg:p-10">
        
        {/* ======================================================== */}
        {/* PAGE 1: OVERVIEW & STATS                                 */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Clean Header Banner */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
                System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">Overview.</span>
              </h1>
            </div>

            {/* 4 Core Financial & Fulfillment KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="p-6 rounded-3xl bg-[#060913]/90 border border-blue-500/30 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>Gross Sales Volume</span>
                  <DollarSign className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-3xl font-black font-display text-white">
                  $0.00
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#060913]/90 border border-amber-500/30 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>Pending Fulfillment</span>
                  <Clock className="h-4 w-4 text-amber-400 animate-spin" />
                </div>
                <div className="text-3xl font-black font-display text-amber-300">
                  {unclaimedOrders.length}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#060913]/90 border border-sky-500/30 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>Attended by Staff</span>
                  <UserCheck className="h-4 w-4 text-sky-400" />
                </div>
                <div className="text-3xl font-black font-display text-sky-300">
                  {inFulfillmentOrders.length}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#060913]/90 border border-emerald-500/30 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>Completed Dispatches</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black font-display text-emerald-300">
                  {completedOrders.length}
                </div>
              </div>

            </div>

            {/* Recent Transactions */}
            <div className="p-6 rounded-3xl bg-[#060913]/95 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Recent Transactions
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex flex-shrink-0 items-center gap-1 whitespace-nowrap text-xs font-mono text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 2: ORDERS PROCESSING & 3RD PARTY KANBAN             */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
                  Order <span className="text-blue-400">Management System</span>
                </h1>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400" />
                  <input
                    type="text"
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    placeholder="Search orders, SKU..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={fetchDashboardData}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  title="Refresh Stream"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Game Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {gamesList.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGameFilter(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedGameFilter === g
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : 'bg-black/50 border border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* 3-Column Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Column 1: New Orders (Unclaimed) */}
              <div className="rounded-3xl bg-[#060913]/90 border border-amber-500/25 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                    <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                      1. New Orders
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {filteredOrders.filter((o) => o.status === 'Pending').length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {filteredOrders.filter((o) => o.status === 'Pending').length === 0 ? (
                    <div className="py-14 text-center text-xs font-mono text-zinc-600 border border-dashed border-white/10 rounded-2xl">
                      Queue empty
                    </div>
                  ) : (
                    filteredOrders.filter((o) => o.status === 'Pending').map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-[#04060c] border border-amber-500/20 hover:border-amber-500/50 transition-all space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-black text-amber-400">{ord.id}</span>
                          <span className="text-zinc-500 text-[11px]">{ord.createdAt}</span>
                        </div>

                        <div>
                          <div className="text-sm font-bold font-display text-white">{ord.gameName}</div>
                          <div className="text-xs text-amber-300 font-mono font-semibold">{ord.planTier} • ${ord.amount.toFixed(2)}</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[11px] font-mono text-zinc-400 truncate">
                          Customer: <span className="text-white">{ord.customerEmail}</span>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleCopyOrderSpec(ord)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy spec for 3rd-party purchasing"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copiedOrderId === ord.id ? 'Copied' : 'Copy SKU'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleClaim(ord.id, false)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Claim</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: In Fulfillment (Claimed) */}
              <div className="rounded-3xl bg-[#060913]/90 border border-sky-500/25 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                    <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                      2. In Fulfillment
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    {filteredOrders.filter((o) => o.status === 'Claimed').length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {filteredOrders.filter((o) => o.status === 'Claimed').length === 0 ? (
                    <div className="py-14 text-center text-xs font-mono text-zinc-600 border border-dashed border-white/10 rounded-2xl">
                      No claimed orders
                    </div>
                  ) : (
                    filteredOrders.filter((o) => o.status === 'Claimed').map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-[#04060c] border border-sky-500/30 hover:border-sky-500/60 transition-all space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-black text-sky-400">{ord.id}</span>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                            <UserCheck className="h-3 w-3" />
                            <span>{ord.claimedBy || 'Staff'}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-bold font-display text-white">{ord.gameName}</div>
                          <div className="text-xs text-sky-300 font-mono font-semibold">{ord.planTier} • ${ord.amount.toFixed(2)}</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[11px] font-mono text-zinc-400 truncate">
                          Customer: <span className="text-white">{ord.customerEmail}</span>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleToggleClaim(ord.id, true)}
                            className="text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-colors cursor-pointer"
                          >
                            Release
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setCustomKey('');
                              setDispatchNotes('');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <span>Dispatch Key</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Dispatched & Delivered */}
              <div className="rounded-3xl bg-[#060913]/90 border border-emerald-500/25 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                    <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                      3. Delivered
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {filteredOrders.filter((o) => o.status === 'Completed').length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {filteredOrders.filter((o) => o.status === 'Completed').length === 0 ? (
                    <div className="py-14 text-center text-xs font-mono text-zinc-600 border border-dashed border-white/10 rounded-2xl">
                      No completed orders yet
                    </div>
                  ) : (
                    filteredOrders.filter((o) => o.status === 'Completed').map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-[#04060c] border border-emerald-500/20 space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-black text-emerald-400">{ord.id}</span>
                          <span className="text-zinc-500 text-[11px]">{ord.createdAt}</span>
                        </div>

                        <div>
                          <div className="text-sm font-bold font-display text-white">{ord.gameName}</div>
                          <div className="text-xs text-zinc-400 font-mono">{ord.planTier} • ${ord.amount.toFixed(2)}</div>
                        </div>

                        {ord.licenseKey && (
                          <div className="p-2.5 rounded-xl bg-black/70 border border-emerald-500/30 font-mono text-xs text-emerald-300 truncate">
                            Key: <strong className="text-white">{ord.licenseKey}</strong>
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <span>Dispatched by: <strong className="text-white">{ord.claimedBy || 'System'}</strong></span>
                          <span className="text-emerald-400 font-bold">Delivered</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 3: SUPPORT TICKETS & HWID DESK                      */}
        {/* ======================================================== */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
                Support <span className="text-blue-400">Desk</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Queue List */}
              <div className="lg:col-span-5 p-5 rounded-3xl bg-[#060913]/95 border border-blue-500/30 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="text-xs font-mono font-bold uppercase text-white tracking-wider">Queue</h2>
                  <span className="text-xs font-mono text-zinc-400">{tickets.length} Total</span>
                </div>

                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {tickets.length === 0 ? (
                    <div className="py-16 text-center text-xs font-mono text-zinc-600">No support tickets in queue</div>
                  ) : (
                    tickets.map((tck) => (
                      <div
                        key={tck.id}
                        onClick={() => setSelectedTicket(tck)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                          selectedTicket?.id === tck.id
                            ? 'bg-blue-600/15 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                            : 'bg-black/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-blue-400">{tck.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tck.status === 'Open' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {tck.status}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-white truncate">{tck.subject}</div>
                        <div className="text-[11px] text-zinc-400 font-mono truncate">{tck.customerEmail}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Thread Detail */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#060913]/95 border border-blue-500/30 space-y-4 shadow-xl">
                {selectedTicket ? (
                  <div className="space-y-4">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="text-xs font-mono text-blue-400 font-bold">{selectedTicket.category} • {selectedTicket.id}</div>
                        <h3 className="text-base font-bold text-white font-display">{selectedTicket.subject}</h3>
                        <div className="text-xs text-zinc-400 font-mono">Customer: {selectedTicket.customerEmail}</div>
                      </div>

                      {selectedTicket.category === 'HWID Reset' && (
                        <button
                          onClick={() => handleApproveHwidReset(selectedTicket.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve HWID</span>
                        </button>
                      )}
                    </div>

                    {/* Messages Thread */}
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {selectedTicket.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-2xl max-w-[85%] text-xs space-y-1 ${
                            m.sender === 'staff'
                              ? 'ml-auto bg-blue-600/25 border border-blue-500/40 text-blue-100'
                              : 'bg-black/60 border border-white/10 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 font-mono text-[10px] text-zinc-400">
                            <span className="font-bold text-white">{m.senderName}</span>
                            <span>{m.timestamp}</span>
                          </div>
                          <p className="leading-relaxed font-sans">{m.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input */}
                    <form onSubmit={handleSendTicketReply} className="space-y-2 pt-2 border-t border-white/10">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type response to customer..."
                        className="w-full p-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-xs font-sans focus:outline-none focus:border-blue-500"
                        required
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={sendingReply}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>{sendingReply ? 'Sending...' : 'Send Reply'}</span>
                        </button>
                      </div>
                    </form>

                  </div>
                ) : (
                  <div className="py-20 text-center text-xs font-mono text-zinc-500">
                    Select a ticket to open conversation thread
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 4: CUSTOMER DIRECTORY                               */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl font-display">
                  Customer <span className="text-blue-400">Directory</span>
                </h1>
                <p className="mt-1 text-xs text-slate-500">{customers.length} registered {customers.length === 1 ? 'customer' : 'customers'}</p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" strokeWidth={1.8} />
                <input
                  type="search"
                  value={searchCustomer}
                  onChange={(event) => setSearchCustomer(event.target.value)}
                  placeholder="Search customers"
                  aria-label="Search customers"
                  className="w-full rounded-[14px] border border-white/[0.09] bg-white/[0.035] py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/15"
                />
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-white/[0.09] bg-white/[0.02] px-6 py-16 text-center">
                <Contact className="mx-auto h-7 w-7 text-slate-700" strokeWidth={1.6} />
                <p className="mt-3 text-sm font-medium text-slate-400">
                  {customers.length === 0 ? 'No customers yet' : 'No customers match your search'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {filteredCustomers.map((customer) => (
                  <article
                    key={customer.id}
                    className="rounded-[18px] border border-white/[0.075] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[12px] border border-blue-400/15 bg-blue-400/[0.08] text-sm font-bold text-blue-200">
                        {(customer.name || customer.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-semibold text-slate-100">{customer.name}</h2>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{customer.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-3 text-xs">
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.1em] text-slate-600">Username</div>
                        <div className="mt-1 truncate font-mono text-slate-300">{customer.username}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.1em] text-slate-600">Discord</div>
                        <div className="mt-1 truncate font-mono text-slate-300">{customer.discordHandle || 'Not provided'}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 5: TEAM MANAGEMENT (SUPER ADMIN ONLY)               */}
        {/* ======================================================== */}
        {activeTab === 'team' && currentAdmin?.role === 'superadmin' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#060913]/95 border border-blue-500/30 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h1 className="text-xl font-bold font-display text-white">Staff Team & Access Control</h1>
                <p className="text-xs text-zinc-400 font-sans">Manage team members, roles, and administrative permissions.</p>
              </div>

              <button
                onClick={() => setShowAddAdminModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add New Admin</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase text-[10px]">
                    <th className="py-3 px-3">Username</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Account ID</th>
                    <th className="py-3 px-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {team.map((adm) => (
                    <tr key={adm.id} className="hover:bg-white/[0.02]">
                      <td className="py-4 px-3 font-bold text-white flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-blue-400" />
                        <span>{adm.username}</span>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          adm.role === 'superadmin' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {adm.role}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-zinc-400">{adm.id}</td>
                      <td className="py-4 px-3 text-zinc-500">{adm.createdAt ? adm.createdAt.split('T')[0] : 'Active'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 3. MODALS (DISPATCH & ADD ADMIN & PROFILE)                */}
      {/* ======================================================== */}

      {/* MODAL: DISPATCH LICENSE KEY */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#060913] border border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold font-display text-base">
                <Key className="h-5 w-5" />
                <span>Dispatch Key: {selectedOrder.id}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {dispatchSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-400 animate-bounce" />
                <h4 className="text-lg font-bold text-white font-display">License Key Dispatched</h4>
                <p className="text-xs text-zinc-400">Delivered directly to {selectedOrder.customerEmail} and updated on customer vault.</p>
              </div>
            ) : (
              <form onSubmit={handleDispatchKey} className="space-y-4 text-xs font-mono">
                
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <div className="text-zinc-400">Order: <strong className="text-white">{selectedOrder.gameName} ({selectedOrder.planTier})</strong></div>
                  <div className="text-zinc-400">Customer: <strong className="text-blue-300">{selectedOrder.customerEmail}</strong></div>
                  <div className="text-zinc-400">Payment: <strong className="text-emerald-400">${selectedOrder.amount.toFixed(2)} ({selectedOrder.paymentMethod})</strong></div>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Paste License Key (Received from 3rd Party)</label>
                  <input
                    type="text"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="e.g. AX-VAL-9912-A8F4-0019-PRO"
                    className="w-full p-3 rounded-2xl bg-black/70 border border-blue-500/40 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 text-sm font-mono tracking-wider"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Fulfillment Notes (Optional)</label>
                  <input
                    type="text"
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder="e.g. Verified on HWID node 4"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={dispatching || !customKey.trim()}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {dispatching ? 'Dispatching...' : 'Complete & Dispatch Key'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN (SUPER ADMIN) */}
      {showAddAdminModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowAddAdminModal(false)}
        >
          <div 
            className="w-full max-w-md bg-[#060913] border border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold font-display">
                <UserPlus className="h-5 w-5" />
                <span>Create Staff Admin Account</span>
              </div>
              <button 
                onClick={() => setShowAddAdminModal(false)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {addAdminSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-400 animate-bounce" />
                <h4 className="text-base font-bold text-white font-display">Admin Account Provisioned</h4>
                <p className="text-xs text-zinc-400">New credentials added to administrative accounts database.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateNewAdmin} className="space-y-3 text-xs font-mono">
                {addAdminError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {addAdminError}
                  </div>
                )}

                <div>
                  <label className="block text-zinc-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="e.g. AlexOps"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-blue-500 font-mono"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Initial Password</label>
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Access Role</label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-blue-500 cursor-pointer font-sans"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin (Full Access)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddAdminModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL: ADMIN PROFILE (USERNAME / PASSWORD / LOGOUT) */}
      {currentAdmin && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={currentAdmin}
          onUserUpdated={(updated) => setCurrentAdmin(updated)}
        />
      )}

    </div>
  );
}
