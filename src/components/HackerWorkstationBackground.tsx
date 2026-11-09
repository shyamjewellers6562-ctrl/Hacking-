import React, { useEffect, useRef, useState } from 'react';

export const HackerWorkstationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYS_INIT: WORKSTATION RUNNING [PORT:443_SECURE]',
    'DIAGNOSTIC: THREAT_DETECTION = MONITORING',
    'NODE_LINK: ENCRYPTED_CHANNEL ESTABLISHED',
    'RECOVERY_CORE: STANDBY FOR USER INQUIRY',
  ]);

  // Simulated live telemetry logs in the corner HUD (strictly decorative)
  useEffect(() => {
    const logMessages = [
      'SYS_MONITOR: SCANNING ENCRYPTED PACKETS [OK]',
      'NET_TELEMETRY: ACTIVE NODES = 24 / LATENCY 12ms',
      'AUTH_WATCH: ZERO_PASSWORD PROTOCOL ENFORCED',
      'STATUS_REPORT: ALL RECOVERY PIPELINES OPERATIONAL',
      'INTEGRITY_CHECK: CHECKSUM 0x9AF2 VERIFIED',
      'DATA_STREAM: BUFFER SYNCED WITH UPI GATEWAY',
      'DIAGNOSTICS: MEMORY CLEAN 98.4% STABLE',
      'WORKSTATION: HUD SCAN RATE 60Hz NOMINAL',
    ];

    const interval = setInterval(() => {
      const nextLog = logMessages[Math.floor(Math.random() * logMessages.length)];
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setTerminalLogs((prev) => [...prev.slice(-3), `[${timestamp}] ${nextLog}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;

    // Characters for Matrix Rain
    const chars = '01010101#$<>{}[]+=-_~*^%!?@ABCDEF0123456789';
    const charArray = chars.split('');
    const fontSize = isMobile ? 12 : 14;
    const columns = Math.floor(width / (fontSize * (isMobile ? 2.5 : 1.8)));
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    // Network connection nodes
    const nodeCount = isMobile ? 18 : 42;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const nodeColors = ['#00FF88', '#00D9FF', '#38bdf8'];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        alpha: Math.random() * 0.45 + 0.15,
      });
    }

    // Radar scan angle
    let radarAngle = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Matrix Rain (semi-transparent trails)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * (fontSize * (isMobile ? 2.5 : 1.8));
        const y = drops[i] * fontSize;

        // Alternate glowing green & electric blue
        const isCyan = i % 3 === 0;
        ctx.fillStyle = isCyan ? 'rgba(0, 217, 255, 0.45)' : 'rgba(0, 255, 136, 0.45)';

        if (y > 0 && y < height) {
          ctx.fillText(text, x, y);
        }

        // Drop reset with random delay
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.85;
      }

      // 2. Draw Network Connection Nodes & Interconnecting Data Streams
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0) n1.x = width;
        if (n1.x > width) n1.x = 0;
        if (n1.y < 0) n1.y = height;
        if (n1.y > height) n1.y = 0;

        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fillStyle = n1.color;
        ctx.globalAlpha = n1.alpha;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = isMobile ? 85 : 125;
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = i % 2 === 0 ? '#00FF88' : '#00D9FF';
            ctx.globalAlpha = (1 - dist / maxDist) * 0.16;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Subtle Radar Sweep in Bottom Right (Desktop only to save mobile draw calls)
      if (!isMobile && width > 900) {
        const radarX = width - 110;
        const radarY = height - 110;
        const radarRadius = 75;

        radarAngle += 0.025;

        // Concentric rings
        ctx.globalAlpha = 0.18;
        ctx.strokeStyle = '#00D9FF';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(radarX, radarY, radarRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(radarX, radarY, radarRadius * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(radarX, radarY, radarRadius * 0.25, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(radarX - radarRadius, radarY);
        ctx.lineTo(radarX + radarRadius, radarY);
        ctx.moveTo(radarX, radarY - radarRadius);
        ctx.lineTo(radarX, radarY + radarRadius);
        ctx.stroke();

        // Sweep line
        ctx.beginPath();
        ctx.moveTo(radarX, radarY);
        ctx.lineTo(
          radarX + Math.cos(radarAngle) * radarRadius,
          radarY + Math.sin(radarAngle) * radarRadius
        );
        ctx.strokeStyle = '#00FF88';
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep Cyber Workstation Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050807] via-[#071018] to-[#040807] opacity-95" />

      {/* Cyber Grid & Circuit Background Pattern */}
      <div className="absolute inset-0 cyber-grid-pattern opacity-40" />

      {/* Futuristic Radial Glows (Neon Green on top-left, Electric Blue on bottom-right) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00FF88]/10 rounded-full blur-[130px]" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-[#00D9FF]/10 rounded-full blur-[150px]" />
      <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-[#00FF88]/08 rounded-full blur-[140px]" />

      {/* Interactive HTML5 Canvas (Matrix Rain + Network Nodes + Radar) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />

      {/* Decorative Workstation HUD Diagnostics Panel (Bottom Left, Subtle & Non-intrusive) */}
      <div className="hidden lg:block absolute bottom-6 left-6 max-w-sm p-3.5 rounded-2xl bg-black/50 border border-cyan-500/20 backdrop-blur-sm font-mono text-[10px] text-cyan-400/80 space-y-1 shadow-[0_0_20px_rgba(0,217,255,0.08)]">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1 text-[#00FF88]">
          <span className="flex items-center gap-1.5 font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping inline-block" />
            WORKSTATION TELEMETRY
          </span>
          <span className="text-slate-400 text-[9px]">ENCRYPTED_V2</span>
        </div>
        {terminalLogs.map((log, idx) => (
          <div key={idx} className="truncate text-slate-300">
            {log}
          </div>
        ))}
      </div>

      {/* Subtle Horizontal Scanning Light Beam */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FF88]/25 to-transparent animate-scan-line pointer-events-none" />
    </div>
  );
};
