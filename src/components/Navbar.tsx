import React, { useState } from 'react';
import {
  Shield,
  Maximize2,
  Minimize2,
  Lock,
  Menu,
  X,
  ArrowRight,
  Search,
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onGetStarted: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isPresentationMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenTracking,
  onOpenAdmin,
  onGetStarted,
  isFullscreen,
  onToggleFullscreen,
  isPresentationMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isPresentationMode) {
    return null;
  }

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/50 backdrop-blur-md border-b border-[#00FF88]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Brand Logo & Wordmark */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-black/60 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.3)] group-hover:border-[#00FF41] transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white uppercase block leading-none">
                VIKAS <span className="text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]">HACKER</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 font-mono uppercase block mt-1">
                YOUR DIGITAL SECURITY IS OUR PRIORITY
              </span>
            </div>
          </button>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-300">
            <button
              onClick={() => handleNavClick('hero')}
              className="hover:text-[#00FF41] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="hover:text-[#00FF41] transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-[#00FF41] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="hover:text-[#00FF41] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-[#00FF41] transition-colors"
            >
              Contact
            </button>
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Case</span>
            </button>
          </nav>

          {/* Action Zone: FULL SCREEN Button, Glowing "Get Started", Admin */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Dedicated FULL SCREEN Button */}
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold text-cyan-300 hover:text-white bg-black/60 hover:bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,217,255,0.2)]"
              title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">EXIT FULL SCREEN</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                  <span>FULL SCREEN</span>
                </>
              )}
            </button>

            {/* Glowing Green "Get Started" Button */}
            <button
              onClick={onGetStarted}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-black bg-[#00FF41] hover:bg-[#00FF88] transition-all cyber-glow-green-sm hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Admin Keyhole */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className="p-2 text-slate-400 hover:text-[#00FF41] rounded-xl hover:bg-slate-800/80 transition-colors border border-slate-800"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/90 backdrop-blur-md border-b border-[#00FF88]/30 px-5 pt-4 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('hero')}
            className="w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#00FF41]"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className="w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#00FF41]"
          >
            Services &amp; Pricing
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#00FF41]"
          >
            About VIKAS HACKER
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#00FF41]"
          >
            How It Works (4 Steps)
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#00FF41]"
          >
            Contact on WhatsApp
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracking();
            }}
            className="w-full text-left py-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Case by Request ID</span>
          </button>
        </div>
      )}
    </header>
  );
};
