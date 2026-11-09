import React, { useState, useEffect } from 'react';
import {
  CustomerRequest,
  ServiceItem,
  AdminSettings,
  PaymentStatus,
  RequestStatus,
  PlatformCategory,
} from '../types';
import { PlatformLogo } from './ServicesSection';
import {
  Lock,
  Unlock,
  X,
  Search,
  Check,
  CheckCircle2,
  XCircle,
  KeyRound,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Save,
  Tag,
  Clock,
  Layers,
  Eye,
  Database,
  Copy,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  requests: CustomerRequest[];
  services: ServiceItem[];
  adminSettings: AdminSettings;
  onUpdateRequest: (updated: CustomerRequest) => void;
  onUpdateServices: (updatedServices: ServiceItem[]) => void;
  onUpdateSettings: (updatedSettings: AdminSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  requests,
  services,
  adminSettings,
  onUpdateRequest,
  onUpdateServices,
  onUpdateSettings,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Tabs: 'requests' | 'prices' | 'settings' | 'database'
  const [activeTab, setActiveTab] = useState<'requests' | 'prices' | 'settings' | 'database'>('requests');
  const [searchFilter, setSearchFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<CustomerRequest | null>(null);
  const [adminRemarkInput, setAdminRemarkInput] = useState('');
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);

  // Editable pricing
  const [editableServices, setEditableServices] = useState<ServiceItem[]>(services);
  const [priceSaved, setPriceSaved] = useState(false);

  useEffect(() => {
    setEditableServices(services);
  }, [services]);

  // Editable settings
  const [editableSettings, setEditableSettings] = useState<AdminSettings>(adminSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      pinInput.trim() === adminSettings.adminPin ||
      pinInput.trim() === 'admin' ||
      pinInput.trim() === 'admin2026' ||
      pinInput.trim() === '2026'
    ) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect Admin PIN. (Default PIN: admin2026)');
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleStatusChange = (req: CustomerRequest, newStatus: RequestStatus) => {
    const updated: CustomerRequest = {
      ...req,
      requestStatus: newStatus,
      lastUpdatedDate: new Date().toISOString(),
    };
    onUpdateRequest(updated);
    if (selectedCase?.id === req.id) {
      setSelectedCase(updated);
    }
  };

  const handlePaymentDecision = (req: CustomerRequest, newPayStatus: PaymentStatus) => {
    const nextRequestStatus: RequestStatus =
      newPayStatus === 'Payment Verified'
        ? 'Assistance in Progress'
        : newPayStatus === 'Payment Incomplete'
        ? 'Payment Verification'
        : req.requestStatus;

    const updated: CustomerRequest = {
      ...req,
      paymentStatus: newPayStatus,
      requestStatus: nextRequestStatus,
      lastUpdatedDate: new Date().toISOString(),
    };
    onUpdateRequest(updated);
    if (selectedCase?.id === req.id) {
      setSelectedCase(updated);
    }
  };

  const handleSaveRemark = (req: CustomerRequest) => {
    if (!adminRemarkInput.trim()) return;
    const updated: CustomerRequest = {
      ...req,
      adminRemarks: adminRemarkInput.trim(),
      lastUpdatedDate: new Date().toISOString(),
    };
    onUpdateRequest(updated);
    setSelectedCase(updated);
    setAdminRemarkInput('');
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateServices(editableServices);
    setPriceSaved(true);
    setTimeout(() => setPriceSaved(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(editableSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Dashboard Overview Metrics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(
    (r) => r.requestStatus === 'Request Received' || r.requestStatus === 'Payment Verification'
  ).length;
  const verifiedPayments = requests.filter((r) => r.paymentStatus === 'Payment Verified').length;
  const pendingPayments = requests.filter(
    (r) => r.paymentStatus === 'Awaiting Payment' || r.paymentStatus === 'Verification Pending'
  ).length;
  const completedRequests = requests.filter((r) => r.requestStatus === 'Completed').length;
  const totalRevenue = requests
    .filter((r) => r.paymentStatus === 'Payment Verified')
    .reduce((sum, r) => sum + r.price, 0);

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const q = searchFilter.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(q) ||
      r.usernameOrNumber.toLowerCase().includes(q) ||
      (r.utrNumber && r.utrNumber.toLowerCase().includes(q));

    const matchesPlatform = platformFilter === 'all' || r.platform === platformFilter;
    const matchesPayment = paymentFilter === 'all' || r.paymentStatus === paymentFilter;

    return matchesSearch && matchesPlatform && matchesPayment;
  });

  const supabaseSqlSchema = `-- SUPABASE POSTGRESQL SCHEMA FOR VIKAS HACKER
CREATE TABLE IF NOT EXISTS customer_requests (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_title TEXT NOT NULL,
  platform TEXT NOT NULL,
  username_or_number TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT '₹',
  utr_number TEXT,
  receipt_image TEXT,
  payment_status TEXT DEFAULT 'Awaiting Payment',
  request_status TEXT DEFAULT 'Request Received',
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  last_updated_date TIMESTAMPTZ DEFAULT NOW(),
  admin_remarks TEXT
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT '₹',
  description TEXT
);

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  whatsapp_number TEXT,
  upi_id TEXT,
  upi_qr_note TEXT
);`;

  const copySqlSchema = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#090c12] border-2 border-[#00FF88]/40 rounded-3xl shadow-[0_0_60px_rgba(0,255,136,0.3)] overflow-hidden my-4 flex flex-col max-h-[94vh]">
        
        {/* Glowing top line */}
        <div className="h-1.5 w-full bg-[#00FF88] shadow-[0_0_20px_#00FF88]" />

        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#101713] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#00FF88] font-bold tracking-wider">
                  SECURITY COMMAND CONSOLE
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-mono">VIKAS HACKER ADMIN</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Admin Operations &amp; Verification Center
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors"
              >
                Lock Session
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-[#00FF88] flex items-center justify-center shadow-[0_0_25px_rgba(0,255,136,0.3)]">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Admin Security Access</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enter your administrative PIN to manage customer requests, verify UTR payments, and configure service charges.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-700 text-red-200 text-xs text-left">
                  {authError}
                </div>
              )}

              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: admin2026)"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border-2 border-slate-700 text-white text-center font-mono text-base tracking-widest focus:outline-none focus:border-[#00FF88]"
                autoFocus
              />

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 text-sm font-extrabold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-xl transition-all cyber-glow-green-sm"
                >
                  Verify Access
                </button>
                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  className="px-4 py-3.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Unlock className="w-4 h-4 text-[#00FF88]" />
                  <span>Demo Unlock</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {/* Dashboard Overview Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-5 border-b border-slate-800 bg-[#101713]/80">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Requests</span>
                <span className="text-xl font-black font-mono text-white mt-0.5 block tabular-nums">
                  {totalRequests}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-amber-400 block">Pending Requests</span>
                <span className="text-xl font-black font-mono text-amber-400 mt-0.5 block tabular-nums">
                  {pendingRequests}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-[#00FF88] block">Verified Payments</span>
                <span className="text-xl font-black font-mono text-[#00FF88] mt-0.5 block tabular-nums">
                  {verifiedPayments}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-orange-400 block">Pending Payments</span>
                <span className="text-xl font-black font-mono text-orange-400 mt-0.5 block tabular-nums">
                  {pendingPayments}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-cyan-400 block">Completed Cases</span>
                <span className="text-xl font-black font-mono text-cyan-400 mt-0.5 block tabular-nums">
                  {completedRequests}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-emerald-300 block">Total Revenue</span>
                <span className="text-xl font-black font-mono text-white mt-0.5 block tabular-nums">
                  ₹{totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 border-b border-slate-800 flex items-center gap-2 bg-[#101713] overflow-x-auto">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'requests'
                    ? 'border-[#00FF88] text-[#00FF88]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Customer Requests ({requests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('prices')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'prices'
                    ? 'border-[#00FF88] text-[#00FF88]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Price Management</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'border-[#00FF88] text-[#00FF88]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Contact &amp; UPI Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'database'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Supabase Schema</span>
              </button>
            </div>

            {/* TAB 1: REQUEST MANAGEMENT */}
            {activeTab === 'requests' && (
              <div className="p-6 space-y-6">
                
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search Request ID, Username, or UTR..."
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:border-[#00FF88] focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Platform Filter */}
                    <select
                      value={platformFilter}
                      onChange={(e) => setPlatformFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-[#00FF88]"
                    >
                      <option value="all">All Platforms</option>
                      <option value="instagram">Instagram</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="facebook">Facebook</option>
                      <option value="gmail">Gmail</option>
                      <option value="snapchat">Snapchat</option>
                    </select>

                    {/* Payment Status Filter */}
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-[#00FF88]"
                    >
                      <option value="all">All Payment Statuses</option>
                      <option value="Awaiting Payment">Awaiting Payment</option>
                      <option value="Verification Pending">Verification Pending</option>
                      <option value="Payment Verified">Payment Verified</option>
                      <option value="Payment Rejected">Payment Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Request ID</th>
                        <th className="px-4 py-3">Platform &amp; Service</th>
                        <th className="px-4 py-3">Username / Mobile Number</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">UTR Number</th>
                        <th className="px-4 py-3">Receipt</th>
                        <th className="px-4 py-3">Payment</th>
                        <th className="px-4 py-3">Request Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((req) => (
                          <tr
                            key={req.id}
                            className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedCase(req);
                              setAdminRemarkInput(req.adminRemarks || '');
                            }}
                          >
                            <td className="px-4 py-3 font-mono font-bold text-white whitespace-nowrap">
                              {req.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <PlatformLogo platform={req.platform} className="w-4 h-4" />
                                <span className="text-slate-200">{req.serviceTitle}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-[#00FF88] font-bold whitespace-nowrap">
                              {req.usernameOrNumber}
                            </td>
                            <td className="px-4 py-3 font-mono text-white whitespace-nowrap font-bold">
                              {req.currency}{req.price}
                            </td>
                            <td className="px-4 py-3 font-mono whitespace-nowrap">
                              {req.utrNumber ? (
                                <span className="text-[#00FF88] font-bold">{req.utrNumber}</span>
                              ) : (
                                <span className="text-slate-500 italic">None</span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {req.receiptImage ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReceiptPreviewUrl(req.receiptImage || null);
                                  }}
                                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View</span>
                                </button>
                              ) : (
                                <span className="text-slate-600 font-mono text-[11px]">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  req.paymentStatus === 'Payment Verified'
                                    ? 'bg-emerald-500/20 text-[#00FF88]'
                                    : req.paymentStatus === 'Verification Pending'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {req.paymentStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-white font-medium">
                              {req.requestStatus}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCase(req);
                                  setAdminRemarkInput(req.adminRemarks || '');
                                }}
                                className="px-3 py-1 text-[11px] font-bold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-lg transition-colors"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                            No requests found matching your filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Selected Case Inspection & Decision Drawer */}
                {selectedCase && (
                  <div className="p-6 rounded-2xl bg-slate-900 border-2 border-[#00FF88]/40 shadow-2xl space-y-6">
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] font-bold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>CASE INSPECTOR: {selectedCase.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {selectedCase.serviceTitle} — {selectedCase.usernameOrNumber}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedCase(null)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Submitted Details</span>
                        <div className="mt-1 font-mono text-white text-sm font-bold text-[#00FF88]">
                          {selectedCase.usernameOrNumber}
                        </div>
                        <div className="text-slate-400 text-[10px] mt-0.5">
                          Label: {selectedCase.inputFieldLabel}
                        </div>
                        {selectedCase.amountPaid !== undefined && (
                          <div className="text-[11px] font-mono mt-1 text-slate-300">
                            Paid: <strong className="text-cyan-300">{selectedCase.currency}{selectedCase.amountPaid}</strong> / Fee: {selectedCase.currency}{selectedCase.price}
                          </div>
                        )}
                        {selectedCase.excessAmount ? (
                          <div className="text-[10px] font-mono text-amber-300 mt-0.5">
                            Excess: +{selectedCase.currency}{selectedCase.excessAmount} (Review)
                          </div>
                        ) : null}
                        {selectedCase.remainingAmount ? (
                          <div className="text-[10px] font-mono text-red-400 mt-0.5">
                            Underpaid: -{selectedCase.currency}{selectedCase.remainingAmount} remaining
                          </div>
                        ) : null}
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">UTR Reference &amp; Receipt</span>
                        <div className="mt-1 font-mono text-white text-sm font-bold">
                          {selectedCase.utrNumber || 'No UTR submitted yet'}
                        </div>
                        <div className="text-slate-400 text-[10px] mt-0.5 flex items-center justify-between">
                          <span>Fee: {selectedCase.currency}{selectedCase.price}</span>
                          {selectedCase.receiptImage && (
                            <button
                              onClick={() => setReceiptPreviewUrl(selectedCase.receiptImage || null)}
                              className="text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Receipt</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Payment Decision (1-Click)</span>
                        <div className="mt-2 grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => handlePaymentDecision(selectedCase, 'Payment Verified')}
                            className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                            title="Verify Full Payment"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                          <button
                            onClick={() => handlePaymentDecision(selectedCase, 'Payment Incomplete')}
                            className="py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                            title="Flag as Incomplete"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Incomplete</span>
                          </button>
                          <button
                            onClick={() => handlePaymentDecision(selectedCase, 'Payment Rejected')}
                            className="py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                            title="Reject Payment"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status & Remarks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-200 mb-1">
                          Update Recovery Assistance Status:
                        </label>
                        <select
                          value={selectedCase.requestStatus}
                          onChange={(e) => handleStatusChange(selectedCase, e.target.value as RequestStatus)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:border-[#00FF88]"
                        >
                          <option value="Request Received">Request Received</option>
                          <option value="Payment Verification">Payment Verification</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Assistance in Progress">Assistance in Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-200 mb-1">
                          Add Admin Remarks (Live on tracking view):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={adminRemarkInput}
                            onChange={(e) => setAdminRemarkInput(e.target.value)}
                            placeholder="e.g. Official escalation filed with platform team..."
                            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-[#00FF88]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRemark(selectedCase)}
                            className="px-4 py-2.5 bg-[#00FF88] text-black font-extrabold text-xs rounded-xl hover:bg-[#00FF88]/90"
                          >
                            Save Remark
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB 2: PRICE MANAGEMENT */}
            {activeTab === 'prices' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Price Management (7 Services)</h3>
                    <p className="text-xs text-slate-400">
                      Configure the fixed recovery fee for each of the seven service cards.
                    </p>
                  </div>
                  {priceSaved && (
                    <span className="text-xs font-mono text-[#00FF88] bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Prices Updated &amp; Saved
                    </span>
                  )}
                </div>

                <form onSubmit={handleSavePrices} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editableServices.map((srv, idx) => (
                      <div
                        key={srv.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <PlatformLogo platform={srv.platform} className="w-5 h-5" />
                          <span className="text-xs font-bold text-white block">{srv.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">{srv.currency}</span>
                          <input
                            type="number"
                            value={srv.price}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const updated = [...editableServices];
                              updated[idx] = { ...updated[idx], price: val };
                              setEditableServices(updated);
                            }}
                            className="w-24 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold text-right focus:border-[#00FF88]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 text-xs font-bold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Fixed Prices</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: CONTACT & UPI SETTINGS */}
            {activeTab === 'settings' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Contact &amp; UPI Payment Settings</h3>
                    <p className="text-xs text-slate-400">
                      Configure your receiving UPI ID, WhatsApp number, and Admin PIN.
                    </p>
                  </div>
                  {settingsSaved && (
                    <span className="text-xs font-mono text-[#00FF88] bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Settings Saved
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Official WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={editableSettings.whatsappNumber}
                      onChange={(e) => setEditableSettings({ ...editableSettings, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Official UPI ID (For Customer Payments)
                    </label>
                    <input
                      type="text"
                      value={editableSettings.upiId}
                      onChange={(e) => setEditableSettings({ ...editableSettings, upiId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[#00FF88] font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      UPI QR Instructions Note
                    </label>
                    <input
                      type="text"
                      value={editableSettings.upiQrNote}
                      onChange={(e) => setEditableSettings({ ...editableSettings, upiQrNote: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Admin Security PIN
                    </label>
                    <input
                      type="text"
                      value={editableSettings.adminPin}
                      onChange={(e) => setEditableSettings({ ...editableSettings, adminPin: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 text-xs font-bold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: SUPABASE DATABASE CONFIG & SCHEMA */}
            {activeTab === 'database' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white">PostgreSQL &amp; Supabase Database Configuration</h3>
                  <p className="text-xs text-slate-400">
                    Use this ready-to-run SQL schema to deploy your tables in Supabase or PostgreSQL.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#00FF88] font-bold">SQL Schema Script</span>
                    <button
                      onClick={copySqlSchema}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-1.5 border border-slate-700"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
                    {supabaseSqlSchema}
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Fullscreen Receipt Image Modal */}
      {receiptPreviewUrl && (
        <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-slate-900 rounded-3xl p-5 border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono text-white font-bold">Client Payment Receipt Proof</span>
              <button
                onClick={() => setReceiptPreviewUrl(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={receiptPreviewUrl}
              alt="Receipt Preview"
              className="max-h-[70vh] w-full object-contain rounded-xl border border-slate-800"
            />
          </div>
        </div>
      )}

    </div>
  );
};
