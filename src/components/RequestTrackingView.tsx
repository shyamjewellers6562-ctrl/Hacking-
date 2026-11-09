import React, { useState } from 'react';
import { CustomerRequest, RequestStatus } from '../types';
import { PlatformLogo } from './ServicesSection';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Calendar,
  CreditCard,
  X,
  MessageSquare,
  FileText,
  AlertCircle,
  Wallet,
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../data/servicesData';

interface RequestTrackingViewProps {
  requests: CustomerRequest[];
  initialRequestId?: string;
  onClose: () => void;
  onOpenPaymentModal: (request: CustomerRequest) => void;
}

const STATUS_PIPELINE: RequestStatus[] = [
  'Request Received',
  'Payment Verification',
  'Under Review',
  'Assistance in Progress',
  'Completed',
];

export const RequestTrackingView: React.FC<RequestTrackingViewProps> = ({
  requests,
  initialRequestId = '',
  onClose,
  onOpenPaymentModal,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialRequestId);
  const [activeRequest, setActiveRequest] = useState<CustomerRequest | null>(() => {
    if (initialRequestId) {
      return (
        requests.find((r) => r.id.toLowerCase() === initialRequestId.toLowerCase()) ||
        requests[0] ||
        null
      );
    }
    return requests[0] || null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const found = requests.find(
      (r) =>
        r.id.toLowerCase() === query ||
        r.usernameOrNumber.toLowerCase().includes(query)
    );
    setActiveRequest(found || null);
  };

  const handleQuickSelect = (id: string) => {
    setSearchQuery(id);
    const found = requests.find((r) => r.id === id);
    if (found) {
      setActiveRequest(found);
    }
  };

  const cleanPhone = OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  const getWhatsappStatusUrl = (req: CustomerRequest) => {
    const text = `Hello Vikas Hacker, I am tracking my case [ID: ${req.id}] for account ${req.usernameOrNumber} (${req.serviceTitle}). Current status is "${req.requestStatus}". Please provide an update.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'Completed':
        return 'text-[#00FF88] border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
      case 'Assistance in Progress':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,217,255,0.2)]';
      case 'Under Review':
      case 'Payment Verification':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      case 'Cancelled':
        return 'text-red-400 border-red-500/40 bg-red-500/10';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800/60';
    }
  };

  const getStepIndex = (status: RequestStatus) => {
    return STATUS_PIPELINE.indexOf(status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel-blue rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.25)] border-2 border-cyan-400/40 overflow-hidden my-6">
        
        {/* Glowing top line with Cyan & Neon Green gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00D9FF] via-[#00FF88] to-[#00D9FF] shadow-[0_0_20px_#00D9FF]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-cyan-500/20 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black/60 border border-cyan-500/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#00D9FF] font-bold tracking-wider">
                  CASE INCIDENT TELEMETRY
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-[#00FF88] font-mono">VIKAS HACKER</span>
              </div>
              <h3 className="text-xl font-black text-white">
                REQUEST TRACKING SYSTEM
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Request ID (e.g. VK-9412-SEC) or Username..."
                className="w-full px-4 py-3 pl-10 rounded-xl bg-black/60 border-2 border-cyan-500/30 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#00D9FF]"
              />
              <Search className="w-4 h-4 text-cyan-500 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-xs sm:text-sm font-bold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-xl transition-colors shrink-0 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
            >
              Track Case
            </button>
          </form>

          {/* Quick Select Sample IDs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Sample Cases:</span>
            {requests.slice(0, 3).map((req) => (
              <button
                key={req.id}
                type="button"
                onClick={() => handleQuickSelect(req.id)}
                className={`px-3 py-1 rounded-lg border font-mono text-xs transition-colors ${
                  activeRequest?.id === req.id
                    ? 'border-[#00D9FF] text-[#00D9FF] bg-cyan-950/40'
                    : 'border-slate-800 text-slate-400 bg-black/40 hover:text-white'
                }`}
              >
                {req.id} ({req.usernameOrNumber})
              </button>
            ))}
          </div>

          {/* Active Request Card */}
          {activeRequest ? (
            <div className="p-6 rounded-2xl bg-black/70 border border-cyan-500/30 space-y-5">
              
              {/* Header: Platform, ID, Status */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center p-2.5">
                    <PlatformLogo platform={activeRequest.platform} className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {activeRequest.id}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-300">
                        {activeRequest.serviceTitle}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-[#00FF88] font-mono mt-0.5">
                      {activeRequest.usernameOrNumber}
                    </div>
                  </div>
                </div>

                <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${getStatusColor(activeRequest.requestStatus)}`}>
                  {activeRequest.requestStatus === 'Completed' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : activeRequest.requestStatus === 'Cancelled' ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  <span>{activeRequest.requestStatus}</span>
                </div>
              </div>

              {/* PART 4 REQUIREMENT: VERIFIED FULL PAYMENT NOTIFICATION BANNER */}
              {activeRequest.paymentStatus === 'Payment Verified' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border-2 border-[#00FF88]/60 space-y-2 shadow-[0_0_25px_rgba(0,255,136,0.2)]">
                  <div className="flex items-center gap-2 text-[#00FF88] font-black text-sm tracking-wide">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>FULL PAYMENT RECEIVED</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    Your payment has been successfully verified. Your request is now ready for processing.
                  </p>
                  <div className="pt-1 text-[11px] font-medium text-emerald-300/90 border-t border-emerald-500/20">
                    <strong className="text-white">Service Timeline Notice:</strong> Initial request review is expected to begin within 5 minutes after successful payment verification.
                  </div>
                </div>
              )}

              {/* Incomplete Payment Notice */}
              {activeRequest.paymentStatus === 'Payment Incomplete' && (
                <div className="p-4 rounded-2xl bg-red-950/40 border-2 border-red-500/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-white block">Payment Incomplete</span>
                      <span className="text-red-200">
                        Remaining balance of {activeRequest.currency}{activeRequest.remainingAmount || 0} is due.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenPaymentModal(activeRequest)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shrink-0"
                  >
                    Pay Remaining
                  </button>
                </div>
              )}

              {/* Visual Progress Tracker with Animated Indicators */}
              {activeRequest.requestStatus !== 'Cancelled' && (
                <div className="pt-1">
                  <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2.5">
                    ESCALATION PIPELINE
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {STATUS_PIPELINE.map((step, idx) => {
                      const currentIdx = getStepIndex(activeRequest.requestStatus);
                      const isDone = currentIdx >= idx;
                      const isCurrent = currentIdx === idx;

                      return (
                        <div key={step} className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isDone
                                ? 'bg-gradient-to-r from-[#00D9FF] to-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.5)]'
                                : 'bg-slate-800'
                            }`}
                          />
                          <div
                            className={`text-[10px] sm:text-[11px] font-medium leading-tight truncate ${
                              isCurrent
                                ? 'text-white font-bold'
                                : isDone
                                ? 'text-[#00FF88]'
                                : 'text-slate-500'
                            }`}
                            title={step}
                          >
                            {step}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Data Grid: Request ID, Service, Username, Payment Status, etc. */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-cyan-500/20 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Submission Date</span>
                  <div className="flex items-center gap-1 text-slate-200 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{new Date(activeRequest.submissionDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Last Updated Date</span>
                  <div className="flex items-center gap-1 text-slate-200 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{new Date(activeRequest.lastUpdatedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Payment Status</span>
                  <div className="flex items-center gap-1 mt-0.5 font-semibold font-mono">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                    <span
                      className={
                        activeRequest.paymentStatus === 'Payment Verified'
                          ? 'text-[#00FF88]'
                          : activeRequest.paymentStatus === 'Verification Pending'
                          ? 'text-amber-400'
                          : activeRequest.paymentStatus === 'Payment Incomplete'
                          ? 'text-red-400'
                          : 'text-slate-300'
                      }
                    >
                      {activeRequest.paymentStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">UTR Reference</span>
                  <span className="font-mono text-white text-[11px] mt-0.5 block truncate">
                    {activeRequest.utrNumber || 'Pending Submission'}
                  </span>
                </div>
              </div>

              {/* Admin Remarks */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1">
                <div className="flex items-center gap-2 text-[#00D9FF] font-mono text-[11px] uppercase tracking-wider font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
                  <span>Administrative Telemetry Remarks:</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  {activeRequest.adminRemarks || 'Case initiated. Official security verification in progress.'}
                </p>
              </div>

              {/* Action Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {activeRequest.paymentStatus === 'Awaiting Payment' ||
                activeRequest.paymentStatus === 'Payment Incomplete' ? (
                  <button
                    type="button"
                    onClick={() => onOpenPaymentModal(activeRequest)}
                    className="px-5 py-2.5 text-xs font-bold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-xl transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Complete Payment / Submit UTR</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenPaymentModal(activeRequest)}
                    className="px-4 py-2 text-xs text-slate-300 bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-cyan-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Payment Slip</span>
                  </button>
                )}

                <a
                  href={getWhatsappStatusUrl(activeRequest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-700/60 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-[#00FF88]" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-black/60 border border-cyan-500/20 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-sm font-bold text-white">No Request Found</div>
              <p className="text-xs text-slate-400">
                Please check the entered Request ID (e.g. VK-9412-SEC) or select a sample case above.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
