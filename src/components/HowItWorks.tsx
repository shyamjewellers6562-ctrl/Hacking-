import React from 'react';
import { Layers, UserCheck, CreditCard, Search } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 'STEP 01',
      title: 'Choose Your Platform',
      desc: 'Select from our 7 authorized recovery services tailored to Instagram, WhatsApp, Facebook, Gmail, or Snapchat.',
      icon: Layers,
      color: 'text-[#00FF41]',
      borderColor: 'border-[#00FF41]/40',
    },
    {
      step: 'STEP 02',
      title: 'Enter Your Username',
      desc: 'Provide solely your account handle or mobile number. No passwords, OTPs, or recovery codes are ever requested.',
      icon: UserCheck,
      color: 'text-cyan-300',
      borderColor: 'border-cyan-400/40',
    },
    {
      step: 'STEP 03',
      title: 'Complete Service Payment',
      desc: 'Scan the UPI QR code or pay via verified UPI ID, then submit your genuine transaction reference (UTR number).',
      icon: CreditCard,
      color: 'text-[#00FF41]',
      borderColor: 'border-[#00FF41]/40',
    },
    {
      step: 'STEP 04',
      title: 'Track Your Request',
      desc: 'Use your unique Request ID to monitor real-time case progress, forensic updates, and administrative remarks.',
      icon: Search,
      color: 'text-cyan-300',
      borderColor: 'border-cyan-400/40',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00FF41] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping" />
            <span>STREAMLINED RESOLUTION WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            HOW IT <span className="text-[#00FF41] drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">WORKS</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our 4-step recovery pathway ensures maximum security, transparent fixed pricing, and immediate case tracking.
          </p>
        </div>

        {/* 4 Steps Grid: Transparent Glass Cards letting the Hacker Animation shine through */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-[#00FF88]/25 hover:border-[#00FF41] hover:bg-black/55 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.25)] hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-black text-[#00FF41] tracking-widest px-2.5 py-1 rounded bg-black/60 border border-[#00FF41]/30">
                      {item.step}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      0{index + 1} / 04
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-xl bg-black/60 border ${item.borderColor} ${item.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#00FF41] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>PHASE 0{index + 1}</span>
                  <span className="text-[#00FF41]">VERIFIED</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
