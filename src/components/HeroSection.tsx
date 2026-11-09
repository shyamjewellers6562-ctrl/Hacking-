import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../data/servicesData';

interface HeroSectionProps {
  onExploreServices: () => void;
  onOpenTracking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreServices,
  onOpenTracking,
}) => {
  const cleanPhone = OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Vikas Hacker, I need professional account recovery assistance.'
  )}`;

  return (
    <section id="hero" className="relative pt-10 pb-20 overflow-hidden bg-transparent z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Website Content */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Small Kicker: "ADVANCED DIGITAL SECURITY" */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00FF41] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41]" />
              <span>ADVANCED DIGITAL SECURITY COMMAND</span>
            </div>

            {/* Main Heading: "RECOVER YOUR ACCOUNT. REGAIN YOUR ACCESS." */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance">
              RECOVER YOUR ACCOUNT. <br />
              <span className="text-[#00FF41] drop-shadow-[0_0_25px_rgba(0,255,65,0.4)]">
                REGAIN YOUR ACCESS.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
              Professional cybersecurity guidance and authorized social media account recovery assistance. Upfront fixed pricing with real-time incident tracking.
            </p>

            {/* Zero Password Security Notice */}
            <div className="p-4 rounded-2xl bg-black/40 border border-[#00FF88]/25 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-black/60 text-[#00FF41] shrink-0 mt-0.5 border border-[#00FF88]/30">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-white block mb-0.5">Strict Authorized Account-Owner Policy</span>
                  We will <strong className="text-[#00FF41]">never ask for your password, OTP, or secret recovery codes</strong>. All assistance follows verified platform escalation.
                </div>
              </div>
            </div>

            {/* Buttons: "Explore Services" and "Contact on WhatsApp" */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreServices}
                className="px-8 py-4 text-sm sm:text-base font-extrabold text-black bg-[#00FF41] hover:bg-[#00FF88] rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(0,255,65,0.5)] hover:shadow-[0_0_35px_rgba(0,255,65,0.8)] flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 text-xs sm:text-sm font-semibold text-emerald-300 hover:text-white bg-black/40 hover:bg-black/60 rounded-xl border border-emerald-500/40 hover:border-[#00FF41] transition-colors flex items-center gap-2 backdrop-blur-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#00FF41]" />
                <span>Contact on WhatsApp</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00FF41] shrink-0" />
                <span>Professional Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Secure Request Handling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00FF41] shrink-0" />
                <span>Transparent Pricing</span>
              </div>
            </div>

          </div>

          {/* Right Column: Large realistic photograph with smooth blend */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#00FF88]/30 bg-black/40 shadow-[0_0_40px_rgba(0,255,65,0.2)] group hover:border-[#00FF41] transition-all duration-500 backdrop-blur-sm">
              
              {/* Neon top rim */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00FF41] via-[#00D9FF] to-[#00FF41] z-20" />

              <div className="relative aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/3] overflow-hidden bg-black/60">
                <img
                  src="/src/assets/images/vikas_hacker_hero_1793643657362.jpg"
                  alt="Vikas Hacker - Cyber Security & Account Recovery Specialist"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Dark gradient blend into the website background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020704] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020704]/50 via-transparent to-transparent opacity-60" />

                {/* Cyber badge overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-200 bg-black/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#00FF88]/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41]" />
                    <span className="font-bold text-white tracking-wide">VIKAS HACKER — SecOps Lead</span>
                  </div>
                  <span className="text-[#00FF41] font-semibold">Active &amp; Ready</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
