import React from 'react';
import { Minimize2, Maximize2, Eye, EyeOff } from 'lucide-react';

interface FullscreenControlsProps {
  isFullscreen: boolean;
  isPresentationMode: boolean;
  onExitFullscreen: () => void;
  onTogglePresentation: () => void;
}

export const FullscreenControls: React.FC<FullscreenControlsProps> = ({
  isFullscreen,
  isPresentationMode,
  onExitFullscreen,
  onTogglePresentation,
}) => {
  if (!isFullscreen && !isPresentationMode) return null;

  return (
    <aside
      aria-label="Fullscreen Controls"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-2 rounded-2xl bg-[#101713]/95 border-2 border-[#00FF88]/50 shadow-[0_0_30px_rgba(0,255,136,0.35)] backdrop-blur-md transition-all duration-300"
    >
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 text-[11px] font-mono text-[#00FF88] uppercase tracking-wider border-r border-slate-700">
        <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
        <span>{isFullscreen ? 'Browser Fullscreen Active' : 'Presentation Mode Active'}</span>
      </div>

      <button
        type="button"
        onClick={onTogglePresentation}
        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-300 hover:text-white transition-colors flex items-center gap-1.5 border border-slate-700"
        title="Toggle Distraction-Free Header/Footer Visibility"
      >
        {isPresentationMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span className="hidden md:inline">{isPresentationMode ? 'Show Navigation' : 'Hide Navigation'}</span>
      </button>

      <button
        type="button"
        onClick={onExitFullscreen}
        className="px-4 py-2 rounded-xl bg-[#00FF88] hover:bg-[#00FF88]/90 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,136,0.4)]"
      >
        <Minimize2 className="w-4 h-4" />
        <span>Exit Full Screen (ESC)</span>
      </button>
    </aside>
  );
};
