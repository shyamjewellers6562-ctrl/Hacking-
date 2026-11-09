import React, { useState, useEffect } from 'react';

const STATS = [
  { platform: 'Instagram Recovery', count: 482, percent: 94, color: '#00FF41' },
  { platform: 'Suspended Instagram', count: 320, percent: 91, color: '#00D9FF' },
  { platform: 'WhatsApp Assistance', count: 290, percent: 98, color: '#00FF88' },
  { platform: 'Gmail Recovery', count: 210, percent: 89, color: '#38bdf8' },
  { platform: 'Facebook & Snapchat', count: 185, percent: 92, color: '#a7f3d0' },
];

export const SecurityAnalyticsWindow: React.FC = () => {
  const [totalResolved, setTotalResolved] = useState(1487);
  const [liveSuccessRate, setLiveSuccessRate] = useState(94.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalResolved((t) => t + 1);
      setLiveSuccessRate(+(94.5 + Math.random() * 0.6).toFixed(1));
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[10px] p-2.5 overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00FF41]/20">
        <div>
          <span className="font-bold text-xs text-white">INCIDENT RESOLUTION METRICS</span>
          <span className="text-slate-400 block text-[9px]">REAL-TIME RECOVERY ANALYTICS</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-[#00FF88]/40 text-[#00FF88] text-[9px] font-bold">
          {liveSuccessRate}% SUCCESS
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2 my-2">
        <div className="bg-black/50 p-2 rounded border border-[#00FF41]/20">
          <span className="text-slate-400 block text-[9px]">CASES DISPATCHED</span>
          <span className="text-white font-bold text-sm font-mono mt-0.5 block">
            {totalResolved.toLocaleString()}
          </span>
        </div>
        <div className="bg-black/50 p-2 rounded border border-[#00FF41]/20">
          <span className="text-slate-400 block text-[9px]">INITIAL REVIEW</span>
          <span className="text-cyan-300 font-bold text-sm font-mono mt-0.5 block">
            &lt; 5 MIN AVG
          </span>
        </div>
      </div>

      {/* Animated Platform Bar Breakdown */}
      <div className="flex-1 my-1 p-2 rounded bg-black/40 border border-[#00FF41]/15 space-y-2 overflow-y-auto">
        <span className="text-slate-400 text-[9px] block">PLATFORM RECOVERY EFFICIENCY</span>
        {STATS.map((s, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-200">{s.platform}</span>
              <span className="font-bold" style={{ color: s.color }}>
                {s.percent}% ({s.count})
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${s.percent}%`,
                  backgroundColor: s.color,
                  boxShadow: `0 0 8px ${s.color}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-1.5 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span className="text-[#00FF88]">DATABASE: SYNCED</span>
        <span>SECURITY LEVEL: MAXIMUM</span>
      </div>
    </div>
  );
};
