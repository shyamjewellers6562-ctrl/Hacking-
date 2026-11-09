import React, { useState, useEffect } from 'react';

interface FirewallRule {
  id: string;
  time: string;
  action: 'DROP' | 'ALLOW' | 'REJECT' | 'LIMIT';
  srcIp: string;
  port: number;
  reason: string;
}

const INITIAL_EVENTS: FirewallRule[] = [
  { id: '1', time: '14:20:12', action: 'DROP', srcIp: '185.220.101.5', port: 22, reason: 'SSH_BRUTE_FORCE' },
  { id: '2', time: '14:20:15', action: 'ALLOW', srcIp: '142.250.190.46', port: 443, reason: 'GOOGLE_AUTH_TLS' },
  { id: '3', time: '14:20:19', action: 'DROP', srcIp: '45.154.255.8', port: 8080, reason: 'UNAUTHORIZED_SCAN' },
  { id: '4', time: '14:20:24', action: 'LIMIT', srcIp: '198.51.100.14', port: 443, reason: 'RATE_LIMIT_EXCEEDED' },
  { id: '5', time: '14:20:28', action: 'ALLOW', srcIp: '157.240.22.35', port: 443, reason: 'INSTAGRAM_GRAPH_API' },
];

export const FirewallMonitorWindow: React.FC = () => {
  const [events, setEvents] = useState<FirewallRule[]>(INITIAL_EVENTS);
  const [blockedTotal, setBlockedTotal] = useState(384);

  useEffect(() => {
    const reasons = [
      { action: 'DROP' as const, port: 23, reason: 'TELNET_PROBE_BLOCKED' },
      { action: 'DROP' as const, port: 3389, reason: 'RDP_SCAN_DEFLECTED' },
      { action: 'ALLOW' as const, port: 443, reason: 'UPI_WEBHOOK_ACK' },
      { action: 'DROP' as const, port: 80, reason: 'INSECURE_HTTP_REDIRECT' },
      { action: 'LIMIT' as const, port: 443, reason: 'DOS_MITIGATION_PASS' },
    ];

    const timer = setInterval(() => {
      const pick = reasons[Math.floor(Math.random() * reasons.length)];
      const randomIp = `${Math.floor(Math.random() * 200 + 20)}.${Math.floor(
        Math.random() * 255
      )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });

      const newEv: FirewallRule = {
        id: Math.random().toString(),
        time: timeStr,
        action: pick.action,
        srcIp: randomIp,
        port: pick.port,
        reason: pick.reason,
      };

      if (pick.action === 'DROP') {
        setBlockedTotal((b) => b + 1);
      }

      setEvents((prev) => [newEv, ...prev.slice(0, 7)]);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[10px] p-2.5 overflow-hidden">
      {/* Status banner */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00FF41]/20">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
          <span className="font-bold text-xs text-white">FIREWALL SHIELD: ACTIVE</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-[#00FF88]/40 text-[#00FF88] text-[9px] font-bold">
          IPTABLES v1.8.9
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 my-2">
        <div className="bg-black/50 p-2 rounded border border-[#00FF41]/20 flex justify-between items-center">
          <span className="text-slate-400 text-[9px]">ATTACKS BLOCKED:</span>
          <span className="text-red-400 font-bold text-xs">{blockedTotal}</span>
        </div>
        <div className="bg-black/50 p-2 rounded border border-[#00FF41]/20 flex justify-between items-center">
          <span className="text-slate-400 text-[9px]">ACTIVE RULES:</span>
          <span className="text-cyan-300 font-bold text-xs">1,842</span>
        </div>
      </div>

      {/* Stream Table */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 rounded bg-black/40 border border-[#00FF41]/15 p-2">
        <div className="text-[9px] font-bold text-slate-400 grid grid-cols-12 pb-1 border-b border-[#00FF41]/20">
          <span className="col-span-2">TIME</span>
          <span className="col-span-2">ACTION</span>
          <span className="col-span-4">SOURCE IP</span>
          <span className="col-span-4">REASON</span>
        </div>
        {events.map((ev) => (
          <div key={ev.id} className="grid grid-cols-12 items-center text-[9px] py-0.5 font-mono">
            <span className="col-span-2 text-slate-400">{ev.time}</span>
            <span
              className={`col-span-2 font-bold ${
                ev.action === 'DROP'
                  ? 'text-red-400'
                  : ev.action === 'ALLOW'
                  ? 'text-[#00FF41]'
                  : 'text-amber-400'
              }`}
            >
              {ev.action}
            </span>
            <span className="col-span-4 text-slate-300 truncate">{ev.srcIp}:{ev.port}</span>
            <span className="col-span-4 text-emerald-300 truncate">{ev.reason}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span>DDOS FILTER: MAXIMUM</span>
        <span className="text-[#00FF41]">ZERO UNRESOLVED THREATS</span>
      </div>
    </div>
  );
};
