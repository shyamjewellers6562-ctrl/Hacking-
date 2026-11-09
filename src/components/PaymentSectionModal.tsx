import React, { useState } from 'react';
import { CustomerRequest, AdminSettings } from '../types';
import {
  X,
  Copy,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  Upload,
  AlertTriangle,
  AlertCircle,
  FileCheck,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Wallet,
  Activity,
  Radio,
} from 'lucide-react';

interface PaymentSectionModalProps {
  request: CustomerRequest;
  adminSettings: AdminSettings;
  onClose: () => void;
  onBackToForm: () => void;
  onSubmitPayment: (
    requestId: string,
    utr: string,
    receiptImage?: string,
    amountPaid?: number,
    remainingAmount?: number,
    excessAmount?: number
  ) => void;
  onTrackCase: (requestId: string) => void;
}

export const PaymentSectionModal: React.FC<PaymentSectionModalProps> = ({
  request,
  adminSettings,
  onClose,
  onBackToForm,
  onSubmitPayment,
  onTrackCase,
}) => {
  const [utrNumber, setUtrNumber] = useState(request.utrNumber || '');
  const [amountPaidInput, setAmountPaidInput] = useState<number>(
    request.amountPaid !== undefined ? request.amountPaid : request.price
  );
  const [receiptImage, setReceiptImage] = useState<string | null>(request.receiptImage || null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [formError, setFormError] = useState('');

  // Underpayment popup modal state
  const [showUnderpaymentModal, setShowUnderpaymentModal] = useState(false);
  const [underpaidData, setUnderpaidData] = useState<{
    totalFee: number;
    amountReceived: number;
    remaining: number;
  }>({
    totalFee: request.price,
    amountReceived: 0,
    remaining: 0,
  });

  const [isSubmitted, setIsSubmitted] = useState(
    request.paymentStatus === 'Verification Pending' || request.paymentStatus === 'Payment Verified'
  );

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminSettings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Receipt image must be smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        setFormError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Payment Form Validation & Underpayment Check
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!utrNumber.trim()) {
      setFormError('Please enter your 12-digit UPI UTR or Transaction Reference Number.');
      return;
    }
    if (utrNumber.trim().length < 6) {
      setFormError('Please provide a valid UTR number (at least 6-12 digits).');
      return;
    }

    const paidNum = Number(amountPaidInput) || 0;
    const requiredPrice = request.price;

    // Check for UNDERPAYMENT
    if (paidNum < requiredPrice) {
      const remaining = requiredPrice - paidNum;
      setUnderpaidData({
        totalFee: requiredPrice,
        amountReceived: paidNum,
        remaining: remaining,
      });
      setShowUnderpaymentModal(true);
      return;
    }

    // Exact or Overpayment
    const excess = paidNum > requiredPrice ? paidNum - requiredPrice : 0;
    setFormError('');

    onSubmitPayment(
      request.id,
      utrNumber.trim(),
      receiptImage || undefined,
      paidNum,
      0,
      excess
    );
    setIsSubmitted(true);
  };

  // Action from Underpayment Modal: "PAY REMAINING AMOUNT"
  const handlePayRemaining = () => {
    setShowUnderpaymentModal(false);
    // Focus attention on paying remaining amount
    setAmountPaidInput(request.price);
    setFormError(
      `Please complete the remaining balance of ${request.currency}${underpaidData.remaining} via UPI and enter the full verified UTR.`
    );
  };

  const isVerified = request.paymentStatus === 'Payment Verified';
  const excess = (Number(amountPaidInput) || 0) > request.price
    ? (Number(amountPaidInput) || 0) - request.price
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Main Container with Dark Glassmorphism & Glowing Blue Border */}
      <div className="relative w-full max-w-xl glass-panel-blue rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.25)] border-2 border-cyan-400/40 overflow-hidden my-6 transition-all">
        
        {/* Futuristic glowing top bar with Cyan/Neon Green gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00D9FF] via-[#00FF88] to-[#00D9FF] shadow-[0_0_20px_#00D9FF]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-cyan-500/20 bg-black/40 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] uppercase mb-1 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
              <span>SECURE INCIDENT PORTAL · {request.id}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              COMPLETE YOUR SERVICE PAYMENT
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCREEN 1: PAYMENT SUBMITTED / VERIFICATION STATUS */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* If Fully Verified: Show the PART 4 requirement */}
            {isVerified ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border-2 border-[#00FF88]/60 text-center space-y-3.5 shadow-[0_0_35px_rgba(0,255,136,0.25)]">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-[#00FF88] text-[#00FF88] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,255,136,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                {/* EXACT REQUIRED HEADING */}
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  FULL PAYMENT RECEIVED
                </h4>

                {/* EXACT REQUIRED MESSAGE */}
                <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto leading-relaxed">
                  Your payment has been successfully verified. Your request is now ready for processing.
                </p>

                {/* EXACT REQUIRED TIMELINE NOTICE */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/40 text-xs text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
                  <span className="text-[#00FF88] font-bold block mb-1">SERVICE TIMELINE NOTICE</span>
                  Initial request review is expected to begin within 5 minutes after successful payment verification.
                </div>

                <div className="text-xs font-mono text-cyan-400 font-bold pt-1">
                  Transaction Reference: {request.utrNumber || utrNumber}
                </div>
              </div>
            ) : (
              /* Awaiting Verification Screen */
              <div className="p-6 rounded-2xl bg-[#091522]/90 border-2 border-cyan-500/50 text-center space-y-3 shadow-lg">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,217,255,0.35)] animate-pulse">
                  <Clock className="w-7 h-7" />
                </div>

                <h4 className="text-xl font-black text-white tracking-wide">
                  PAYMENT DETAILS RECEIVED
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your payment is awaiting verification. Our team will review your transaction details.
                </p>

                <div className="text-xs font-mono text-[#00FF88] font-bold pt-1">
                  Transaction Reference: {utrNumber}
                </div>

                <div className="p-2.5 rounded-xl bg-black/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping" />
                    <span>GATEWAY ROUTER: UTR DISPATCHED TO AUDIT QUEUE</span>
                  </span>
                  <span className="text-[#00FF88]">EST: ~5-15m</span>
                </div>

                {/* If excess payment was made */}
                {excess > 0 && (
                  <div className="text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-600/40 p-2.5 rounded-xl">
                    Notice: An excess payment of {request.currency}{excess} was submitted and queued for administrative billing review.
                  </div>
                )}
              </div>
            )}

            {/* Case Snapshot */}
            <div className="bg-black/60 rounded-2xl p-4 border border-cyan-500/20 text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Request ID:</span>
                <span className="font-mono text-white font-bold">{request.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Selected Service:</span>
                <span className="text-white font-medium">{request.serviceTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{request.inputFieldLabel}:</span>
                <span className="text-[#00FF88] font-mono font-bold">{request.usernameOrNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Fixed Fee:</span>
                <span className="font-mono text-white font-bold">{request.currency}{request.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono text-[#00D9FF] font-bold">
                  {request.currency}{amountPaidInput}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Verification Status:</span>
                <span
                  className={`font-mono font-bold ${
                    isVerified ? 'text-[#00FF88]' : 'text-amber-400'
                  }`}
                >
                  {isVerified ? 'Payment Verified' : 'Verification Pending'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              {!isVerified && (
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto px-4 py-3 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl transition-colors"
                >
                  Edit UTR / Amount
                </button>
              )}
              <button
                type="button"
                onClick={() => onTrackCase(request.id)}
                className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-extrabold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-xl transition-all cyber-glow-green-sm flex items-center justify-center gap-2"
              >
                <span>Track Request Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* SCREEN 2: PAYMENT ENTRY & UTR SUBMISSION */
          <div className="p-5 sm:p-7 space-y-5">
            
            {/* Service & Price Summary Card */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-mono">Case ID:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-white text-xs">{request.id}</span>
                  <button
                    onClick={handleCopyId}
                    className="text-slate-400 hover:text-[#00D9FF]"
                    title="Copy Request ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Selected Service:</span>
                <span className="text-white font-bold">{request.serviceTitle}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Submitted {request.inputFieldLabel.replace('Enter ', '')}:</span>
                <span className="text-[#00FF88] font-mono font-bold">{request.usernameOrNumber}</span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block">Standard Fixed Fee:</span>
                  <span className="text-[10px] text-slate-500">Official incident rate</span>
                </div>
                <span className="text-2xl font-black font-mono text-[#00FF88]">
                  {request.currency}{request.price}
                </span>
              </div>
            </div>

            {/* Live Simulated Payment Monitoring Telemetry */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
                <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
                  <Radio className="w-3.5 h-3.5 text-[#00FF88] animate-pulse" />
                  <span>GATEWAY TELEMETRY // UPI_ROUTER LISTENER</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#00FF88]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping" />
                  <span className="text-[10px]">MONITORING LIVE</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="bg-[#031107] p-2 rounded-lg border border-cyan-500/20">
                  <div className="text-slate-400">DAEMON</div>
                  <div className="text-[#00FF88] font-bold">UPI_RECON: READY</div>
                </div>
                <div className="bg-[#031107] p-2 rounded-lg border border-cyan-500/20">
                  <div className="text-slate-400">SECURITY</div>
                  <div className="text-[#00D9FF] font-bold">TLS-256 ENCRYPTED</div>
                </div>
                <div className="bg-[#031107] p-2 rounded-lg border border-cyan-500/20">
                  <div className="text-slate-400">NPCI RAIL</div>
                  <div className="text-[#00FF88] font-bold">STABLE (28ms)</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>UTR Reconciliation engine standby for submitted reference.</span>
                <span className="text-cyan-400">PORT: 8443</span>
              </div>
            </div>

            {/* UPI Payment Instructions & QR */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#070e17]/90 border border-cyan-500/30 space-y-3">
              <span className="text-xs font-mono uppercase text-[#00D9FF] font-bold tracking-wider block">
                PAYMENT INSTRUCTIONS
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code */}
                <div className="p-2.5 bg-white rounded-2xl shadow-md shrink-0 flex flex-col items-center">
                  <div className="w-22 h-22 bg-white flex flex-col items-center justify-center text-black">
                    <svg className="w-18 h-18" viewBox="0 0 100 100">
                      <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="#000" strokeWidth="6" />
                      <rect x="13" y="13" width="12" height="12" fill="#000" />
                      <rect x="67" y="5" width="28" height="28" rx="2" fill="none" stroke="#000" strokeWidth="6" />
                      <rect x="75" y="13" width="12" height="12" fill="#000" />
                      <rect x="5" y="67" width="28" height="28" rx="2" fill="none" stroke="#000" strokeWidth="6" />
                      <rect x="13" y="75" width="12" height="12" fill="#000" />
                      <rect x="42" y="10" width="8" height="18" fill="#000" />
                      <rect x="10" y="42" width="18" height="8" fill="#000" />
                      <rect x="42" y="42" width="16" height="16" fill="#000" />
                      <rect x="68" y="45" width="24" height="6" fill="#000" />
                      <rect x="45" y="70" width="15" height="18" fill="#000" />
                      <rect x="70" y="72" width="18" height="18" fill="#000" />
                    </svg>
                    <span className="text-[7.5px] font-bold tracking-tight text-slate-900 uppercase">SCAN &amp; PAY</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs flex-1 w-full">
                  <div className="text-slate-300 leading-relaxed">
                    Pay the fixed service fee of <strong className="text-white font-mono">{request.currency}{request.price}</strong> using Google Pay, PhonePe, Paytm, or BHIM.
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/80 border border-cyan-500/30 flex items-center justify-between gap-2">
                    <span className="font-mono text-[#00FF88] text-xs font-bold truncate">
                      {adminSettings.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3 h-3 text-[#00FF88]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy UPI</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    {adminSettings.upiQrNote}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-700 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Amount Paid Field (Supports exact, underpayment detection, or excess) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                    <span>Amount Transferred ({request.currency}) <span className="text-[#00D9FF]">*</span></span>
                    <span className="text-slate-400 font-mono text-[10px]">Fee: {request.currency}{request.price}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      value={amountPaidInput}
                      onChange={(e) => setAmountPaidInput(Number(e.target.value))}
                      placeholder={`Enter amount (e.g. ${request.price})`}
                      className={`w-full px-4 py-3 rounded-xl bg-black/60 border-2 font-mono text-sm text-white focus:outline-none transition-all ${
                        amountPaidInput < request.price
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-cyan-500/40 focus:border-[#00D9FF]'
                      }`}
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-mono text-slate-400">
                      INR
                    </span>
                  </div>
                  {amountPaidInput < request.price && (
                    <span className="text-[11px] text-red-400 font-mono mt-1 block">
                      Underpayment: ₹{request.price - amountPaidInput} remaining
                    </span>
                  )}
                  {amountPaidInput > request.price && (
                    <span className="text-[11px] text-cyan-300 font-mono mt-1 block">
                      Excess: +₹{amountPaidInput - request.price} (Requires admin review)
                    </span>
                  )}
                </div>

                {/* UTR Input */}
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    UPI UTR / Reference No. <span className="text-[#00D9FF]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="12-digit UTR from receipt"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border-2 border-cyan-500/40 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-[#00FF88]"
                  />
                </div>
              </div>

              {/* Upload Receipt */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  Payment Receipt Screenshot <span className="text-slate-400 font-normal text-[11px]">(Optional proof)</span>
                </label>
                {receiptImage ? (
                  <div className="p-2.5 rounded-xl bg-black/70 border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={receiptImage}
                        alt="Receipt Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                      />
                      <div className="text-xs">
                        <span className="text-white font-semibold block">Receipt Screenshot Attached</span>
                        <span className="text-[#00D9FF] text-[11px]">Ready for administrative reconciliation</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptImage(null)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 font-mono"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-cyan-500/30 hover:border-[#00D9FF]/60 rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer bg-black/40 transition-colors">
                    <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                    <span className="text-xs text-slate-300 font-medium">Click to select receipt screenshot</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, WebP up to 5MB</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={onBackToForm}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
                  >
                    Pay Later
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 text-xs sm:text-sm font-extrabold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-xl transition-all cyber-glow-green-sm flex items-center gap-2"
                  >
                    <span>Submit Payment Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </form>

          </div>
        )}

      </div>

      {/* POPUP: UNDERPAYMENT ERROR MODAL (PART 3 REQUIREMENT) */}
      {showUnderpaymentModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#120707] border-2 border-red-500 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.45)] animate-glow-red overflow-hidden p-6 sm:p-7 space-y-5">
            
            {/* Top Red Glow Indicator */}
            <div className="h-1.5 w-full bg-red-500 shadow-[0_0_20px_#ef4444] absolute top-0 left-0" />

            <div className="text-center space-y-3 pt-2">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>

              {/* EXACT REQUIRED HEADING */}
              <h3 className="text-2xl font-black text-white tracking-wide">
                PAYMENT INCOMPLETE
              </h3>

              {/* EXACT REQUIRED MESSAGE */}
              <p className="text-xs sm:text-sm text-red-200 leading-relaxed">
                The full service amount must be paid to proceed with your request. Please complete the remaining payment to continue.
              </p>
            </div>

            {/* Required Breakdown Display */}
            <div className="p-4 rounded-2xl bg-black/80 border border-red-500/40 text-xs space-y-2.5 font-mono">
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Service Fee:</span>
                <span className="text-white font-bold">{request.currency}{underpaidData.totalFee}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Amount Received:</span>
                <span className="text-amber-400 font-bold">{request.currency}{underpaidData.amountReceived}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-red-500/30 text-sm">
                <span className="text-red-300 font-bold">Remaining Amount:</span>
                <span className="text-red-400 font-black text-base">
                  {request.currency}{underpaidData.remaining}
                </span>
              </div>
            </div>

            {/* Required Button */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handlePayRemaining}
                className="w-full py-3.5 text-xs sm:text-sm font-black text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>PAY REMAINING AMOUNT</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUnderpaymentModal(false)}
                className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Review Transaction Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
