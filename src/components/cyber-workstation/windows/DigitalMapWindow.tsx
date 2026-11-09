import React, { useState, useEffect } from 'react';

interface CityPoint {
  name: string;
  x: number; // percentage
  y: number;
  ip: string;
  ping: number;
}

const CITIES: CityPoint[] = [
  { name: 'DELHI (HQ)', x: 68, y: 46, ip: '10.0.1.0', ping: 4 },
  { name: 'SINGAPORE', x: 77, y: 60, ip: '10.0.4.0', ping: 22 },
  { name: 'FRANKFURT', x: 50, y: 32, ip: '10.0.8.0', ping: 38 },
  { name: 'LONDON', x: 45, y: 28, ip: '10.0.9.0', ping: 44 },
  { name: 'SAN JOSE', x: 20, y: 38, ip: '10.0.12.0', ping: 82 },
  { name: 'TOKYO', x: 86, y: 40, ip: '10.0.15.0', ping: 48 },
];

export const DigitalMapWindow: React.FC = () => {
  const [activeCity, setActiveCity] = useState<CityPoint>(CITIES[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      const pick = CITIES[Math.floor(Math.random() * CITIES.length)];
      setActiveCity(pick);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[10px] p-2.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#00FF41]/20">
        <div>
          <span className="font-bold text-xs text-white">GLOBAL CYBER TOPOLOGY</span>
          <span className="text-slate-400 block text-[9px]">ENCRYPTED ROUTING MESH</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-[#00FF88]/40 text-[#00FF88] text-[9px] font-bold">
          LATENCY: {activeCity.ping}ms
        </span>
      </div>

      {/* Stylized Vector World Map Container */}
      <div className="flex-1 my-2 relative rounded bg-black/60 border border-[#00FF41]/20 overflow-hidden flex items-center justify-center">
        {/* Subtle coordinate grid lines */}
        <div className="absolute inset-0 cyber-grid-pattern opacity-40 pointer-events-none" />

        {/* Simplified Vector Continents SVG */}
        <svg
          viewBox="0 0 100 60"
          className="w-full h-full opacity-60 text-emerald-900"
          preserveAspectRatio="none"
        >
          {/* North America */}
          <path
            d="M 12 12 Q 22 8 28 15 Q 32 25 24 35 Q 16 36 12 28 Z"
            fill="rgba(0, 255, 65, 0.08)"
            stroke="rgba(0, 255, 65, 0.25)"
            strokeWidth="0.5"
          />
          {/* South America */}
          <path
            d="M 26 38 Q 34 40 32 50 Q 28 58 24 54 Q 22 45 26 38 Z"
            fill="rgba(0, 255, 65, 0.08)"
            stroke="rgba(0, 255, 65, 0.25)"
            strokeWidth="0.5"
          />
          {/* Europe */}
          <path
            d="M 44 14 Q 56 12 58 22 Q 50 28 44 24 Z"
            fill="rgba(0, 255, 65, 0.08)"
            stroke="rgba(0, 255, 65, 0.25)"
            strokeWidth="0.5"
          />
          {/* Africa */}
          <path
            d="M 46 28 Q 58 30 54 46 Q 48 50 44 40 Z"
            fill="rgba(0, 255, 65, 0.08)"
            stroke="rgba(0, 255, 65, 0.25)"
            strokeWidth="0.5"
          />
          {/* Asia */}
          <path
            d="M 60 12 Q 88 10 88 32 Q 74 46 64 34 Q 60 22 60 12 Z"
            fill="rgba(0, 255, 65, 0.08)"
            stroke="rgba(0, 255, 65, 0.25)"
            strokeWidth="0.5"
          />
          {/* Australia */}
          <path
            d="M 78 44 Q 88 44 86 52 Q 78 54 78 44 Z"
            fill="rgba(0, 255, 65, 0.08)"
            stroke="rgba(0, 255, 65, 0.25)"
            strokeWidth="0.5"
          />

          {/* Arcs connecting New Delhi to other hubs */}
          {CITIES.slice(1).map((c, i) => (
            <path
              key={i}
              d={`M 68 28 Q ${(68 + c.x) / 2} ${(28 + c.y * 0.6) / 2 - 5} ${c.x} ${c.y * 0.6}`}
              fill="none"
              stroke="rgba(0, 255, 136, 0.35)"
              strokeWidth="0.6"
              strokeDasharray="2,2"
            />
          ))}
        </svg>

        {/* City Node Points */}
        {CITIES.map((c, idx) => {
          const isSelected = activeCity.name === c.name;
          return (
            <div
              key={idx}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              onClick={() => setActiveCity(c)}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  isSelected
                    ? 'bg-[#00FF41] shadow-[0_0_10px_#00FF41] scale-150'
                    : 'bg-emerald-500/70'
                }`}
              />
              <span
                className={`absolute left-3 top-[-4px] text-[8px] font-mono whitespace-nowrap px-1 rounded bg-black/80 border ${
                  isSelected
                    ? 'border-[#00FF41] text-[#00FF41]'
                    : 'border-emerald-900/60 text-slate-400'
                }`}
              >
                {c.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Node Telemetry Strip */}
      <div className="pt-1.5 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span>ACTIVE TARGET: <strong className="text-white">{activeCity.name}</strong></span>
        <span>IP: <strong className="text-cyan-300">{activeCity.ip}</strong></span>
        <span className="text-[#00FF88]">ROUTED VIA HQ</span>
      </div>
    </div>
  );
};
