import React, { useState } from 'react';
import { ServiceItem, CustomerRequest } from '../types';
import { PlatformLogo } from './ServicesSection';
import { X, ArrowRight, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

interface ServiceRequestModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBack: () => void;
  onSubmit: (request: CustomerRequest) => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  service,
  onClose,
  onBack,
  onSubmit,
}) => {
  if (!service) return null;

  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = identifier.trim();

    if (!val) {
      setError(`Please provide your ${service.inputLabel.toLowerCase()}.`);
      return;
    }

    if (service.isMobileNumber) {
      // Validate mobile number: at least 7 digits
      const digits = val.replace(/\D/g, '');
      if (digits.length < 8) {
        setError('Please enter a valid mobile number with country code (e.g. +91 82790 26491).');
        return;
      }
    } else if (service.platform === 'gmail') {
      if (!val.includes('@') || !val.includes('.')) {
        setError('Please enter a valid Gmail address (e.g. yourname@gmail.com).');
        return;
      }
    } else {
      if (val.length < 2) {
        setError('Please enter a valid username (at least 2 characters).');
        return;
      }
    }

    setError('');
    setIsSubmitting(true);

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newRequestId = `VK-${randomDigits}-SEC`;
    const now = new Date().toISOString();

    const newRequest: CustomerRequest = {
      id: newRequestId,
      serviceId: service.id,
      serviceTitle: service.title,
      platform: service.platform,
      usernameOrNumber: val,
      inputFieldLabel: service.inputLabel,
      price: service.price,
      currency: service.currency,
      paymentStatus: 'Awaiting Payment',
      requestStatus: 'Request Received',
      submissionDate: now,
      lastUpdatedDate: now,
      adminRemarks: 'Account details received. Awaiting payment reference or UTR reconciliation.',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newRequest);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel-blue border-2 border-cyan-400/40 rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.25)] overflow-hidden my-6">
        
        {/* Neon green / cyan gradient top edge */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00D9FF] via-[#00FF88] to-[#00D9FF] shadow-[0_0_20px_#00D9FF]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-cyan-500/20 bg-black/40 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-black/60 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
              <PlatformLogo platform={service.platform} className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-[#00D9FF] font-bold tracking-wider block">
                STEP 02 OF 04 · CASE INTAKE
              </span>
              <h3 className="text-xl font-black text-white mt-0.5 tracking-tight">
                ENTER YOUR ACCOUNT DETAILS
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
            title="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zero Password Guarantee Ribbon */}
        <div className="px-6 py-2.5 bg-black/60 border-b border-cyan-500/20 text-xs text-slate-300 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
          <span>Authorized recovery assistance. We <strong>never</strong> ask for passwords or OTP codes.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-700 text-red-200 text-xs">
              {error}
            </div>
          )}

          {/* Service-Specific Status Simulation Banner */}
          <div className="p-3 rounded-2xl bg-black/60 border border-[#00FF41]/30 font-mono text-[10px] space-y-0.5 text-center shadow-inner">
            <div className="text-[#00FF41] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping" />
              <span>{service.title.toUpperCase()} MODULE</span>
            </div>
            <div className="text-slate-300">
              INITIALIZING REQUEST INTERFACE
            </div>
            <div className="text-cyan-300 font-bold">
              SECURE SESSION READY
            </div>
          </div>

          {/* Selected Service and Fixed Price above the input field */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                Selected Service
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {service.title}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                Fixed Charge
              </span>
              <span className="text-lg font-black font-mono text-[#00FF88] block">
                {service.currency}{service.price}
              </span>
            </div>
          </div>

          {/* ONLY ONE INPUT FIELD */}
          <div>
            <label className="block text-sm font-extrabold text-white mb-2">
              {service.inputLabel} <span className="text-[#00D9FF]">*</span>
            </label>
            <input
              type={service.isMobileNumber ? 'tel' : 'text'}
              required
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={service.inputPlaceholder}
              className="w-full px-4 py-3.5 rounded-xl bg-black/60 border-2 border-cyan-500/30 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#00FF88] focus:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
            />
          </div>

          {/* Action Buttons: Back, Cancel, Continue */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 text-sm font-extrabold text-black bg-[#00FF88] hover:bg-[#00FF88]/90 rounded-xl transition-all duration-200 cyber-glow-green-sm hover:shadow-[0_0_25px_rgba(0,255,136,0.6)] flex items-center gap-2 disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
