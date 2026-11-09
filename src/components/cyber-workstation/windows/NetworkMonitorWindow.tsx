import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  name: string;
  ip: string;
  x: number;
  y: number;
  ping: number;
  status: 'ONLINE' | 'ACTIVE' | 'SYNC';
}

const NODES: Node[] = [
  { id: '1', name: 'GATEWAY_CORE', ip: '10.0.1.1', x: 20, y: 30, ping: 12, status: 'ONLINE' },
  { id: '2', name: 'AUTH_CLUSTER', ip: '10.0.2.14', x: 75, y: 25, ping: 16, status: 'ACTIVE' },
  { id: '3', name: 'RECOVERY_NODE_A', ip: '10.0.3.8', x: 45, y: 65, ping: 8, status: 'SYNC' },
  { id: '4', name: 'DATABASE_RELAY', ip: '10.0.4.99', x: 15, y: 80, ping: 14, status: 'ONLINE' },
  { id: '5', name: 'UPI_GATEWAY_PROXY', ip: '172.16.8.2', x: 80, y: 75, ping: 19, status: 'ACTIVE' },
];

export const NetworkMonitorWindow: React.FC = () => {
  const [packetCount, setPacketCount] = useState(14820);
  const [bandwidth, setBandwidth] = useState(124.6);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((p) => p + Math.floor(Math.random() * 8 + 4));
      setBandwidth(+(110 + Math.random() * 35).toFixed(1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Canvas animated moving data packets between nodes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const packets = [
      { from: 0, to: 1, progress: 0.1, speed: 0.015 },
      { from: 1, to: 2, progress: 0.5, speed: 0.018 },
      { from: 2, to: 3, progress: 0.8, speed: 0.012 },
      { from: 2, to: 4, progress: 0.3, speed: 0.016 },
      { from: 0, to: 2, progress: 0.6, speed: 0.014 },
    ];

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 320);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 200);

      ctx.clearRect(0, 0, w, h);

      // Node coordinate mapping
      const mapped = NODES.map((n) => ({
        ...n,
        x: (n.x / 100) * w,
        y: (n.y / 100) * h,
      }));

      // Draw connection lines
      ctx.lineWidth = 1;
      for (let i = 0; i < mapped.length; i++) {
        for (let j = i + 1; j < mapped.length; j++) {
          ctx.beginPath();
          ctx.moveTo(mapped[i].x, mapped[i].y);
          ctx.lineTo(mapped[j].x, mapped[j].y);
          ctx.strokeStyle = 'rgba(0, 255, 65, 0.18)';
          ctx.stroke();
        }
      }

      // Draw moving packets
      for (const p of packets) {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;

        const p1 = mapped[p.from];
        const p2 = mapped[p.to];
        const px = p1.x + (p2.x - p1.x) * p.progress;
        const py = p1.y + (p2.y - p1.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF41';
        ctx.shadowColor = '#00FF41';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw node points
      for (const node of mapped) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF88';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 255, 65, 0.75)';
        ctx.font = '9px monospace';
        ctx.fillText(node.name, node.x - 25, node.y - 10);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[10px] p-2.5 overflow-hidden">
      {/* Top telemetry bar */}
      <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#00FF41]/20 text-center">
        <div className="bg-black/50 p-1.5 rounded border border-[#00FF41]/20">
          <span className="text-slate-400 block text-[9px]">TOTAL PACKETS</span>
          <span className="text-[#00FF41] font-bold text-xs">{packetCount.toLocaleString()}</span>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-[#00FF41]/20">
          <span className="text-slate-400 block text-[9px]">THROUGHPUT</span>
          <span className="text-cyan-300 font-bold text-xs">{bandwidth} KB/s</span>
        </div>
        <div className="bg-black/50 p-1.5 rounded border border-[#00FF41]/20">
          <span className="text-slate-400 block text-[9px]">LOSS RATE</span>
          <span className="text-emerald-400 font-bold text-xs">0.00% [NOMINAL]</span>
        </div>
      </div>

      {/* Network Canvas */}
      <div className="flex-1 relative my-2 overflow-hidden rounded bg-black/40 border border-[#00FF41]/15">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Active node table footer */}
      <div className="pt-1 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span className="flex items-center gap-1 text-[#00FF41]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] inline-block animate-pulse" />
          5/5 NODES ACTIVE
        </span>
        <span>LATENCY: 12ms AVG</span>
        <span className="text-cyan-300 font-mono">BGP_ROUTE: OK</span>
      </div>
    </div>
  );
};
