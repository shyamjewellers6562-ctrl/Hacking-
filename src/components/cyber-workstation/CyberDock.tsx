import React, { useState, useEffect } from 'react';
import { CyberAppId, CyberWindowState } from './types';
import {
  Terminal,
  Activity,
  Shield,
  KeyRound,
  Server,
  Radar,
  Globe2,
  Code2,
  BarChart3,
  Binary,
  Monitor,
  LayoutGrid,
  RotateCcw,
} from 'lucide-react';

interface CyberDockProps {
  windows: Record<CyberAppId, CyberWindowState>;
  activeWindowId: CyberAppId | null;
  onToggleWindow: (id: CyberAppId) => void;
  onTileWindows: () => void;
  isDesktopFocusMode: boolean;
  onToggleDesktopFocus: () => void;
}

interface AppIconDef {
  id: CyberAppId;
  label: string;
  icon: React.ReactNode;
}

const APPS: AppIconDef[] = [
  { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-4 h-4" /> },
  { id: 'network', label: 'Network', icon: <Activity className="w-4 h-4" /> },
  { id: 'firewall', label: 'Firewall', icon: <Shield className="w-4 h-4" /> },
  { id: 'scanner', label: 'Scanner', icon: <Radar className="w-4 h-4" /> },
  { id: 'server', label: 'Server', icon: <Server className="w-4 h-4" /> },
  { id: 'encryption', label: 'Crypto', icon: <KeyRound className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'map', label: 'World Map', icon: <Globe2 className="w-4 h-4" /> },
  { id: 'code', label: 'Code', icon: <Code2 className="w-4 h-4" /> },
  { id: 'datastream', label: 'Stream', icon: <Binary className="w-4 h-4" /> },
];

export const CyberDock: React.FC<CyberDockProps> = ({
  windows,
  activeWindowId,
  onToggleWindow,
  onTileWindows,
  isDesktopFocusMode,
  onToggleDesktopFocus,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-40 max-w-[96vw] select-none">
      <div className="cyber-dock px-3 py-1.5 rounded-2xl flex items-center gap-1 sm:gap-2 shadow-2xl border border-[#00FF41]/40">
        
        {/* Left: View Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleDesktopFocus}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 ${
            isDesktopFocusMode
              ? 'bg-[#00FF41] text-black shadow-[0_0_15px_rgba(0,255,65,0.6)]'
              : 'bg-black/60 text-[#00FF41] hover:bg-black/80 border border-[#00FF41]/40'
          }`}
          title={isDesktopFocusMode ? 'Switch to Website Mode' : 'Switch to Cyber Desktop Mode'}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {isDesktopFocusMode ? 'WEBSITE VIEW' : 'COMMAND CENTER'}
          </span>
        </button>

        {/* Tile / Reset Layout Button */}
        <button
          type="button"
          onClick={onTileWindows}
          className="p-1.5 rounded-xl bg-black/60 text-[#00FF41] hover:bg-black/80 border border-[#00FF41]/30 transition-colors shrink-0"
          title="Tile / Reset Windows"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>

        <div className="h-5 w-[1px] bg-[#00FF41]/30 mx-1 hidden sm:block" />

        {/* Center: App Icons */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[50vw] sm:max-w-none">
          {APPS.map((app) => {
            const win = windows[app.id];
            const isOpen = win?.isOpen && !win?.isMinimized;
            const isActive = activeWindowId === app.id && isOpen;

            return (
              <button
                key={app.id}
                type="button"
                onClick={() => onToggleWindow(app.id)}
                className={`group relative p-2 rounded-xl transition-all flex flex-col items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41] shadow-[0_0_12px_rgba(0,255,65,0.4)]'
                    : isOpen
                    ? 'bg-black/60 text-[#00FF88] border border-[#00FF88]/40'
                    : 'text-slate-400 hover:text-[#00FF41] hover:bg-black/40'
                }`}
                title={app.label}
              >
                {app.icon}

                {/* Dot under active / running app */}
                {isOpen && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#00FF41] shadow-[0_0_6px_#00FF41]" />
                )}

                {/* Tooltip on hover */}
                <span className="absolute -top-7 hidden group-hover:block bg-black/90 text-[#00FF41] font-mono text-[9px] px-1.5 py-0.5 rounded border border-[#00FF41]/40 whitespace-nowrap z-50">
                  {app.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="h-5 w-[1px] bg-[#00FF41]/30 mx-1 hidden sm:block" />

        {/* Right: Live Clock & System Telemetry */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#00FF41] px-2 shrink-0">
          <div className="text-right">
            <span className="font-bold text-xs tracking-wider block">{timeStr}</span>
            <span className="text-[9px] text-slate-400 block">{dateStr} · IST</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping" />
        </div>

      </div>
    </div>
  );
};
