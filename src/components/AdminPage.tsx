import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Lock,
  User,
  Key,
  LogOut,
  Database,
  Terminal,
  Layers,
  CheckCircle,
  XCircle,
  Truck,
  Trash2,
  Edit,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
  Package
} from 'lucide-react';
import { Requisition, RationItem, AdminStats, AdminUser, SqlQueryResult, SqlSchemaInfo } from '../types.ts';

interface AdminPageProps {
  onNavigateHome: () => void;
  adminUser: AdminUser | null;
  onLogin: (user: AdminUser, token: string) => void;
  onLogout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onNavigateHome,
  adminUser,
  onLogin,
  onLogout,
}) => {
  // Login form state
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('admin');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'requisitions' | 'sql' | 'inventory' | 'logs'>('requisitions');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [inventory, setInventory] = useState<RationItem[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Editing requisition note modal/state
  const [selectedReqForNote, setSelectedReqForNote] = useState<Requisition | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM requisitions ORDER BY id DESC;');
  const [sqlResult, setSqlResult] = useState<SqlQueryResult | null>(null);
  const [sqlError, setSqlError] = useState<string>('');
  const [isExecutingSql, setIsExecutingSql] = useState<boolean>(false);
  const [sqlSchema, setSqlSchema] = useState<SqlSchemaInfo | null>(null);

  // Fetch admin stats & requisitions when logged in
  const fetchAdminData = async () => {
    setIsLoadingData(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mann_co_auth_token_secret_1968',
      };

      const [statsRes, reqRes, invRes, schemaRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/forum'),
        fetch('/api/inventory'),
        fetch('/api/admin/sql-schema', { headers }),
        fetch('/api/admin/logs', { headers }),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (reqRes.ok) {
        const d = await reqRes.json();
        setRequisitions(d.posts || []);
      }
      if (invRes.ok) {
        const d = await invRes.json();
        setInventory(d.items || []);
      }
      if (schemaRes.ok) {
        const d = await schemaRes.json();
        setSqlSchema(d.schema);
      }
      if (logsRes.ok) {
        const d = await logsRes.json();
        setLogs(d.logs || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchAdminData();
    }
  }, [adminUser]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login yoki parol noto\'g\'ri');
      }

      onLogin(data.adminUser, data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Quick helper to fill admin/admin
  const handleAutofill = () => {
    setUsernameInput('admin');
    setPasswordInput('admin');
  };

  // Update requisition status
  const handleUpdateStatus = async (id: number, status: string, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/requisitions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mann_co_auth_token_secret_1968',
        },
        body: JSON.stringify({
          status,
          admin_notes: notes !== undefined ? notes : undefined,
        }),
      });

      if (res.ok) {
        setActionSuccess(`Requisition #${id} holati '${status}' ga o'zgartirildi (SQL yangilandi)`);
        fetchAdminData();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  // Delete requisition from SQL
  const handleDeleteRequisition = async (id: number) => {
    if (!window.confirm(`Haqiqatan ham #${id} buyurtmani SQL bazasidan o'chirmoqchimisiz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/requisitions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer mann_co_auth_token_secret_1968',
        },
      });

      if (res.ok) {
        setActionSuccess(`Requisition #${id} SQL bazasidan butunlay o'chirildi.`);
        fetchAdminData();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Update inventory stock in SQL
  const handleUpdateStock = async (id: number, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mann_co_auth_token_secret_1968',
        },
        body: JSON.stringify({ stock_units: newStock }),
      });

      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Stock update error:', err);
    }
  };

  // Execute raw SQL query
  const handleExecuteSql = async (overrideQuery?: string) => {
    const queryToRun = overrideQuery || sqlQuery;
    if (!queryToRun.trim()) return;

    setIsExecutingSql(true);
    setSqlError('');
    setSqlResult(null);

    try {
      const res = await fetch('/api/admin/sql-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mann_co_auth_token_secret_1968',
        },
        body: JSON.stringify({ query: queryToRun }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'SQL sintaksis xatosi');
      }

      setSqlResult(data.result);
      // If query was an INSERT/UPDATE/DELETE, refresh data
      if (data.result.type === 'EXECUTE') {
        fetchAdminData();
      }
    } catch (err: any) {
      setSqlError(err.message || 'SQL ijro etishda xatolik');
    } finally {
      setIsExecutingSql(false);
    }
  };

  // If NOT logged in, show the Login Gate
  if (!adminUser) {
    return (
      <div className="min-h-[85vh] py-12 px-4 flex items-center justify-center bg-[#E1D5B8]">
        <div className="w-full max-w-md bg-[#EFE7D3] border-3 border-[#2B2625] shadow-ink-xl p-6 sm:p-8 relative">
          <div className="h-1.5 hazard-stripes w-full mb-6" />

          {/* Header */}
          <div className="text-center space-y-2 mb-6 border-b-2 border-[#2B2625] pb-4">
            <div className="w-14 h-14 mx-auto bg-[#B8383B] border-2 border-[#2B2625] text-[#EFE7D3] flex items-center justify-center shadow-ink-sm chamfer-tr">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h1 className="font-anton text-3xl uppercase tracking-wider text-[#2B2625]">
              CLASSIFIED ADMIN GATE
            </h1>
            <p className="font-mono-code text-xs text-[#584140] uppercase">
              MANN CO. SECURE QUARTERMASTER TERMINAL (/admin)
            </p>
          </div>

          {/* Credentials Requirement Hint from prompt */}
          <div className="p-3 bg-[#E1D5B8] border-2 border-[#2B2625] shadow-ink-sm mb-6 font-mono-code text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[#B8383B] uppercase">KIRISH REKVIZITLARI:</span>
              <button
                type="button"
                onClick={handleAutofill}
                className="text-[10px] bg-[#E5A823] hover:bg-[#ffe1b0] px-2 py-0.5 border border-[#2B2625] font-bold text-[#2B2625] transition-colors"
              >
                Auto-fill
              </button>
            </div>
            <div className="space-y-0.5 text-[#2B2625]">
              <div>Login: <strong className="bg-[#EFE7D3] px-1 border border-[#2B2625]">admin</strong></div>
              <div>Parol: <strong className="bg-[#EFE7D3] px-1 border border-[#2B2625]">admin</strong></div>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-4 p-3 bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#93000a] font-mono-code text-xs">
              <strong>Xatolik: </strong> {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1">
                Admin Username (Login)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#584140] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2 bg-[#E1D5B8] focus:bg-[#fff8f6] border-2 border-[#2B2625] font-mono-code text-sm text-[#2B2625] focus:outline-none focus:border-[#E5A823] shadow-ink-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1">
                Admin Password (Parol)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#584140] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2 bg-[#E1D5B8] focus:bg-[#fff8f6] border-2 border-[#2B2625] font-mono-code text-sm text-[#2B2625] focus:outline-none focus:border-[#E5A823] shadow-ink-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#B8383B] hover:bg-[#7C2528] disabled:bg-[#8c716f] text-[#EFE7D3] font-anton text-lg uppercase tracking-wider border-3 border-[#2B2625] shadow-ink btn-press transition-all chamfer-tr mt-2 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Kirish (Login)</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-[#2B2625] text-center">
            <button
              onClick={onNavigateHome}
              className="font-mono-code text-xs font-bold text-[#584140] hover:text-[#B8383B] underline"
            >
              ← Bosh sahifaga qaytish (Public Mess Hall)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#EFE7D3] pb-16">
      {/* Admin Top Command Header */}
      <div className="bg-[#2B2625] text-[#EFE7D3] border-b-3 border-[#2B2625] shadow-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#B8383B] border border-[#EFE7D3] text-[#EFE7D3]">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <div className="font-anton text-2xl uppercase tracking-wider text-[#EFE7D3]">
                  MANN CO. ADMINISTRATIVE QUARTERMASTER COMMAND
                </div>
                <div className="font-mono-code text-xs text-[#E5A823]">
                  CLEARANCE LEVEL 5 · USER: <span className="underline font-bold">{adminUser.username}</span> · {adminUser.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateHome}
                className="px-3.5 py-1.5 bg-[#5885A2] hover:bg-[#2B3D4F] text-[#EFE7D3] font-anton text-xs uppercase tracking-wider border-2 border-[#EFE7D3] shadow-ink-sm flex items-center gap-1.5 btn-press transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Mess Hall</span>
              </button>

              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-[#B8383B] hover:bg-[#7C2528] text-[#EFE7D3] font-anton text-xs uppercase tracking-wider border-2 border-[#EFE7D3] shadow-ink-sm flex items-center gap-1.5 btn-press transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Tizimdan chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="p-3 bg-[#d8f3dc] border-2 border-[#2d6a4f] text-[#1b4332] font-mono-code text-xs font-bold shadow-ink-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#2d6a4f]" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Statistical Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#E1D5B8] border-3 border-[#2B2625] p-4 shadow-ink">
            <div className="font-mono-code text-[11px] font-bold uppercase text-[#584140]">
              Jami Requisitions (SQL)
            </div>
            <div className="font-anton text-3xl sm:text-4xl text-[#2B2625] mt-1">
              {stats?.totalRequisitions ?? requisitions.length}
            </div>
            <div className="font-mono-code text-[10px] text-[#B8383B] font-bold mt-1">
              TABLE: requisitions
            </div>
          </div>

          <div className="bg-[#E1D5B8] border-3 border-[#2B2625] p-4 shadow-ink">
            <div className="font-mono-code text-[11px] font-bold uppercase text-[#584140]">
              Pending (Kutilayotgan)
            </div>
            <div className="font-anton text-3xl sm:text-4xl text-[#E5A823] mt-1">
              {stats?.pendingCount ?? requisitions.filter(r => r.status === 'PENDING').length}
            </div>
            <div className="font-mono-code text-[10px] text-[#584140] font-bold mt-1">
              Awaiting Approval
            </div>
          </div>

          <div className="bg-[#E1D5B8] border-3 border-[#2B2625] p-4 shadow-ink">
            <div className="font-mono-code text-[11px] font-bold uppercase text-[#584140]">
              Dispatched (Yuborilgan)
            </div>
            <div className="font-anton text-3xl sm:text-4xl text-[#35637f] mt-1">
              {stats?.dispatchedCount ?? requisitions.filter(r => r.status === 'DISPATCHED').length}
            </div>
            <div className="font-mono-code text-[10px] text-[#2d6a4f] font-bold mt-1">
              En Route to Combat
            </div>
          </div>

          <div className="bg-[#E1D5B8] border-3 border-[#2B2625] p-4 shadow-ink">
            <div className="font-mono-code text-[11px] font-bold uppercase text-[#584140]">
              Ombordagi Zaxira (SQL)
            </div>
            <div className="font-anton text-3xl sm:text-4xl text-[#B8383B] mt-1">
              {stats?.inventoryTotal ?? 1614}
            </div>
            <div className="font-mono-code text-[10px] text-[#584140] font-bold mt-1">
              TABLE: ration_inventory
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b-3 border-[#2B2625] pb-2 font-anton text-sm uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('requisitions')}
            className={`px-4 py-2 border-2 border-[#2B2625] shadow-ink-sm transition-all btn-press ${
              activeTab === 'requisitions'
                ? 'bg-[#B8383B] text-[#EFE7D3]'
                : 'bg-[#E1D5B8] text-[#2B2625] hover:bg-[#D1C2A5]'
            }`}
          >
            1. User Requisitions (Forum & SQL Ledger)
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 border-2 border-[#2B2625] shadow-ink-sm transition-all btn-press flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-[#2B2625] text-[#E5A823]'
                : 'bg-[#E1D5B8] text-[#2B2625] hover:bg-[#D1C2A5]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Live SQL Console & Query Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 border-2 border-[#2B2625] shadow-ink-sm transition-all btn-press ${
              activeTab === 'inventory'
                ? 'bg-[#5885A2] text-[#EFE7D3]'
                : 'bg-[#E1D5B8] text-[#2B2625] hover:bg-[#D1C2A5]'
            }`}
          >
            3. Ration Stockpile (Omborxona)
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 border-2 border-[#2B2625] shadow-ink-sm transition-all btn-press ${
              activeTab === 'logs'
                ? 'bg-[#2B2625] text-[#EFE7D3]'
                : 'bg-[#E1D5B8] text-[#2B2625] hover:bg-[#D1C2A5]'
            }`}
          >
            4. Audit Logs (SQL Jurnali)
          </button>
        </div>

        {/* TAB 1: USER REQUISITIONS & FORUM TABLE */}
        {activeTab === 'requisitions' && (
          <div className="bg-[#E1D5B8] border-3 border-[#2B2625] shadow-ink p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2B2625] pb-3">
              <div>
                <h2 className="font-anton text-2xl uppercase tracking-wide text-[#2B2625]">
                  FOYDALANUVCHILAR REQUISITION BUYURTMALARI (SQL JADVALI)
                </h2>
                <p className="font-mono-code text-xs text-[#584140]">
                  User to'ldirgan barcha form ma'lumotlari SQL <code className="font-bold bg-[#EFE7D3] px-1 border border-[#2B2625]">requisitions</code> jadvalida saqlangan.
                </p>
              </div>

              <button
                onClick={fetchAdminData}
                className="px-3 py-1.5 bg-[#EFE7D3] hover:bg-[#fff8f6] border-2 border-[#2B2625] font-mono-code text-xs font-bold text-[#2B2625] shadow-ink-sm flex items-center gap-1.5 btn-press"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yangilash (Refresh)</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border-2 border-[#2B2625] shadow-ink-sm bg-[#EFE7D3]">
              <table className="w-full text-left font-mono-code text-xs">
                <thead className="bg-[#2B2625] text-[#EFE7D3] border-b-2 border-[#2B2625]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Jangchi (User)</th>
                    <th className="p-3">Sinf & Faction</th>
                    <th className="p-3">Buyurtma (Ration)</th>
                    <th className="p-3">Sektor</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Xabar (Forum Message)</th>
                    <th className="p-3">Holat (Status)</th>
                    <th className="p-3 text-right">Amallar (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B2625]/20">
                  {requisitions.map((req) => (
                    <tr key={req.id} className="hover:bg-[#fff8f6] transition-colors">
                      <td className="p-3 font-bold text-[#B8383B]">#{req.id}</td>
                      <td className="p-3 font-bold text-[#2B2625]">
                        {req.mercenary_name}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 border text-[10px] font-bold ${
                            req.faction === 'RED'
                              ? 'bg-[#B8383B] text-[#EFE7D3] border-[#7C2528]'
                              : 'bg-[#5885A2] text-[#EFE7D3] border-[#2B3D4F]'
                          }`}
                        >
                          {req.faction}
                        </span>
                        <div className="text-[10px] text-[#584140] mt-0.5">{req.mercenary_class}</div>
                      </td>
                      <td className="p-3">
                        <strong className="text-[#2B2625]">{req.ration_quantity}×</strong> {req.ration_item}
                      </td>
                      <td className="p-3 text-[#584140]">{req.frontline_sector}</td>
                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 border text-[10px] font-bold ${
                            req.priority === 'DEFCON 1'
                              ? 'bg-[#B8383B] text-[#EFE7D3]'
                              : req.priority === 'URGENT'
                              ? 'bg-[#E5A823] text-[#2B2625]'
                              : 'bg-[#E1D5B8] text-[#2B2625]'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate" title={req.message}>
                        "{req.message}"
                        {req.admin_notes && (
                          <div className="text-[10px] text-[#674800] mt-0.5 font-bold">
                            Izoh: {req.admin_notes}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 border text-[10px] font-bold uppercase ${
                            req.status === 'APPROVED'
                              ? 'bg-[#2d6a4f] text-[#EFE7D3]'
                              : req.status === 'DISPATCHED'
                              ? 'bg-[#5885A2] text-[#EFE7D3]'
                              : req.status === 'DENIED'
                              ? 'bg-[#ba1a1a] text-[#EFE7D3]'
                              : 'bg-[#E5A823] text-[#2B2625]'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                              title="Tasdiqlash (Approve)"
                              className="p-1 bg-[#2d6a4f] hover:bg-[#1b4332] text-white border border-[#2B2625] shadow-ink-sm btn-press"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {req.status !== 'DISPATCHED' && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'DISPATCHED')}
                              title="Yuborish (Dispatch to frontline)"
                              className="p-1 bg-[#5885A2] hover:bg-[#2B3D4F] text-white border border-[#2B2625] shadow-ink-sm btn-press"
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedReqForNote(req);
                              setAdminNoteInput(req.admin_notes || '');
                            }}
                            title="Taktik izoh qo'shish"
                            className="p-1 bg-[#E5A823] hover:bg-[#ffe1b0] text-[#2B2625] border border-[#2B2625] shadow-ink-sm btn-press"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteRequisition(req.id)}
                            title="SQL dan o'chirish"
                            className="p-1 bg-[#ba1a1a] hover:bg-[#93000a] text-white border border-[#2B2625] shadow-ink-sm btn-press"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal for adding Quartermaster Note */}
            {selectedReqForNote && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-[#EFE7D3] border-3 border-[#2B2625] shadow-ink-xl max-w-md w-full p-6 space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#2B2625] pb-2">
                    <div className="font-anton text-xl uppercase tracking-wider text-[#2B2625]">
                      QUARTERMASTER IZOHI (#{selectedReqForNote.id})
                    </div>
                    <button
                      onClick={() => setSelectedReqForNote(null)}
                      className="font-mono-code font-bold text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="font-sans text-xs text-[#584140]">
                    Ushbu izoh SQL bazasidagi <code className="bg-[#D1C2A5] px-1 border border-[#2B2625]">admin_notes</code> ustuniga yoziladi va public forumda jangchiga ko'rinadi:
                  </p>

                  <textarea
                    rows={3}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Masalan: Maxsus carrier qushi orqali 3 daqiqada yetkaziladi..."
                    className="w-full p-2.5 bg-[#E1D5B8] border-2 border-[#2B2625] font-mono-code text-xs text-[#2B2625] focus:outline-none"
                  />

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2B2625]">
                    <button
                      type="button"
                      onClick={() => setSelectedReqForNote(null)}
                      className="px-3 py-1.5 bg-[#D1C2A5] border border-[#2B2625] font-mono-code text-xs font-bold"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateStatus(selectedReqForNote.id, selectedReqForNote.status, adminNoteInput);
                        setSelectedReqForNote(null);
                      }}
                      className="px-4 py-1.5 bg-[#B8383B] text-white border-2 border-[#2B2625] font-anton text-xs uppercase tracking-wider shadow-ink-sm"
                    >
                      SQL ga saqlash
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE SQL CONSOLE & QUERY INSPECTOR */}
        {activeTab === 'sql' && (
          <div className="bg-[#E1D5B8] border-3 border-[#2B2625] shadow-ink p-6 space-y-6">
            <div className="border-b-2 border-[#2B2625] pb-3">
              <div className="flex items-center gap-2 font-mono-code text-xs font-bold uppercase text-[#B8383B]">
                <Database className="w-4 h-4" />
                <span>INTERACTIVE SQL QUERY RUNNER & SCHEMA INSPECTOR</span>
              </div>
              <h2 className="font-anton text-2xl uppercase tracking-wide text-[#2B2625]">
                SQL TERMINALI VA MA'LUMOTLAR BAZASI INSPEKTORI
              </h2>
              <p className="font-mono-code text-xs text-[#584140] mt-1">
                Ushbu konsol to'g'ridan-to'g'ri backenddagi SQLite ma'lumotlar bazasida har qanday SQL so'rovini (SELECT, INSERT, UPDATE, PRAGMA) bajaradi.
              </p>
            </div>

            {/* Quick Query Templates */}
            <div>
              <div className="font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-2">
                Tezkor SQL Shabloni (Quick Queries):
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: 'SELECT * FROM requisitions',
                    query: 'SELECT id, mercenary_name, faction, ration_item, priority, status FROM requisitions ORDER BY id DESC;'
                  },
                  {
                    label: 'GROUP BY Faction Stats',
                    query: 'SELECT faction, COUNT(*) as soldiers, SUM(ration_quantity) as total_crates FROM requisitions GROUP BY faction;'
                  },
                  {
                    label: 'GROUP BY Mercenary Class',
                    query: 'SELECT mercenary_class, COUNT(*) as count FROM requisitions GROUP BY mercenary_class ORDER BY count DESC;'
                  },
                  {
                    label: 'SELECT * FROM ration_inventory',
                    query: 'SELECT code, name, stock_units, hp_restore, faction_alignment FROM ration_inventory;'
                  },
                  {
                    label: 'SELECT * FROM admin_logs',
                    query: 'SELECT * FROM admin_logs ORDER BY id DESC LIMIT 10;'
                  },
                  {
                    label: 'PRAGMA table_info(requisitions)',
                    query: 'PRAGMA table_info(requisitions);'
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSqlQuery(item.query);
                      handleExecuteSql(item.query);
                    }}
                    className="px-2.5 py-1 bg-[#EFE7D3] hover:bg-[#fff8f6] border border-[#2B2625] font-mono-code text-xs font-bold text-[#2B2625] shadow-ink-sm btn-press transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SQL Input Box */}
            <div className="space-y-2">
              <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625]">
                SQL Statement yozing:
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="SELECT * FROM requisitions WHERE faction = 'RED';"
                  className="w-full p-3 bg-[#2B2625] text-[#E5A823] border-3 border-[#2B2625] font-mono-code text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#B8383B] shadow-ink"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono-code text-[11px] text-[#584140]">
                  Dastak: SQLite 3.x (Node 22 native C++ engine)
                </span>
                <button
                  type="button"
                  onClick={() => handleExecuteSql()}
                  disabled={isExecutingSql}
                  className="px-6 py-2 bg-[#B8383B] hover:bg-[#7C2528] disabled:bg-[#8c716f] text-[#EFE7D3] font-anton text-sm uppercase tracking-wider border-2 border-[#2B2625] shadow-ink-sm flex items-center gap-2 btn-press transition-all chamfer-tr"
                >
                  <Play className="w-4 h-4 fill-current text-[#E5A823]" />
                  <span>{isExecutingSql ? 'SQL Ijro etilmoqda...' : 'SQL So\'rovni Bajarish (Run)'}</span>
                </button>
              </div>
            </div>

            {/* SQL Execution Error Banner */}
            {sqlError && (
              <div className="p-3 bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#93000a] font-mono-code text-xs shadow-ink-sm">
                <strong>SQL Xatosi: </strong> {sqlError}
              </div>
            )}

            {/* SQL Result Table */}
            {sqlResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono-code text-xs">
                  <span className="font-bold uppercase text-[#2B2625]">
                    Natija: {sqlResult.type === 'SELECT' ? `${sqlResult.rowCount} ta qator (rows) qaytdi` : sqlResult.result}
                  </span>
                  <span className="text-[#584140]">
                    Status: OK
                  </span>
                </div>

                {sqlResult.rows && sqlResult.rows.length > 0 ? (
                  <div className="overflow-x-auto border-2 border-[#2B2625] bg-[#EFE7D3] max-h-96 shadow-ink-sm">
                    <table className="w-full text-left font-mono-code text-xs">
                      <thead className="bg-[#2B2625] text-[#EFE7D3] sticky top-0">
                        <tr>
                          {Object.keys(sqlResult.rows[0]).map((col) => (
                            <th key={col} className="p-2.5 border-r border-[#EFE7D3]/20 uppercase">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2B2625]/20">
                        {sqlResult.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#fff8f6]">
                            {Object.values(row).map((val: any, cIdx) => (
                              <td key={cIdx} className="p-2.5 border-r border-[#2B2625]/10 whitespace-nowrap">
                                {typeof val === 'object' && val !== null
                                  ? JSON.stringify(val)
                                  : String(val ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : sqlResult.type === 'SELECT' ? (
                  <div className="p-4 bg-[#EFE7D3] border border-[#2B2625] font-mono-code text-xs text-[#584140]">
                    0 ta qator topildi (Empty result set).
                  </div>
                ) : (
                  <div className="p-3 bg-[#d8f3dc] border border-[#2d6a4f] text-[#1b4332] font-mono-code text-xs">
                    {sqlResult.result}
                  </div>
                )}
              </div>
            )}

            {/* Visual Schema Inspector */}
            {sqlSchema && (
              <div className="pt-4 border-t-2 border-[#2B2625] space-y-3">
                <div className="font-anton text-lg uppercase tracking-wide text-[#2B2625]">
                  BAZA SXEMASI (SQL TABLES & COLUMNS)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sqlSchema.tables.map((tbl) => (
                    <div key={tbl} className="bg-[#EFE7D3] border-2 border-[#2B2625] p-3 shadow-ink-sm">
                      <div className="font-anton text-base uppercase text-[#B8383B] border-b border-[#2B2625] pb-1 mb-2 flex items-center justify-between">
                        <span>TABLE: {tbl}</span>
                        <span className="font-mono-code text-[10px] text-[#584140]">{sqlSchema.schemaInfo[tbl]?.length} cols</span>
                      </div>
                      <div className="font-mono-code text-[11px] space-y-1">
                        {sqlSchema.schemaInfo[tbl]?.map((col: any) => (
                          <div key={col.name} className="flex justify-between text-[#2B2625]">
                            <span className={col.pk ? 'font-bold text-[#B8383B]' : ''}>
                              {col.pk ? '🔑 ' : ''}{col.name}
                            </span>
                            <span className="text-[#584140] font-semibold">{col.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVENTORY STOCKPILE */}
        {activeTab === 'inventory' && (
          <div className="bg-[#E1D5B8] border-3 border-[#2B2625] shadow-ink p-6 space-y-4">
            <div className="border-b-2 border-[#2B2625] pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-anton text-2xl uppercase tracking-wide text-[#2B2625]">
                  RATION INVENTORY STOCK (TABLE: ration_inventory)
                </h2>
                <p className="font-mono-code text-xs text-[#584140]">
                  Admin har bir oziq-ovqat zaxirasini to'g'ridan-to'g'ri SQL bazasida yangilashi mumkin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item) => (
                <div key={item.id} className="bg-[#EFE7D3] border-2 border-[#2B2625] p-4 shadow-ink-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2B2625] pb-2">
                    <span className="font-mono-code text-xs font-bold text-[#584140]">
                      [{item.code}]
                    </span>
                    <span className="font-mono-code text-[10px] font-bold bg-[#E5A823] px-1.5 py-0.5 border border-[#2B2625]">
                      {item.faction_alignment}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-anton text-xl uppercase tracking-wide text-[#2B2625]">
                      {item.name}
                    </h3>
                    <div className="font-mono-code text-xs text-[#B8383B] font-bold">
                      {item.hp_restore}
                    </div>
                  </div>

                  {/* Stock counter with SQL updater */}
                  <div className="pt-2 border-t border-[#2B2625]/20 flex items-center justify-between">
                    <div>
                      <div className="font-mono-code text-[10px] text-[#584140] uppercase">
                        SQL ZAXIRA:
                      </div>
                      <div className="font-anton text-2xl text-[#2B2625]">
                        {item.stock_units} UNITS
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-mono-code">
                      <button
                        onClick={() => handleUpdateStock(item.id, item.stock_units, -10)}
                        className="px-2 py-1 bg-[#D1C2A5] hover:bg-[#E1D5B8] border border-[#2B2625] font-bold text-xs"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleUpdateStock(item.id, item.stock_units, +25)}
                        className="px-2 py-1 bg-[#2d6a4f] hover:bg-[#1b4332] text-white border border-[#2B2625] font-bold text-xs"
                      >
                        +25
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-[#E1D5B8] border-3 border-[#2B2625] shadow-ink p-6 space-y-4">
            <div className="border-b-2 border-[#2B2625] pb-3">
              <h2 className="font-anton text-2xl uppercase tracking-wide text-[#2B2625]">
                ADMIN ACTIVITY AUDIT LOG (TABLE: admin_logs)
              </h2>
              <p className="font-mono-code text-xs text-[#584140]">
                Admin tomonidan bajarilgan barcha tasdiqlash, o'chirish va o'zgarishlar SQL `admin_logs` jadvalida ro'yxatga olinadi.
              </p>
            </div>

            <div className="bg-[#2B2625] text-[#EFE7D3] border-2 border-[#2B2625] p-4 font-mono-code text-xs max-h-96 overflow-y-auto space-y-2">
              {logs.length === 0 ? (
                <div className="text-[#8c716f]">Hozircha audit yozuvlari mavjud emas.</div>
              ) : (
                logs.map((log: any) => (
                  <div key={log.id} className="border-b border-[#584140] pb-1.5 flex items-start gap-2">
                    <span className="text-[#E5A823] font-bold shrink-0">[{log.timestamp?.slice(11, 19) || 'LOG'}]</span>
                    <span className="text-[#B8383B] font-bold shrink-0">{log.action}:</span>
                    <span className="text-[#EFE7D3]">{log.details}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
