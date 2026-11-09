import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  isPresentationMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, isPresentationMode }) => {
  // If in distraction-free presentation mode, hide the footer
  if (isPresentationMode) {
    return null;
  }

  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-[#00FF88]/20 py-12 text-slate-400 text-xs transition-all duration-300 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo: VIKAS HACKER */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#101713] border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-wider uppercase">
                VIKAS <span className="text-[#00FF88]">HACKER</span>
              </span>
              {/* Text: "Your Digital Security Is Our Priority." */}
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Your Digital Security Is Our Priority.
              </p>
            </div>
          </div>

          {/* Admin Access Key */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={onOpenAdmin}
              className="text-slate-500 hover:text-[#00FF88] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-[#00FF88]/40"
            >
              <Lock className="w-3.5 h-3.5 text-[#00FF88]" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>

        {/* Copyright: © 2026 VIKAS HACKER. All Rights Reserved. */}
        <div className="pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div>
            &copy; 2026 VIKAS HACKER. All Rights Reserved.
          </div>
          <div>
            Authorized Account-Owner Recovery Assistance
          </div>
        </div>

      </div>
    </footer>
  );
};
