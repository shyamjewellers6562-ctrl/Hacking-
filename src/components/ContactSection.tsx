import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../data/servicesData';

export const ContactSection: React.FC = () => {
  const cleanPhone = OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Vikas Hacker, I need immediate assistance with account recovery.'
  )}`;

  return (
    <section id="contact" className="py-24 bg-transparent relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Sleek Translucent Cyber Card directly over the animated hacker background */}
        <div className="relative p-8 sm:p-14 rounded-3xl bg-black/50 backdrop-blur-md border-2 border-[#00FF41]/40 shadow-[0_0_50px_rgba(0,255,65,0.2)] space-y-6">
          
          <div className="w-16 h-16 rounded-2xl bg-black/60 border border-[#00FF41]/50 text-[#00FF41] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,255,65,0.35)]">
            <MessageSquare className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00FF41] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
              <span>DIRECT INCIDENT HOTLINE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              NEED ACCOUNT RECOVERY <span className="text-[#00FF41] drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">ASSISTANCE?</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
              Connect with our cybersecurity support team for professional account recovery guidance and case escalation.
            </p>
          </div>

          {/* WhatsApp Number Display */}
          <div className="py-3 px-6 rounded-2xl bg-black/70 border border-[#00FF88]/30 inline-block font-mono text-xl sm:text-2xl font-bold text-white shadow-inner">
            WhatsApp: <span className="text-[#00FF41]">{OFFICIAL_WHATSAPP_NUMBER}</span>
          </div>

          {/* Large glowing green WhatsApp button */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-base sm:text-lg font-black text-black bg-[#00FF41] hover:bg-[#00FF88] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,65,0.5)] hover:shadow-[0_0_40px_rgba(0,255,65,0.8)] transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-6 h-6" />
              <span>Connect on WhatsApp</span>
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>

          <div className="pt-4 text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FF41]" />
            <span>Authorized Account-Owner Assistance Only · Zero Passwords Required</span>
          </div>

        </div>

      </div>
    </section>
  );
};
