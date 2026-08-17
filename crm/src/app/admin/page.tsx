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
  Lock,
  Eye,
  AlertTriangle,
  XCircle,
  Upload,
  Check,
  CreditCard,
  Bitcoin,
  Coins,
  Trash2,
  Edit3,
  ShieldAlert
} from 'lucide-react';
import { RealOrder, RealSupportTicket, AdminAccount, UserAccount, PaymentSettings } from '../../lib/types';
import { ArrowXLogo } from '../../components/ArrowXLogo';
import { ProfileModal } from '../../components/ProfileModal';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'tickets' | 'customers' | 'team' | 'settings'>('overview');

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
  const [selectedPaymentStatusFilter, setSelectedPaymentStatusFilter] = useState('All');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Proof Modal States
  const [proofModalOrder, setProofModalOrder] = useState<RealOrder | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [copiedProofText, setCopiedProofText] = useState<string | null>(null);

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
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  // Edit Admin Modal States
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [editAdminUsername, setEditAdminUsername] = useState('');
  const [editAdminPassword, setEditAdminPassword] = useState('');
  const [editAdminRole, setEditAdminRole] = useState<'admin' | 'superadmin'>('admin');
  const [editAdminError, setEditAdminError] = useState('');
  const [editAdminSuccess, setEditAdminSuccess] = useState(false);
  const [editAdminLoading, setEditAdminLoading] = useState(false);

  // Delete Admin State
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
  const [teamActionMessage, setTeamActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    btcAddress: '',
    btcQrUrl: '',
    solAddress: '',
    solQrUrl: '',
    usdtTrc20Address: '',
    usdtTrc20QrUrl: '',
    giftCardLinks: [],
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [uploadingQr, setUploadingQr] = useState<string | null>(null);

  // 1. Authenticate on Mount (Guarded against FOUC)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (!res.ok || !data.authenticated || (data.user.role !== 'admin' && data.user.role !== 'superadmin')) {
          router.replace('/admin/login');
          return;
        }

        setCurrentAdmin(data.user);
        setAuthLoading(false);
        fetchDashboardData();
        fetchPaymentSettings();
      } catch {
        router.replace('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  // 2. Fetch Dashboard Stream
  const fetchDashboardData = async () => {
    try {
      const [ordersRes, ticketsRes, customersRes, teamRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/tickets'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/team'),
      ]);

      const [ordersData, ticketsData, customersData, teamData] = await Promise.all([
        ordersRes.json(),
        ticketsRes.json(),
        customersRes.json(),
        teamRes.json(),
      ]);

      if (ordersData.success) setOrders(ordersData.orders || []);
      if (ticketsData.success) setTickets(ticketsData.tickets || []);
      if (customersData.success) setCustomers(customersData.customers || []);
      if (teamData.success) setTeam(teamData.team || teamData.admins || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch('/api/admin/payment-settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setPaymentSettings(data.settings);
      }
    } catch (err) {
      console.error('Error fetching payment settings:', err);
    }
  };

  // 3. Verify Payment
  const handleVerifyPayment = async (orderId: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (proofModalOrder?.id === orderId) {
          setProofModalOrder(data.order);
        }
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  // 4. Reject Payment
  const handleRejectPayment = async (orderId: string) => {
    if (!rejectReasonInput.trim()) return;
    setIsRejecting(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReasonInput.trim() }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (proofModalOrder?.id === orderId) {
          setProofModalOrder(data.order);
        }
        setRejectReasonInput('');
      }
    } catch (err) {
      console.error('Error rejecting payment:', err);
    } finally {
      setIsRejecting(false);
    }
  };

  // 5. Toggle Claim / Unclaim (Only for Verified Orders)
  const handleToggleClaim = async (orderId: string, isCurrentlyClaimed: boolean) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isCurrentlyClaimed ? 'unclaim' : 'claim' }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error('Error updating claim status:', err);
    }
  };

  // 6. Dispatch License Key
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
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error('Error dispatching key:', err);
    } finally {
      setDispatching(false);
    }
  };

  // 7. Save Payment Settings
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsError('');
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentSettings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save settings.');
      }

      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      setSettingsError(err.message || 'Error saving settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  // 8. Upload QR Code
  const handleQrUpload = async (key: 'btcQrUrl' | 'solQrUrl' | 'usdtTrc20QrUrl', file: File) => {
    setUploadingQr(key);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setPaymentSettings((prev) => ({ ...prev, [key]: data.url }));
      }
    } catch (err) {
      console.error('QR upload failed:', err);
    } finally {
      setUploadingQr(null);
    }
  };

  // 9. Send Ticket Reply
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

  // 10. Team: Create Admin
  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminError('');
    setAddAdminLoading(true);

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
        setNewAdminRole('admin');
      }, 1000);
    } catch (err: any) {
      setAddAdminError(err.message || 'Failed to create admin.');
    } finally {
      setAddAdminLoading(false);
    }
  };

  // 11. Team: Open Edit Modal
  const handleOpenEditAdmin = (admin: AdminAccount) => {
    setEditingAdmin(admin);
    setEditAdminUsername(admin.username);
    setEditAdminRole(admin.role);
    setEditAdminPassword('');
    setEditAdminError('');
    setEditAdminSuccess(false);
  };

  // 12. Team: Submit Edit
  const handleSaveEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setEditAdminError('');
    setEditAdminLoading(true);

    try {
      const res = await fetch('/api/admin/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAdmin.id,
          username: editAdminUsername.trim(),
          password: editAdminPassword.trim() || undefined,
          role: editAdminRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update admin account.');
      }

      setTeam((prev) => prev.map((a) => (a.id === editingAdmin.id ? data.admin : a)));
      setEditAdminSuccess(true);
      setTimeout(() => {
        setEditAdminSuccess(false);
        setEditingAdmin(null);
      }, 1000);
    } catch (err: any) {
      setEditAdminError(err.message || 'Failed to update admin.');
    } finally {
      setEditAdminLoading(false);
    }
  };

  // 13. Team: Delete Admin
  const handleDeleteAdmin = async (admin: AdminAccount) => {
    if (admin.id === currentAdmin?.id) {
      alert('You cannot delete your own logged-in administrator account.');
      return;
    }

    if (!confirm(`Are you sure you want to permanently remove admin "${admin.username}" from Supabase?`)) {
      return;
    }

    setDeletingAdminId(admin.id);
    try {
      const res = await fetch(`/api/admin/team?id=${admin.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete admin.');
      }

      setTeam((prev) => prev.filter((a) => a.id !== admin.id));
      setTeamActionMessage({ type: 'success', text: `Admin "${admin.username}" deleted successfully from Supabase.` });
      setTimeout(() => setTeamActionMessage(null), 3500);
    } catch (err: any) {
      setTeamActionMessage({ type: 'error', text: err.message || 'Failed to delete admin.' });
      setTimeout(() => setTeamActionMessage(null), 3500);
    } finally {
      setDeletingAdminId(null);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProofText(label);
    setTimeout(() => setCopiedProofText(null), 2000);
  };

  const handleCopyOrderSpec = (ord: RealOrder) => {
    const spec = `Order: ${ord.id} | Product: ${ord.gameName} | Tier: ${ord.planTier} | Price: $${ord.amount.toFixed(2)} | Customer: ${ord.customerEmail}`;
    navigator.clipboard.writeText(spec);
    setCopiedOrderId(ord.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  if (authLoading || !currentAdmin) {
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
  const totalGrossRevenue = orders
    .filter((o) => o.paymentStatus === 'VERIFIED')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingVerificationOrders = orders.filter((o) => o.paymentStatus === 'VERIFICATION_PENDING');
  const verifiedOrders = orders.filter((o) => o.paymentStatus === 'VERIFIED');
  const unclaimedOrders = orders.filter((o) => o.paymentStatus === 'VERIFIED' && o.fulfillmentStatus === 'PENDING');
  const inFulfillmentOrders = orders.filter((o) => o.fulfillmentStatus === 'CLAIMED');
  const completedOrders = orders.filter((o) => o.fulfillmentStatus === 'DISPATCHED');

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchOrder.toLowerCase()) ||
      ord.gameName.toLowerCase().includes(searchOrder.toLowerCase());

    const matchesGame = selectedGameFilter === 'All' || ord.gameName.toLowerCase().includes(selectedGameFilter.toLowerCase());
    const matchesPayment = selectedPaymentStatusFilter === 'All' || ord.paymentStatus === selectedPaymentStatusFilter;

    return matchesSearch && matchesGame && matchesPayment;
  });

  const gamesList = ['All', 'Valorant', 'CS2', 'Escape from Tarkov', 'Fortnite', 'Apex Legends', 'ARC Raiders', 'Spoofers'];

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
    <div className="fixed inset-0 z-30 flex bg-[#03060c] text-slate-100 font-sans overflow-hidden">
      
      {/* 1. LEFT PINNED SIDEBAR NAVBAR */}
      <aside 
        className="h-full w-[76px] flex flex-col justify-between overflow-hidden border-r border-white/[0.07] bg-[linear-gradient(180deg,rgba(13,17,27,0.98)_0%,rgba(7,10,17,0.99)_100%)] shadow-[18px_0_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl z-30 flex-shrink-0 flex"
      >
        <div className="border-b border-white/[0.07] px-2 py-4">
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center">
              <ArrowXLogo size={42} variant="blue" showText={false} />
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 font-sans space-y-1.5" aria-label="Admin navigation">
          {/* Overview */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`group relative w-full flex items-center justify-center rounded-[14px] p-2.5 text-[13px] transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border border-blue-400/20 bg-blue-500/15 text-white'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Overview"
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] border ${activeTab === 'overview' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] text-slate-500 group-hover:text-slate-300'}`}>
              <LayoutDashboard className="h-4 w-4" />
            </span>
          </button>

          {/* Orders */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`group relative w-full flex items-center justify-center rounded-[14px] p-2.5 text-[13px] transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border border-blue-400/20 bg-blue-500/15 text-white'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Orders & Manual Verification"
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] border relative ${activeTab === 'orders' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] text-slate-500 group-hover:text-slate-300'}`}>
              <Layers className="h-4 w-4" />
              {pendingVerificationOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </span>
          </button>

          {/* Tickets */}
          <button
            onClick={() => setActiveTab('tickets')}
            className={`group relative w-full flex items-center justify-center rounded-[14px] p-2.5 text-[13px] transition-colors cursor-pointer ${
              activeTab === 'tickets'
                ? 'border border-blue-400/20 bg-blue-500/15 text-white'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Support Tickets"
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] border ${activeTab === 'tickets' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] text-slate-500 group-hover:text-slate-300'}`}>
              <MessageSquare className="h-4 w-4" />
            </span>
          </button>

          {/* Customers */}
          <button
            onClick={() => setActiveTab('customers')}
            className={`group relative w-full flex items-center justify-center rounded-[14px] p-2.5 text-[13px] transition-colors cursor-pointer ${
              activeTab === 'customers'
                ? 'border border-blue-400/20 bg-blue-500/15 text-white'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Customer Directory"
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] border ${activeTab === 'customers' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] text-slate-500 group-hover:text-slate-300'}`}>
              <Contact className="h-4 w-4" />
            </span>
          </button>

          {/* Payment Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`group relative w-full flex items-center justify-center rounded-[14px] p-2.5 text-[13px] transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border border-blue-400/20 bg-blue-500/15 text-white'
                : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
            }`}
            title="Payment Methods & Deposit Addresses"
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] border ${activeTab === 'settings' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] text-slate-500 group-hover:text-slate-300'}`}>
              <Settings className="h-4 w-4" />
            </span>
          </button>

          {/* Team (Super Admin) */}
          {currentAdmin?.role === 'superadmin' && (
            <button
              onClick={() => setActiveTab('team')}
              className={`group relative w-full flex items-center justify-center rounded-[14px] p-2.5 text-[13px] transition-colors cursor-pointer ${
                activeTab === 'team'
                  ? 'border border-blue-400/20 bg-blue-500/15 text-white'
                  : 'border border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
              }`}
              title="Team Management"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] border ${activeTab === 'team' ? 'border-blue-300/20 bg-blue-400/10 text-blue-200' : 'border-white/[0.06] text-slate-500 group-hover:text-slate-300'}`}>
                <Users className="h-4 w-4" />
              </span>
            </button>
          )}
        </nav>

        {/* Profile Button */}
        <div className="border-t border-white/[0.07] p-3 font-sans">
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-full rounded-[14px] border border-white/[0.075] bg-white/[0.035] p-1.5 transition-colors hover:bg-white/[0.065] cursor-pointer flex items-center justify-center"
            title="Profile & Password Settings"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-blue-400/20 bg-blue-400/10 text-blue-300">
              <User className="h-[18px] w-[18px]" />
            </div>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT STAGE */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* ======================================================== */}
        {/* PAGE 1: OVERVIEW                                         */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
                  Telemetry <span className="text-blue-400">Overview</span>
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Live metrics for manual payments, order queue, and software dispatch
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDashboardData}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh Stream</span>
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#060913]/90 border border-emerald-500/30 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>Verified Revenue</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black font-display text-emerald-400">
                  ${totalGrossRevenue.toFixed(2)}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">Manual on-chain / gift cards</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#060913]/90 border border-amber-500/30 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>Payment Verification Queue</span>
                  <Clock className="h-4 w-4 text-amber-400 animate-spin" />
                </div>
                <div className="text-3xl font-black font-display text-amber-300">
                  {pendingVerificationOrders.length}
                </div>
                <div className="text-[11px] text-amber-400 font-mono">Awaiting staff review</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#060913]/90 border border-sky-500/30 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>Ready for Fulfillment</span>
                  <UserCheck className="h-4 w-4 text-sky-400" />
                </div>
                <div className="text-3xl font-black font-display text-sky-300">
                  {unclaimedOrders.length}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">Verified & unclaimed</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#060913]/90 border border-purple-500/30 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>Completed Dispatches</span>
                  <CheckCircle2 className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black font-display text-purple-300">
                  {completedOrders.length}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">Delivered to customers</div>
              </div>
            </div>

            {/* Quick Actions / Recent Orders Preview */}
            <div className="p-6 rounded-3xl bg-[#060913]/95 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Recent Orders & Verification Requests
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center gap-1 text-xs font-mono text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <span>Open Full Orders Queue</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{ord.id}</span>
                      <span className="text-slate-400">{ord.gameName} ({ord.planTier})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.paymentStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' :
                        ord.paymentStatus === 'REJECTED' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {ord.paymentStatus === 'VERIFIED' ? 'Payment Verified' :
                         ord.paymentStatus === 'REJECTED' ? 'Payment Rejected' : 'Verification Pending'}
                      </span>
                      <span className="text-white font-bold">${ord.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 2: ORDERS PROCESSING & VERIFICATION QUEUE           */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
                  Order <span className="text-blue-400">Operations & Verification</span>
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Manual payment proof verification and 3rd-party license dispatch
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400" />
                  <input
                    type="text"
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    placeholder="Search order ID, email, game..."
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

            {/* Filter Strips */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-zinc-500 mr-1">Game:</span>
                {gamesList.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGameFilter(g)}
                    className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      selectedGameFilter === g
                        ? 'bg-blue-600 text-white font-bold shadow-md'
                        : 'bg-black/50 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 mr-1">Payment:</span>
                {['All', 'VERIFICATION_PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedPaymentStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-xl whitespace-nowrap text-[11px] transition-all cursor-pointer ${
                      selectedPaymentStatusFilter === st
                        ? 'bg-emerald-600 text-white font-bold shadow-md'
                        : 'bg-black/50 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st === 'VERIFICATION_PENDING' ? 'Pending Review' :
                     st === 'VERIFIED' ? 'Verified' :
                     st === 'REJECTED' ? 'Rejected' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Column Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Column 1: New / Unclaimed Orders */}
              <div className="rounded-3xl bg-[#060913]/90 border border-amber-500/25 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                    <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                      1. Queue & Unclaimed
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {filteredOrders.filter((o) => o.fulfillmentStatus === 'PENDING').length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {filteredOrders.filter((o) => o.fulfillmentStatus === 'PENDING').length === 0 ? (
                    <div className="py-14 text-center text-xs font-mono text-zinc-600 border border-dashed border-white/10 rounded-2xl">
                      Queue empty
                    </div>
                  ) : (
                    filteredOrders.filter((o) => o.fulfillmentStatus === 'PENDING').map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-[#04060c] border border-white/10 hover:border-white/20 transition-all space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-black text-amber-400">{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.paymentStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            ord.paymentStatus === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {ord.paymentStatus === 'VERIFIED' ? 'Verified' :
                             ord.paymentStatus === 'REJECTED' ? 'Rejected' : 'Review Pending'}
                          </span>
                        </div>

                        <div>
                          <div className="text-sm font-bold font-display text-white">{ord.gameName}</div>
                          <div className="text-xs text-zinc-300 font-mono">{ord.planTier} • ${ord.amount.toFixed(2)}</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[11px] font-mono text-zinc-400 truncate">
                          Customer: <span className="text-white">{ord.customerEmail}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setProofModalOrder(ord)}
                            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-blue-400 hover:text-blue-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-500/20"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Proof</span>
                          </button>

                          {ord.paymentStatus === 'VERIFIED' ? (
                            <button
                              onClick={() => handleToggleClaim(ord.id, false)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              <span>Claim</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setProofModalOrder(ord)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold cursor-pointer hover:bg-amber-500/20"
                            >
                              Verify First
                            </button>
                          )}
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
                    {filteredOrders.filter((o) => o.fulfillmentStatus === 'CLAIMED').length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {filteredOrders.filter((o) => o.fulfillmentStatus === 'CLAIMED').length === 0 ? (
                    <div className="py-14 text-center text-xs font-mono text-zinc-600 border border-dashed border-white/10 rounded-2xl">
                      No claimed orders
                    </div>
                  ) : (
                    filteredOrders.filter((o) => o.fulfillmentStatus === 'CLAIMED').map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-[#04060c] border border-sky-500/30 space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-black text-sky-400">{ord.id}</span>
                          <span className="text-zinc-500 text-[11px]">Staff: {ord.claimedBy || 'Assigned'}</span>
                        </div>

                        <div>
                          <div className="text-sm font-bold font-display text-white">{ord.gameName}</div>
                          <div className="text-xs text-sky-300 font-mono">{ord.planTier} • ${ord.amount.toFixed(2)}</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[11px] font-mono text-zinc-400 truncate">
                          Customer: <span className="text-white">{ord.customerEmail}</span>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleCopyOrderSpec(ord)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copiedOrderId === ord.id ? 'Copied' : 'Copy SKU'}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleClaim(ord.id, true)}
                              className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-mono transition-all cursor-pointer"
                            >
                              Release
                            </button>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <Key className="h-3.5 w-3.5" />
                              <span>Dispatch</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Delivered Orders */}
              <div className="rounded-3xl bg-[#060913]/90 border border-emerald-500/25 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                    <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                      3. Dispatched & Delivered
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {filteredOrders.filter((o) => o.fulfillmentStatus === 'DISPATCHED').length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {filteredOrders.filter((o) => o.fulfillmentStatus === 'DISPATCHED').length === 0 ? (
                    <div className="py-14 text-center text-xs font-mono text-zinc-600 border border-dashed border-white/10 rounded-2xl">
                      No dispatched orders
                    </div>
                  ) : (
                    filteredOrders.filter((o) => o.fulfillmentStatus === 'DISPATCHED').map((ord) => (
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
                          <span>By: <strong className="text-white">{ord.dispatchedBy || ord.claimedBy || 'Staff'}</strong></span>
                          <span className="text-emerald-400 font-bold">Dispatched</span>
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
        {/* PAGE 3: PAYMENT SETTINGS                                 */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
                Payment <span className="text-blue-400">Gateway Settings</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Configure public deposit addresses, QR images, and external gift card vendors
              </p>
            </div>

            <form onSubmit={handleSavePaymentSettings} className="p-6 sm:p-8 rounded-3xl bg-[#060913]/95 border border-white/10 shadow-2xl space-y-6">
              
              {settingsSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Payment settings updated successfully!</span>
                </div>
              )}

              {settingsError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{settingsError}</span>
                </div>
              )}

              {/* BTC Settings */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-display text-sm">
                  <Bitcoin className="h-5 w-5" />
                  <span>Bitcoin (BTC) Configuration</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">BTC Public Deposit Address</label>
                  <input
                    type="text"
                    value={paymentSettings.btcAddress}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, btcAddress: e.target.value })}
                    placeholder="e.g. bc1q..."
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">BTC QR Code Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={paymentSettings.btcQrUrl || ''}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, btcQrUrl: e.target.value })}
                      placeholder="/uploads/qr/btc-qr.png"
                      className="flex-1 p-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingQr === 'btcQrUrl' ? 'Uploading...' : 'Upload QR'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => e.target.files?.[0] && handleQrUpload('btcQrUrl', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SOL Settings */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold font-display text-sm">
                  <Coins className="h-5 w-5" />
                  <span>Solana (SOL) Configuration</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">SOL Public Deposit Address</label>
                  <input
                    type="text"
                    value={paymentSettings.solAddress}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, solAddress: e.target.value })}
                    placeholder="e.g. L..."
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">SOL QR Code Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={paymentSettings.solQrUrl || ''}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, solQrUrl: e.target.value })}
                      placeholder="/uploads/qr/ltc-qr.png"
                      className="flex-1 p-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingQr === 'solQrUrl' ? 'Uploading...' : 'Upload QR'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => e.target.files?.[0] && handleQrUpload('solQrUrl', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* USDT TRC20 Settings */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-display text-sm">
                  <Coins className="h-5 w-5" />
                  <span>USDT (TRC-20) Configuration</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">USDT TRC-20 Deposit Address</label>
                  <input
                    type="text"
                    value={paymentSettings.usdtTrc20Address}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, usdtTrc20Address: e.target.value })}
                    placeholder="e.g. T..."
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">USDT QR Code Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={paymentSettings.usdtTrc20QrUrl || ''}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, usdtTrc20QrUrl: e.target.value })}
                      placeholder="/uploads/qr/usdt-qr.png"
                      className="flex-1 p-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingQr === 'usdtTrc20QrUrl' ? 'Uploading...' : 'Upload QR'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => e.target.files?.[0] && handleQrUpload('usdtTrc20QrUrl', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Gift Card Settings */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold font-display text-sm">
                  <CreditCard className="h-5 w-5" />
                  <span>Approved G2A / Rewarble Gift Cards</span>
                </div>

                <p className="text-[11px] leading-relaxed text-zinc-400">
                  Add only verified purchase pages. Checkout rounds each order up to a whole-dollar value and enables gift-card payment only when that exact denomination is configured.
                </p>

                <div className="space-y-3">
                  {paymentSettings.giftCardLinks.map((link, index) => (
                    <div key={`${link.denominationUsd}-${index}`} className="grid gap-2 sm:grid-cols-[120px_1fr_auto]">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">$</span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          aria-label={`Gift-card denomination ${index + 1}`}
                          value={link.denominationUsd || ''}
                          onChange={(e) => {
                            const giftCardLinks = paymentSettings.giftCardLinks.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, denominationUsd: Number(e.target.value) } : item,
                            );
                            setPaymentSettings({ ...paymentSettings, giftCardLinks });
                          }}
                          placeholder="35"
                          className="w-full rounded-xl border border-white/10 bg-black/60 py-3 pl-7 pr-3 font-mono text-xs text-white focus:border-purple-500 focus:outline-none"
                          required
                        />
                      </div>
                      <input
                        type="url"
                        aria-label={`Gift-card purchase URL ${index + 1}`}
                        value={link.purchaseUrl}
                        onChange={(e) => {
                          const giftCardLinks = paymentSettings.giftCardLinks.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, purchaseUrl: e.target.value } : item,
                          );
                          setPaymentSettings({ ...paymentSettings, giftCardLinks });
                        }}
                        placeholder="https://www.g2a.com/..."
                        className="w-full rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs text-white focus:border-purple-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        aria-label={`Remove gift-card link ${index + 1}`}
                        onClick={() => setPaymentSettings({
                          ...paymentSettings,
                          giftCardLinks: paymentSettings.giftCardLinks.filter((_, itemIndex) => itemIndex !== index),
                        })}
                        className="inline-flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 text-rose-400 transition-colors hover:bg-rose-500/20"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {paymentSettings.giftCardLinks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/10 bg-black/30 p-4 text-center font-mono text-[11px] text-zinc-500">
                      No approved denominations. Gift-card checkout is safely disabled.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setPaymentSettings({
                      ...paymentSettings,
                      giftCardLinks: [...paymentSettings.giftCardLinks, { denominationUsd: 0, purchaseUrl: '' }],
                    })}
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 font-mono text-xs font-bold text-purple-300 transition-colors hover:bg-purple-500/20"
                  >
                    <Plus className="h-4 w-4" />
                    Add Approved Denomination
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {settingsSaving ? 'Saving Changes...' : 'Save Payment Gateway Settings'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 4: SUPPORT TICKETS & HWID DESK                      */}
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="text-xs font-mono text-blue-400 font-bold">{selectedTicket.id}</div>
                        <h3 className="text-base font-bold text-white font-display">{selectedTicket.subject}</h3>
                        <div className="text-xs text-zinc-400 font-mono">Customer: {selectedTicket.customerEmail}</div>
                      </div>

                    </div>

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
        {/* PAGE 5: CUSTOMER DIRECTORY                               */}
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
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  placeholder="Search by name, email, discord..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-[#060913]/95 border border-white/10 shadow-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {filteredCustomers.map((cust) => (
                  <div key={cust.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div>
                      <div className="font-bold text-white text-sm">{cust.name}</div>
                      <div className="text-slate-400">{cust.email}</div>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-500">
                      {cust.discordHandle && <span>Discord: <strong className="text-slate-300">{cust.discordHandle}</strong></span>}
                      <span>Joined {new Date(cust.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 6: TEAM MANAGEMENT (SUPER ADMIN)                    */}
        {/* ======================================================== */}
        {activeTab === 'team' && currentAdmin?.role === 'superadmin' && (
          <div className="space-y-6 animate-fade-in font-sans">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
                    Staff <span className="text-blue-400">Team</span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SUPABASE LIVE DB
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Manage administrative accounts, role privileges, and credentials
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={fetchDashboardData}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                  title="Reload from Supabase"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setNewAdminUsername('');
                    setNewAdminPassword('');
                    setNewAdminRole('admin');
                    setAddAdminError('');
                    setAddAdminSuccess(false);
                    setShowAddAdminModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Admin</span>
                </button>
              </div>
            </div>

            {/* Action Alert Banner */}
            {teamActionMessage && (
              <div className={`p-4 rounded-2xl border text-xs font-mono flex items-center gap-3 transition-all ${
                teamActionMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {teamActionMessage.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                )}
                <span>{teamActionMessage.text}</span>
              </div>
            )}

            {/* Team Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map((adm) => {
                const isCurrent = adm.id === currentAdmin?.id || adm.username.toLowerCase() === currentAdmin?.username?.toLowerCase();
                const isSuper = adm.role === 'superadmin';

                return (
                  <div 
                    key={adm.id}
                    className={`rounded-3xl p-5 sm:p-6 transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-4 border ${
                      isCurrent
                        ? 'bg-[#0a0f1c]/95 border-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30'
                        : 'bg-[#060913]/90 border-white/10 hover:border-white/20 shadow-xl'
                    }`}
                  >
                    {/* Background accent glow */}
                    <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-[60px] pointer-events-none opacity-20 ${
                      isSuper ? 'bg-blue-500' : 'bg-emerald-500'
                    }`} />

                    <div className="space-y-3.5 relative z-10">
                      {/* Top row: Avatar & Role Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner ${
                            isSuper 
                              ? 'bg-blue-500/15 border-blue-500/40 text-blue-400' 
                              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          }`}>
                            <Shield className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white font-display text-base tracking-wide">
                                {adm.username}
                              </h3>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-zinc-500 font-mono">ID: {adm.id.substring(0, 14)}...</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm ${
                          isSuper 
                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                            : 'bg-zinc-800/80 text-zinc-300 border-zinc-700'
                        }`}>
                          {isSuper ? 'SUPER ADMIN' : 'ADMIN'}
                        </span>
                      </div>

                      {/* Info Pills */}
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between text-zinc-400">
                          <span className="text-zinc-500">Security:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span>bcrypt (AES-256)</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-400">
                          <span className="text-zinc-500">Date Added:</span>
                          <span className="text-zinc-300">
                            {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Initial Seed'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2 text-xs font-mono relative z-10">
                      <button
                        type="button"
                        onClick={() => handleOpenEditAdmin(adm)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-blue-500/15 border border-white/10 hover:border-blue-500/30 text-zinc-300 hover:text-blue-300 font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={isCurrent || deletingAdminId === adm.id}
                        onClick={() => handleDeleteAdmin(adm)}
                        className={`px-3 py-1.5 rounded-xl border font-medium transition-all flex items-center gap-1.5 shadow-sm ${
                          isCurrent
                            ? 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 hover:border-rose-500/40 text-rose-300 hover:text-rose-200 cursor-pointer'
                        }`}
                        title={isCurrent ? 'You cannot delete your own logged-in account' : 'Remove from Supabase'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{deletingAdminId === adm.id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* MODAL 1: INSPECT PAYMENT PROOF & VERIFY / REJECT         */}
      {/* ======================================================== */}
      {proofModalOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setProofModalOrder(null)}
        >
          <div 
            className="w-full max-w-xl bg-[#060913] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  Order Verification Review • {proofModalOrder.id}
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  {proofModalOrder.gameName} ({proofModalOrder.planTier})
                </h3>
              </div>
              <button 
                onClick={() => setProofModalOrder(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer p-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Order Details Grid */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-zinc-500">Customer:</span>
                <div className="text-white font-semibold truncate">{proofModalOrder.customerEmail}</div>
              </div>
              <div>
                <span className="text-zinc-500">Amount Due:</span>
                <div className="text-emerald-400 font-black text-sm">${proofModalOrder.amount.toFixed(2)} USD</div>
              </div>
              <div>
                <span className="text-zinc-500">Method:</span>
                <div className="text-white font-bold">{proofModalOrder.paymentMethod}</div>
              </div>
              <div>
                <span className="text-zinc-500">Payment Status:</span>
                <div className={`font-bold ${
                  proofModalOrder.paymentStatus === 'VERIFIED' ? 'text-emerald-400' :
                  proofModalOrder.paymentStatus === 'REJECTED' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {proofModalOrder.paymentStatus}
                </div>
              </div>
            </div>

            {/* Payment Proof Details Box */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center justify-between">
                <span>Submitted Payment Proof</span>
                {proofModalOrder.verifiedBy && (
                  <span className="text-[10px] text-zinc-500 font-normal">
                    Reviewed by {proofModalOrder.verifiedBy} at {proofModalOrder.verifiedAt}
                  </span>
                )}
              </div>

              {/* Transaction Hash */}
              {proofModalOrder.proof?.txHash && (
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-zinc-500">On-Chain Tx Hash / ID:</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/80 border border-white/10">
                    <span className="flex-1 font-mono text-xs text-emerald-400 break-all select-all">
                      {proofModalOrder.proof.txHash}
                    </span>
                    <button
                      onClick={() => handleCopyText(proofModalOrder.proof?.txHash || '', 'tx')}
                      className="px-2 py-1 rounded bg-white/10 text-white text-[10px] font-mono hover:bg-white/20 cursor-pointer flex-shrink-0"
                    >
                      {copiedProofText === 'tx' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Gift Card Code */}
              {proofModalOrder.proof?.giftCardCode && (
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-zinc-500">Gift Card Voucher Code:</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/80 border border-purple-500/30">
                    <span className="flex-1 font-mono text-xs text-purple-300 font-bold break-all select-all">
                      {proofModalOrder.proof.giftCardCode}
                    </span>
                    <button
                      onClick={() => handleCopyText(proofModalOrder.proof?.giftCardCode || '', 'gc')}
                      className="px-2 py-1 rounded bg-purple-500/20 text-purple-200 text-[10px] font-mono hover:bg-purple-500/30 cursor-pointer flex-shrink-0"
                    >
                      {copiedProofText === 'gc' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Screenshot Image Preview */}
              {proofModalOrder.proof?.screenshotUrl ? (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-zinc-500">Receipt Screenshot:</div>
                  <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-48 bg-black flex items-center justify-center">
                    <img 
                      src={proofModalOrder.proof.screenshotUrl} 
                      alt="Payment Receipt Screenshot" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <a
                    href={proofModalOrder.proof.screenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300"
                  >
                    <span>Open full image in new tab</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : null}

              {!proofModalOrder.proof?.txHash && !proofModalOrder.proof?.screenshotUrl && !proofModalOrder.proof?.giftCardCode && (
                <div className="py-4 text-center text-xs font-mono text-zinc-500">
                  No proof attachment provided with this legacy order.
                </div>
              )}
            </div>

            {/* Rejection reason display if rejected */}
            {proofModalOrder.rejectionReason && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono space-y-1">
                <div className="font-bold">Rejection Reason:</div>
                <div>{proofModalOrder.rejectionReason}</div>
              </div>
            )}

            {/* Actions: Verify / Reject */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleVerifyPayment(proofModalOrder.id)}
                  disabled={isVerifying || proofModalOrder.paymentStatus === 'VERIFIED'}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isVerifying ? 'Verifying...' : proofModalOrder.paymentStatus === 'VERIFIED' ? 'Payment Already Verified' : 'Approve & Mark Verified'}</span>
                </button>
              </div>

              {/* Rejection input and trigger */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <input
                  type="text"
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                  placeholder="Reason for rejection (e.g. Unconfirmed TxID / Invalid voucher)"
                  className="w-full p-2.5 rounded-xl bg-black/80 border border-white/10 text-white placeholder-zinc-600 text-xs font-mono focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => handleRejectPayment(proofModalOrder.id)}
                  disabled={isRejecting || !rejectReasonInput.trim()}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject Payment with Reason</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DISPATCH LICENSE KEY                            */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#060913] border border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-xs font-mono text-blue-400 font-bold">Fulfillment • {selectedOrder.id}</div>
                <h3 className="text-lg font-bold text-white font-display">Dispatch License Key</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {dispatchSuccess ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-400 animate-bounce" />
                <h4 className="text-lg font-bold text-white font-display">Dispatched Successfully</h4>
                <p className="text-xs text-zinc-400">License key has been recorded and customer dashboard updated.</p>
              </div>
            ) : (
              <form onSubmit={handleDispatchKey} className="space-y-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <div className="text-slate-400">Product: <strong className="text-white">{selectedOrder.gameName}</strong></div>
                  <div className="text-slate-400">Tier: <strong className="text-white">{selectedOrder.planTier}</strong></div>
                  <div className="text-slate-400">Customer: <strong className="text-white">{selectedOrder.customerEmail}</strong></div>
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-300 font-bold">Paste License Key (from provider):</label>
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

                <div className="space-y-1">
                  <label className="block text-zinc-400">Fulfillment Notes (Optional):</label>
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

      {/* ======================================================== */}
      {/* MODAL 3: ADD ADMIN (SUPER ADMIN ONLY)                    */}
      {/* ======================================================== */}
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
                ✕ Close
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
                    disabled={addAdminLoading}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg cursor-pointer"
                  >
                    {addAdminLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: EDIT ADMIN CREDENTIALS & ROLE                   */}
      {/* ======================================================== */}
      {editingAdmin && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans"
          onClick={() => setEditingAdmin(null)}
        >
          <div 
            className="w-full max-w-md bg-[#060913] border border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backdrop glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[90px] pointer-events-none opacity-20 bg-blue-500" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold font-display">
                <Edit3 className="h-5 w-5" />
                <span>Edit Staff Account</span>
              </div>
              <button 
                onClick={() => setEditingAdmin(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer p-1"
              >
                ✕ Close
              </button>
            </div>

            {editAdminSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-400 animate-bounce" />
                <h4 className="text-base font-bold text-white font-display">Staff Account Updated</h4>
                <p className="text-xs text-zinc-400 font-mono">Changes synchronized live with Supabase PostgreSQL.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEditAdmin} className="space-y-4 text-xs font-mono">
                {editAdminError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {editAdminError}
                  </div>
                )}

                <div>
                  <label className="block text-zinc-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={editAdminUsername}
                    onChange={(e) => setEditAdminUsername(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Access Role</label>
                  <select
                    value={editAdminRole}
                    onChange={(e) => setEditAdminRole(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-blue-500 cursor-pointer font-sans"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Reset Password (Optional)</label>
                  <input
                    type="password"
                    value={editAdminPassword}
                    onChange={(e) => setEditAdminPassword(e.target.value)}
                    placeholder="Leave blank to keep existing password"
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                    Entering a new password will re-hash with bcrypt and update Supabase immediately.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingAdmin(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editAdminLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    {editAdminLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: ADMIN PROFILE */}
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
