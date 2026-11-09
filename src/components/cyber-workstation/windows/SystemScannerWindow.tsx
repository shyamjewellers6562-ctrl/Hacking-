import React, { useState, useEffect } from 'react';

export const SystemScannerWindow: React.FC = () => {
  const [scanProgress, setScanProgress] = useState(64);
  const [currentPort, setCurrentPort] = useState(443);
  const [scannedCount, setScannedCount] = useState(1280);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanProgress((p) => (p >= 100 ? 0 : p + 2));
      setCurrentPort((port) => (port > 65500 ? 80 : port + Math.floor(Math.random() * 80 + 10)));
      setScannedCount((c) => c + Math.floor(Math.random() * 25 + 5));
    }, 600);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[10px] p-2.5 overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00FF41]/20">
        <div>
          <span className="font-bold text-xs text-white">SYSTEM RADAR SCANNER</span>
          <span className="text-slate-400 block text-[9px]">PORTS · ENDPOINTS · MEMORY</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-[#00FF88]/40 text-[#00FF88] text-[9px] font-bold">
          PROGRESS: {scanProgress}%
        </span>
      </div>

      {/* Radar Center and Stats */}
      <div className="flex-1 my-2 grid grid-cols-2 gap-2 items-center">
        {/* Animated Radar Circle */}
        <div className="relative aspect-square w-full max-w-[130px] mx-auto rounded-full border-2 border-[#00FF41]/40 bg-black/70 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.2)]">
          {/* Inner concentric rings */}
          <div className="absolute w-3/4 h-3/4 rounded-full border border-[#00FF41]/30" />
          <div className="absolute w-1/2 h-1/2 rounded-full border border-[#00FF41]/30" />
          <div className="absolute w-1/4 h-1/4 rounded-full border border-[#00FF41]/40" />

          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-[#00FF41]/30" />
          <div className="absolute h-full w-[1px] bg-[#00FF41]/30" />

          {/* Sweeping gradient beam */}
          <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none" style={{
            background: 'conic-gradient(from 0deg, rgba(0,255,65,0.4) 0deg, transparent 60deg, transparent 360deg)'
          }} />

          {/* Center blip */}
          <div className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />

          {/* Random target blips */}
          <div className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="absolute bottom-6 left-5 w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
        </div>

        {/* Scan Details */}
        <div className="space-y-1.5 text-[9px]">
          <div className="p-1.5 rounded bg-black/50 border border-[#00FF41]/20">
            <span className="text-slate-400 block">CURRENT PROBE:</span>
            <span className="text-[#00FF41] font-bold text-[10px]">PORT {currentPort}/TCP</span>
          </div>
          <div className="p-1.5 rounded bg-black/50 border border-[#00FF41]/20">
            <span className="text-slate-400 block">TOTAL ENDPOINTS:</span>
            <span className="text-cyan-300 font-bold text-[10px]">{scannedCount.toLocaleString()} SCANNED</span>
          </div>
          <div className="p-1.5 rounded bg-black/50 border border-[#00FF41]/20">
            <span className="text-slate-400 block">THREAT SEVERITY:</span>
            <span className="text-emerald-400 font-bold text-[10px]">0 CRITICAL (LOCKED)</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-1.5 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span className="text-[#00FF41]">HOST: AUTH_CLUSTER</span>
        <span>DAEMON: RUNNING</span>
      </div>
    </div>
  );
};
