import React from 'react';
import { ServiceItem } from '../types';
import { Instagram, MessageCircle, Facebook, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

export const PlatformLogo: React.FC<{ platform: string; className?: string }> = ({
  platform,
  className = 'w-7 h-7',
}) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className={`${className} text-pink-400`} />;
    case 'whatsapp':
      return <MessageCircle className={`${className} text-[#00FF88]`} />;
    case 'facebook':
      return <Facebook className={`${className} text-blue-400`} />;
    case 'gmail':
      return <Mail className={`${className} text-red-400`} />;
    case 'snapchat':
      return (
        <svg className={`${className} text-yellow-400 fill-current`} viewBox="0 0 24 24">
          <path d="M12 2c3.5 0 6 2.3 6 5.8 0 1.2-.2 2.3-.5 3.3.4.2 1 .3 1.5.3.6 0 1.1-.3 1.2-.8.1-.3.4-.4.7-.3.3.1.5.4.4.8-.3 1.2-1.3 1.8-2.3 1.8-.2 0-.4 0-.6-.1-.3.7-.8 1.4-1.4 1.9.4.4 1 .8 1.7 1 .4.1.7.5.7.9 0 .4-.3.8-.7.9-.6.2-1.2.3-1.8.3-.4 0-.8-.1-1.2-.2-.5 1-1.6 1.7-2.9 1.8-.2.3-.6.5-1.1.5s-.9-.2-1.1-.5c-1.3-.1-2.4-.8-2.9-1.8-.4.1-.8.2-1.2.2-.6 0-1.2-.1-1.8-.3-.4-.1-.7-.5-.7-.9 0-.4.3-.8.7-.9.7-.2 1.3-.6 1.7-1-.6-.5-1.1-1.2-1.4-1.9-.2.1-.4.1-.6.1-1 0-2-.6-2.3-1.8-.1-.4.1-.7.4-.8.3-.1.6 0 .7.3.1.5.6.8 1.2.8.5 0 1.1-.1 1.5-.3-.3-1-.5-2.1-.5-3.3C6 4.3 8.5 2 12 2z" />
        </svg>
      );
    default:
      return <ShieldCheck className={`${className} text-[#00FF88]`} />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
}) => {
  return (
    <section id="services" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Clean typography directly on background, no opaque boxes */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00FF41] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping" />
            <span>OFFICIAL RECOVERY PATHWAYS</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            CHOOSE YOUR <span className="text-[#00FF41] drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]">RECOVERY SERVICE</span>
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Authorized assistance for social media account recovery. Select your service with upfront, fixed pricing.
          </p>
        </div>

        {/* 7 Services Grid: Transparent Glass Cards letting the Hacker Animation shine through */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative rounded-2xl bg-black/40 backdrop-blur-md border border-[#00FF88]/25 hover:border-[#00FF41] hover:bg-black/60 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-[0_0_35px_rgba(0,255,65,0.25)] hover:-translate-y-1"
            >
              {/* Subtle neon accent line on top of card */}
              <div className="absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#00FF41] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              <div>
                {/* Platform logo + index tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-black/60 border border-[#00FF88]/30 flex items-center justify-center p-2.5 group-hover:border-[#00FF41] transition-colors shadow-inner">
                    <PlatformLogo platform={service.platform} className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono text-[#00FF41]/70 uppercase tracking-widest">
                    PATH 0{index + 1}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-[#00FF41] transition-colors leading-snug">
                  {service.title}
                </h3>

                {/* Short Professional Description */}
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[2.5rem]">
                  {service.description}
                </p>
              </div>

              {/* Fixed Price & Continue Button */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                    Fixed Price
                  </span>
                  <span className="text-2xl font-black font-mono text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)] tabular-nums">
                    {service.currency}{service.price}
                  </span>
                </div>

                <button
                  onClick={() => onSelectService(service)}
                  className="px-6 py-3 text-xs sm:text-sm font-extrabold text-black bg-[#00FF41] hover:bg-[#00FF88] rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(0,255,65,0.4)] hover:shadow-[0_0_25px_rgba(0,255,65,0.7)] flex items-center gap-1.5 shrink-0 transform hover:scale-102"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
