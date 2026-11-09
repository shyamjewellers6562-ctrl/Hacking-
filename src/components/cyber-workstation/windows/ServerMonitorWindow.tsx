import React, { useState, useEffect } from 'react';

export const ServerMonitorWindow: React.FC = () => {
  const [cpu, setCpu] = useState(24);
  const [ram, setRam] = useState(4.3);
  const [cpuHistory, setCpuHistory] = useState<number[]>([18, 22, 28, 24, 30, 26, 21, 25, 29, 23, 27]);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextCpu = Math.floor(Math.random() * 22 + 16);
      setCpu(nextCpu);
      setRam(+(4.1 + Math.random() * 0.5).toFixed(1));
      setCpuHistory((prev) => [...prev.slice(-14), nextCpu]);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Compute SVG polyline points for graph
  const points = cpuHistory
    .map((val, idx) => {
      const x = (idx / (cpuHistory.length - 1)) * 100;
      const y = 100 - (val / 60) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[10px] p-2.5 overflow-hidden">
      {/* Top metrics */}
      <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#00FF41]/20 text-center">
        <div className="bg-black/50 p-1.5 rounded border border-[#00FF41]/20">
          <span className="text-slate-400 block text-[9px]">CPU LOAD</span>
          <span className="text-[#00FF41] font-bold text-xs">{cpu}%</span>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-[#00FF41]/20">
          <span className="text-slate-400 block text-[9px]">RAM USAGE</span>
          <span className="text-cyan-300 font-bold text-xs">{ram} / 16 GB</span>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-[#00FF41]/20">
          <span className="text-slate-400 block text-[9px]">SERVER UPTIME</span>
          <span className="text-emerald-300 font-bold text-xs">99.98%</span>
        </div>
      </div>

      {/* Real-time SVG Performance Graph */}
      <div className="flex-1 my-2 rounded bg-black/50 border border-[#00FF41]/15 p-2 flex flex-col">
        <div className="flex justify-between items-center text-[9px] mb-1">
          <span className="text-slate-400">TELEMETRY SPARKLINE (60Hz)</span>
          <span className="text-[#00FF88] font-bold">NODE: IN-DEL-01</span>
        </div>

        <div className="flex-1 relative w-full overflow-hidden border border-[#00FF41]/20 rounded bg-black/60">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 grid grid-rows-3 grid-cols-4 pointer-events-none opacity-20">
            <div className="border-b border-r border-[#00FF41]" />
            <div className="border-b border-r border-[#00FF41]" />
            <div className="border-b border-r border-[#00FF41]" />
            <div className="border-b border-[#00FF41]" />
            <div className="border-b border-r border-[#00FF41]" />
            <div className="border-b border-r border-[#00FF41]" />
            <div className="border-b border-r border-[#00FF41]" />
            <div className="border-b border-[#00FF41]" />
          </div>

          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#00FF41"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {/* Gradient area under polyline */}
            <polygon
              fill="rgba(0, 255, 65, 0.12)"
              points={`0,100 ${points} 100,100`}
            />
          </svg>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-1.5 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span className="flex items-center gap-1 text-[#00FF41]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse inline-block" />
          SYSTEM TEMP: 41°C [NOMINAL]
        </span>
        <span>SWAP: 0%</span>
        <span className="text-cyan-300 font-mono">IOPS: 18.2K</span>
      </div>
    </div>
  );
};
