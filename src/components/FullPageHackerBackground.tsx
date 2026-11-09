import React, { useEffect, useRef, useState } from 'react';

export const FullPageHackerBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live streaming terminal logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'KERNEL: VIKAS-SEC-CORE v4.8 [PORT 443 OPEN]',
    'DIAGNOSTIC: ZERO_PASSWORD_INVARIANT = VERIFIED',
    'DISPATCH: 7 RECOVERY PIPELINES ACTIVE',
    'PROBE: INSTAGRAM / WHATSAPP / GMAIL SYNCED',
  ]);

  // Live server metrics
  const [cpuLoad, setCpuLoad] = useState(24);
  const [packetCount, setPacketCount] = useState(14820);
  const [scanProgress, setScanProgress] = useState(72);
  const [keyBlock, setKeyBlock] = useState('9F A4 3C 12 D8 E7 00 FF 41 B2');
  const [dataStream, setDataStream] = useState<string[]>([
    '0x00FF4100: 48 89 E5 48 83 EC 20 48 89 7D E8',
    '0x00FF4110: 80 38 00 74 12 48 8B 45 E8 0F B6',
    '0x00FF4120: 01101001 01101110 01110011 01110100',
    '0x00FF4130: 9A F2 00 12 CC DE FF 01 44 89 FA',
  ]);

  // Telemetry simulation timers
  useEffect(() => {
    const streamPool = [
      '[+] SEC_AUDIT: RECOVERY CHANNEL ENCRYPTED (AES-256)',
      '[+] BGP_ROUTE: PACKET FORWARDING NOMINAL (12ms)',
      '[+] ZERO_CREDENTIAL: PASSWORD RECOVERY POLICIES LOCKED',
      '[+] TELEMETRY: INCIDENT ESCALATION QUEUE NOMINAL',
      '[+] CRYPTO_ENGINE: KEY ROTATION CHECKSUM VERIFIED',
      '[+] UPI_GATEWAY: PAYMENT WEBHOOK LISTENER ACTIVE',
      '[+] INTEGRITY: SHA-256 HASH VERIFICATION PASSED',
    ];

    const logTimer = setInterval(() => {
      const msg = streamPool[Math.floor(Math.random() * streamPool.length)];
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
      setTerminalLogs((prev) => [...prev.slice(-4), `[${ts}] ${msg}`]);
    }, 3500);

    const metricsTimer = setInterval(() => {
      setCpuLoad(Math.floor(Math.random() * 18 + 18));
      setPacketCount((p) => p + Math.floor(Math.random() * 12 + 4));
      setScanProgress((p) => (p >= 100 ? 0 : p + 2));

      // Keyblock rotation
      const hex = '0123456789ABCDEF';
      let newBlock = '';
      for (let i = 0; i < 10; i++) {
        newBlock += hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)] + ' ';
      }
      setKeyBlock(newBlock.trim());

      // Data stream line
      const offset = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
      const newLine = `0x00FF${offset}: ${hex[Math.floor(Math.random() * 16)]}${hex[Math.floor(Math.random() * 16)]} 48 89 E5 0F B6 00 12`;
      setDataStream((prev) => [...prev.slice(-3), newLine]);
    }, 1200);

    return () => {
      clearInterval(logTimer);
      clearInterval(metricsTimer);
    };
  }, []);

  // HTML5 Canvas for Matrix Rain and Network Mesh
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;

    // Matrix characters: Binary, hex, brackets, cyber symbols
    const chars = '01010101#$<>{}[]+=-_~*^%!?@ABCDEF0123456789';
    const charArray = chars.split('');
    const fontSize = isMobile ? 12 : 14;
    // Cover the full width of the screen with matrix drops
    const columns = Math.floor(width / (fontSize * (isMobile ? 2.2 : 1.6)));
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -80);
    }

    // Network connection nodes across the full viewport
    const nodeCount = isMobile ? 16 : 38;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const nodeColors = ['#00FF41', '#00FF88', '#00D9FF'];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        alpha: Math.random() * 0.4 + 0.15,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Full-Screen Matrix Rain
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * (fontSize * (isMobile ? 2.2 : 1.6));
        const y = drops[i] * fontSize;

        // Bright lead character, fading trailing characters
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#FFFFFF';
        } else if (i % 3 === 0) {
          ctx.fillStyle = 'rgba(0, 217, 255, 0.45)';
        } else {
          ctx.fillStyle = 'rgba(0, 255, 65, 0.45)';
        }

        if (y > 0 && y < height) {
          ctx.fillText(text, x, y);
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.85;
      }

      // 2. Draw Network Nodes & Dynamic Connection Lines
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

          const maxDist = isMobile ? 80 : 130;
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = i % 2 === 0 ? '#00FF41' : '#00FF88';
            ctx.globalAlpha = (1 - dist / maxDist) * 0.18;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Cyber Black & Dark Green Gradient Canvas Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020704] via-[#031107] to-[#010603] opacity-98" />

      {/* 2. Cyber Circuit Grid Pattern */}
      <div className="absolute inset-0 cyber-grid-pattern opacity-35" />

      {/* 3. Subtle Cyber Scanlines Layer */}
      <div className="absolute inset-0 cyber-scanlines opacity-20" />

      {/* 4. Ambient Neon Green & Emerald Radial Glows */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-[#00FF41]/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 -right-32 w-[36rem] h-[36rem] bg-[#00FF88]/10 rounded-full blur-[160px]" />
      <div className="absolute -bottom-32 left-1/3 w-[32rem] h-[32rem] bg-[#00FF41]/08 rounded-full blur-[150px]" />

      {/* 5. Persistent HTML5 Canvas (Matrix Code + Network Nodes) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-85 block" />

      {/* 6. Subtle Horizontal Scanning Laser Line */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FF41]/35 to-transparent animate-scan-line pointer-events-none" />

      {/* ========================================================================= */}
      {/* 7. NATURAL FLOATING SIMULATED COMPUTER WINDOWS (DISTRIBUTED NATURALLY)   */}
      {/* ========================================================================= */}

      {/* WINDOW 1: LIVE TERMINAL (Middle-Left) */}
      <div className="hidden lg:flex flex-col absolute left-6 top-[22%] w-80 h-52 rounded-2xl bg-[#020b05]/65 backdrop-blur-md border border-[#00FF41]/30 shadow-[0_0_25px_rgba(0,255,65,0.15)] overflow-hidden font-mono text-[10px]">
        {/* Title bar */}
        <div className="px-3 py-1.5 bg-black/70 border-b border-[#00FF41]/25 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[#00FF41] font-bold text-[9px] tracking-wider truncate">
            TERMINAL // root@vikas-sec
          </span>
          <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
        </div>
        {/* Log body */}
        <div className="p-2.5 flex-1 overflow-hidden space-y-1 text-[#00FF41]/85">
          {terminalLogs.map((log, i) => (
            <div key={i} className="truncate leading-relaxed">
              {log}
            </div>
          ))}
          <div className="pt-1 flex items-center gap-1 text-[#00FF88]">
            <span>root@vikas:~#</span>
            <span className="w-1.5 h-3 bg-[#00FF41] animate-pulse inline-block" />
          </div>
        </div>
      </div>

      {/* WINDOW 2: NETWORK MONITOR (Middle-Right) */}
      <div className="hidden lg:flex flex-col absolute right-6 top-[20%] w-80 h-48 rounded-2xl bg-[#020b05]/65 backdrop-blur-md border border-[#00FF41]/30 shadow-[0_0_25px_rgba(0,255,65,0.15)] overflow-hidden font-mono text-[10px]">
        <div className="px-3 py-1.5 bg-black/70 border-b border-[#00FF41]/25 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[#00FF41] font-bold text-[9px] tracking-wider">
            NETWORK MONITOR // BGP
          </span>
          <span className="text-cyan-300 text-[9px]">12ms</span>
        </div>
        <div className="p-2.5 flex-1 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-1 rounded bg-black/50 border border-[#00FF41]/20">
              <span className="text-slate-400 block text-[8px]">PACKETS IN</span>
              <span className="text-[#00FF41] font-bold text-xs">{packetCount.toLocaleString()}</span>
            </div>
            <div className="p-1 rounded bg-black/50 border border-[#00FF41]/20">
              <span className="text-slate-400 block text-[8px]">THROUGHPUT</span>
              <span className="text-cyan-300 font-bold text-xs">142.8 KB/s</span>
            </div>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-[#00FF41]/15 text-[9px] space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>NODE: IN-DEL-01 (HQ)</span>
              <span className="text-[#00FF88]">ONLINE</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>NODE: SG-SIN-04 (RELAY)</span>
              <span className="text-[#00FF88]">SYNCED</span>
            </div>
          </div>
        </div>
      </div>

      {/* WINDOW 3: SYSTEM RADAR SCANNER (Lower-Right) */}
      <div className="hidden lg:flex flex-col absolute right-6 top-[56%] w-72 h-48 rounded-2xl bg-[#020b05]/65 backdrop-blur-md border border-[#00FF41]/30 shadow-[0_0_25px_rgba(0,255,65,0.15)] overflow-hidden font-mono text-[10px]">
        <div className="px-3 py-1.5 bg-black/70 border-b border-[#00FF41]/25 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[#00FF41] font-bold text-[9px] tracking-wider">
            SYSTEM SCANNER // {scanProgress}%
          </span>
          <span className="text-[#00FF88] text-[9px]">ACTIVE</span>
        </div>
        <div className="p-2 flex-1 flex items-center gap-3">
          {/* Radar circle */}
          <div className="relative w-24 h-24 rounded-full border-2 border-[#00FF41]/40 bg-black/70 flex items-center justify-center overflow-hidden shrink-0">
            <div className="absolute w-3/4 h-3/4 rounded-full border border-[#00FF41]/30" />
            <div className="absolute w-1/2 h-1/2 rounded-full border border-[#00FF41]/30" />
            <div className="absolute w-full h-[1px] bg-[#00FF41]/30" />
            <div className="absolute h-full w-[1px] bg-[#00FF41]/30" />
            <div
              className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(0,255,65,0.4) 0deg, transparent 60deg, transparent 360deg)',
              }}
            />
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] shadow-[0_0_6px_#00FF88]" />
          </div>
          <div className="space-y-1 text-[9px]">
            <div className="text-slate-300">TARGET: PORT 443</div>
            <div className="text-[#00FF88]">0 CRITICAL VULNS</div>
            <div className="text-cyan-300">SHIELD: MAXIMUM</div>
          </div>
        </div>
      </div>

      {/* WINDOW 4: ENCRYPTION ENGINE (Lower-Left) */}
      <div className="hidden lg:flex flex-col absolute left-6 top-[54%] w-80 h-48 rounded-2xl bg-[#020b05]/65 backdrop-blur-md border border-[#00FF41]/30 shadow-[0_0_25px_rgba(0,255,65,0.15)] overflow-hidden font-mono text-[10px]">
        <div className="px-3 py-1.5 bg-black/70 border-b border-[#00FF41]/25 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[#00FF41] font-bold text-[9px] tracking-wider">
            CRYPTO ENGINE // AES-256
          </span>
          <span className="text-emerald-300 text-[9px]">ROTATING</span>
        </div>
        <div className="p-2.5 flex-1 space-y-2">
          <div>
            <span className="text-slate-400 text-[8px] block mb-0.5">CURRENT ENTROPY BLOCK:</span>
            <div className="p-1 rounded bg-black/80 border border-[#00FF41]/25 text-cyan-300 text-[10px] font-bold text-center">
              {keyBlock}
            </div>
          </div>
          <div className="p-1.5 rounded bg-black/50 border border-[#00FF41]/20 flex justify-between items-center text-[9px]">
            <span className="text-slate-300">ZERO_PASSWORD POLICY</span>
            <span className="text-[#00FF41] font-bold">ENFORCED</span>
          </div>
        </div>
      </div>

      {/* WINDOW 5: SERVER TELEMETRY (Upper Center-Right, on extra wide screens) */}
      <div className="hidden 2xl:flex flex-col absolute right-96 top-[8%] w-72 h-40 rounded-2xl bg-[#020b05]/65 backdrop-blur-md border border-[#00FF41]/30 shadow-[0_0_25px_rgba(0,255,65,0.15)] overflow-hidden font-mono text-[10px]">
        <div className="px-3 py-1.5 bg-black/70 border-b border-[#00FF41]/25 flex items-center justify-between">
          <span className="text-[#00FF41] font-bold text-[9px]">SERVER TELEMETRY</span>
          <span className="text-cyan-300 text-[9px]">CPU: {cpuLoad}%</span>
        </div>
        <div className="p-2.5 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[9px]">
            <span className="text-slate-300">UPTIME: 99.98%</span>
            <span className="text-[#00FF88]">RAM: 4.2 / 16 GB</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 border border-[#00FF41]/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00D9FF] to-[#00FF41] transition-all duration-300"
              style={{ width: `${cpuLoad * 2.5}%` }}
            />
          </div>
          <div className="text-[8.5px] text-slate-400 flex justify-between">
            <span>MEM: CLEAN</span>
            <span className="text-emerald-300">TEMP: 41°C (OK)</span>
          </div>
        </div>
      </div>

      {/* WINDOW 6: DATA STREAM (Lower Center-Left, on extra wide screens) */}
      <div className="hidden 2xl:flex flex-col absolute left-96 bottom-[6%] w-80 h-40 rounded-2xl bg-[#020b05]/65 backdrop-blur-md border border-[#00FF41]/30 shadow-[0_0_25px_rgba(0,255,65,0.15)] overflow-hidden font-mono text-[9px]">
        <div className="px-3 py-1.5 bg-black/70 border-b border-[#00FF41]/25 flex items-center justify-between">
          <span className="text-[#00FF41] font-bold text-[9px]">HEAP STREAM // RAW BINARY</span>
          <span className="text-[#00FF88] text-[9px]">BUFFER OK</span>
        </div>
        <div className="p-2 flex-1 space-y-1 overflow-hidden text-[#00FF41]/80">
          {dataStream.map((line, idx) => (
            <div key={idx} className="truncate">
              {line}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
