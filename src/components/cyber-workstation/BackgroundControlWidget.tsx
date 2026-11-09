import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Play,
  Pause,
  Minimize2,
  Maximize2,
  Sliders,
  ChevronUp,
  ChevronDown,
  Activity,
} from 'lucide-react';

interface BackgroundControlWidgetProps {
  isVisible: boolean;
  isPaused: boolean;
  isCollapsed: boolean;
  activeAppCount: number;
  onToggleVisibility: () => void;
  onTogglePause: () => void;
  onToggleCollapse: () => void;
}

export const BackgroundControlWidget: React.FC<BackgroundControlWidgetProps> = ({
  isVisible,
  isPaused,
  isCollapsed,
  activeAppCount,
  onToggleVisibility,
  onTogglePause,
  onToggleCollapse,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      aria-label="Cyber Background Workstation Controls"
      className="fixed bottom-4 right-4 z-40 select-none font-mono"
    >
      <div className="rounded-2xl bg-[#020b05]/90 border border-[#00FF41]/40 shadow-[0_0_25px_rgba(0,255,65,0.2)] backdrop-blur-md overflow-hidden transition-all">
        
        {/* Toggle Pill Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3.5 py-2 flex items-center gap-2.5 cursor-pointer hover:bg-black/40 transition-colors"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              !isVisible
                ? 'bg-slate-500'
                : isPaused
                ? 'bg-amber-400'
                : 'bg-[#00FF41] animate-ping'
            }`}
          />
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00FF41]">
            <Activity className="w-3.5 h-3.5" />
            <span className="tracking-wider">
              WORKSTATION:{' '}
              {!isVisible ? 'OFF' : isPaused ? 'PAUSED' : `${activeAppCount} APPS`}
            </span>
          </div>

          <button
            type="button"
            className="text-[#00FF41]/70 hover:text-[#00FF41] ml-1 p-0.5"
            aria-label={isExpanded ? 'Collapse controls' : 'Expand controls'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Control Panel */}
        {isExpanded && (
          <div className="p-3 border-t border-[#00FF41]/25 bg-black/60 space-y-2 text-[11px]">
            {/* 1. Visibility Button */}
            <button
              type="button"
              onClick={onToggleVisibility}
              className={`w-full px-3 py-2 rounded-xl flex items-center justify-between font-bold transition-all ${
                isVisible
                  ? 'bg-black/60 text-slate-300 hover:text-white border border-[#00FF41]/30 hover:border-[#00FF41]'
                  : 'bg-[#00FF41] text-black shadow-[0_0_15px_rgba(0,255,65,0.4)]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isVisible ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isVisible ? 'HIDE BACKGROUND' : 'SHOW BACKGROUND'}</span>
              </div>
              <span className="text-[9px] opacity-70">{isVisible ? 'ACTIVE' : 'HIDDEN'}</span>
            </button>

            {/* 2. Pause / Resume Button */}
            <button
              type="button"
              onClick={onTogglePause}
              disabled={!isVisible}
              className={`w-full px-3 py-2 rounded-xl flex items-center justify-between font-bold transition-all disabled:opacity-40 ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                  : 'bg-black/60 text-slate-300 hover:text-white border border-[#00FF41]/30 hover:border-[#00FF41]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'RESUME ANIMATION' : 'PAUSE ANIMATION'}</span>
              </div>
              <span className="text-[9px] opacity-70">{isPaused ? 'PAUSED' : 'AUTO'}</span>
            </button>

            {/* 3. Collapse / Restore Windows */}
            <button
              type="button"
              onClick={onToggleCollapse}
              disabled={!isVisible}
              className={`w-full px-3 py-2 rounded-xl flex items-center justify-between font-bold transition-all disabled:opacity-40 ${
                isCollapsed
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'bg-black/60 text-slate-300 hover:text-white border border-[#00FF41]/30 hover:border-[#00FF41]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                <span>{isCollapsed ? 'RESTORE WINDOWS' : 'COLLAPSE WINDOWS'}</span>
              </div>
              <span className="text-[9px] opacity-70">{isCollapsed ? 'MINIMIZED' : 'TILED'}</span>
            </button>

            <div className="pt-1 text-[9px] text-slate-400 text-center font-mono border-t border-white/10">
              Auto-Scheduler Active · 60 FPS
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
