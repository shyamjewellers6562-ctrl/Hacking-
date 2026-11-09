import React from 'react';
import { ShieldCheck, MessageSquare, DollarSign, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00FF41] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping" />
            <span>BRAND REPUTATION &amp; STANDARDS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            ABOUT <span className="text-[#00FF41] drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">VIKAS HACKER</span>
          </h2>
          <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            <p>
              VIKAS HACKER is a digital security and authorized account recovery assistance brand focused on helping users regain access through legitimate platform escalations.
            </p>
            <p>
              We provide transparent upfront pricing, professional ethical assistance, and secure communication without requesting passwords or private credentials.
            </p>
          </div>
        </div>

        {/* 3 Transparent Glass Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Professional Assistance */}
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-[#00FF88]/25 hover:border-[#00FF41] hover:bg-black/55 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.25)] hover:-translate-y-1 group space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-black/60 border border-[#00FF41]/40 text-[#00FF41] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.3)] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#00FF41] transition-colors">
              1. Professional Assistance
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Legitimate, certified ethical guidance rooted in direct provider escalation channels, identity verification protocols, and structured recovery appeals.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00FF41]">
              <CheckCircle className="w-4 h-4" />
              <span>Certified Methodologies</span>
            </div>
          </div>

          {/* Card 2: Secure Communication */}
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-[#00FF88]/25 hover:border-[#00FF41] hover:bg-black/55 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.25)] hover:-translate-y-1 group space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-black/60 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.3)] group-hover:scale-105 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              2. Secure Communication
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Strict zero-credential confidentiality. We never ask for account passwords, OTP codes, or secret keys. All correspondence is encrypted and private.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-cyan-400">
              <CheckCircle className="w-4 h-4" />
              <span>Encrypted Triage</span>
            </div>
          </div>

          {/* Card 3: Transparent Pricing */}
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-[#00FF88]/25 hover:border-[#00FF41] hover:bg-black/55 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.25)] hover:-translate-y-1 group space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-black/60 border border-[#00FF41]/40 text-[#00FF41] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.3)] group-hover:scale-105 transition-transform">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#00FF41] transition-colors">
              3. Transparent Pricing
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Clear, fixed pricing clearly displayed up front before placing any case. No hidden fees, unexpected surcharges, or post-recovery demands.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00FF41]">
              <CheckCircle className="w-4 h-4" />
              <span>Clear Fixed Rates</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
