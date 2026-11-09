import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CyberAppId, CyberWindowState } from './types';
import { CyberWindowFrame } from './CyberWindowFrame';
import { BackgroundControlWidget } from './BackgroundControlWidget';

// 10 Simulated Program Window Components
import { LiveTerminalWindow } from './windows/LiveTerminalWindow';
import { NetworkMonitorWindow } from './windows/NetworkMonitorWindow';
import { FirewallMonitorWindow } from './windows/FirewallMonitorWindow';
import { EncryptionEngineWindow } from './windows/EncryptionEngineWindow';
import { ServerMonitorWindow } from './windows/ServerMonitorWindow';
import { SystemScannerWindow } from './windows/SystemScannerWindow';
import { DigitalMapWindow } from './windows/DigitalMapWindow';
import { CodeEditorWindow } from './windows/CodeEditorWindow';
import { SecurityAnalyticsWindow } from './windows/SecurityAnalyticsWindow';
import { DataStreamWindow } from './windows/DataStreamWindow';

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
} from 'lucide-react';

const APP_ORDER: CyberAppId[] = [
  'terminal',
  'scanner',
  'network',
  'encryption',
  'server',
  'firewall',
  'code',
  'analytics',
  'datastream',
  'map',
];

export const CyberCommandCenter: React.FC = () => {
  // Persistent user preferences
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vh_cyber_bg_visible') !== 'false';
    } catch (e) {
      return true;
    }
  });

  const [isPaused, setIsPaused] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vh_cyber_bg_paused') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<CyberAppId | null>('terminal');
  const [topZIndex, setTopZIndex] = useState(15);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute smart, peripheral non-overlapping default positions for windows
  const computeInitialWindows = useCallback((): Record<CyberAppId, CyberWindowState> => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const height = typeof window !== 'undefined' ? window.innerHeight : 900;
    const isMobile = width < 768;

    const leftColX = isMobile ? 12 : 24;
    const rightColX = isMobile ? 12 : Math.max(width - 390, 420);

    return {
      terminal: {
        id: 'terminal',
        title: 'TERMINAL // root@vikas-sec: nmap -sV',
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        x: leftColX,
        y: isMobile ? 80 : 100,
        width: isMobile ? width - 24 : 380,
        height: isMobile ? 210 : 250,
        zIndex: 10,
        lastActivityTime: Date.now(),
      },
      scanner: {
        id: 'scanner',
        title: 'SYSTEM RADAR // PORT PROBER',
        isOpen: true,
        isMinimized: isMobile,
        isMaximized: false,
        x: rightColX,
        y: isMobile ? 300 : 90,
        width: isMobile ? width - 24 : 360,
        height: isMobile ? 190 : 240,
        zIndex: 9,
        lastActivityTime: Date.now(),
      },
      network: {
        id: 'network',
        title: 'NETWORK MESH // BGP ROUTER',
        isOpen: true,
        isMinimized: isMobile,
        isMaximized: false,
        x: rightColX,
        y: isMobile ? 310 : 355,
        width: isMobile ? width - 24 : 370,
        height: isMobile ? 200 : 250,
        zIndex: 8,
        lastActivityTime: Date.now(),
      },
      encryption: {
        id: 'encryption',
        title: 'CRYPTO ENGINE // AES-256 ROTATION',
        isOpen: true,
        isMinimized: isMobile,
        isMaximized: false,
        x: leftColX,
        y: isMobile ? 320 : 370,
        width: isMobile ? width - 24 : 370,
        height: isMobile ? 190 : 230,
        zIndex: 7,
        lastActivityTime: Date.now(),
      },
      server: {
        id: 'server',
        title: 'SERVER MONITOR // TELEMETRY',
        isOpen: false, // auto-scheduler will open this
        isMinimized: false,
        isMaximized: false,
        x: leftColX,
        y: isMobile ? 330 : 620,
        width: isMobile ? width - 24 : 360,
        height: isMobile ? 190 : 230,
        zIndex: 6,
        lastActivityTime: Date.now(),
      },
      firewall: {
        id: 'firewall',
        title: 'FIREWALL DEFENDER // IPTABLES',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        x: rightColX,
        y: isMobile ? 340 : 630,
        width: isMobile ? width - 24 : 380,
        height: isMobile ? 200 : 240,
        zIndex: 5,
        lastActivityTime: Date.now(),
      },
      code: {
        id: 'code',
        title: 'CODE ENGINE // recovery_dispatch.ts',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        x: isMobile ? 12 : Math.max(width / 2 - 190, 50),
        y: isMobile ? 350 : 220,
        width: isMobile ? width - 24 : 380,
        height: isMobile ? 200 : 250,
        zIndex: 4,
        lastActivityTime: Date.now(),
      },
      analytics: {
        id: 'analytics',
        title: 'SECURITY ANALYTICS // RESOLUTION',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        x: rightColX,
        y: isMobile ? 360 : 200,
        width: isMobile ? width - 24 : 360,
        height: isMobile ? 200 : 240,
        zIndex: 3,
        lastActivityTime: Date.now(),
      },
      datastream: {
        id: 'datastream',
        title: 'DATA STREAM // RAW MEMORY HEAP',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        x: leftColX,
        y: isMobile ? 370 : 220,
        width: isMobile ? width - 24 : 370,
        height: isMobile ? 200 : 240,
        zIndex: 2,
        lastActivityTime: Date.now(),
      },
      map: {
        id: 'map',
        title: 'GLOBAL TOPOLOGY // ENCRYPTED MESH',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        x: rightColX,
        y: isMobile ? 380 : 450,
        width: isMobile ? width - 24 : 370,
        height: isMobile ? 200 : 240,
        zIndex: 1,
        lastActivityTime: Date.now(),
      },
    };
  }, []);

  const [windows, setWindows] = useState<Record<CyberAppId, CyberWindowState>>(computeInitialWindows);

  // Bring window to front
  const focusWindow = (id: CyberAppId) => {
    setActiveWindowId(id);
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => ({
        ...w,
        [id]: { ...w[id], zIndex: nextZ, lastActivityTime: Date.now() },
      }));
      return nextZ;
    });
  };

  const closeWindow = (id: CyberAppId) => {
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isOpen: false },
    }));
  };

  const minimizeWindow = (id: CyberAppId) => {
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isMinimized: true },
    }));
  };

  const toggleMaximizeWindow = (id: CyberAppId) => {
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isMaximized: !w[id].isMaximized },
    }));
  };

  const updateWindowPosition = (id: CyberAppId, x: number, y: number) => {
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], x, y, lastActivityTime: Date.now() },
    }));
  };

  // Toggle Background Visibility
  const handleToggleVisibility = () => {
    const nextVal = !isVisible;
    setIsVisible(nextVal);
    try {
      localStorage.setItem('vh_cyber_bg_visible', String(nextVal));
    } catch (e) {
      // Ignored
    }
  };

  // Toggle Pause
  const handleTogglePause = () => {
    const nextVal = !isPaused;
    setIsPaused(nextVal);
    try {
      localStorage.setItem('vh_cyber_bg_paused', String(nextVal));
    } catch (e) {
      // Ignored
    }
  };

  // Collapse / Restore all windows
  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    setWindows((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        const appKey = key as CyberAppId;
        updated[appKey] = {
          ...updated[appKey],
          isMinimized: nextVal,
        };
      });
      return updated;
    });
  };

  // =========================================================================
  // AUTOMATIC CYBER WORKSTATION SCHEDULER
  // Independent programs open, cycle, minimize, and reopen every 5 seconds!
  // =========================================================================
  useEffect(() => {
    if (!isVisible || isPaused || isCollapsed) return;

    let cycleStep = 0;
    const interval = setInterval(() => {
      // If document tab is hidden, pause expensive scheduling
      if (typeof document !== 'undefined' && document.hidden) return;

      const isMobile = window.innerWidth < 768;
      cycleStep = (cycleStep + 1) % APP_ORDER.length;
      const targetApp = APP_ORDER[cycleStep];

      setWindows((prev) => {
        const currentTarget = prev[targetApp];
        if (!currentTarget) return prev;

        // If target is closed or minimized -> dynamically open and bring to life!
        if (!currentTarget.isOpen || currentTarget.isMinimized) {
          const width = window.innerWidth;
          const leftColX = isMobile ? 12 : 24;
          const rightColX = isMobile ? 12 : Math.max(width - 390, 420);
          
          // Slight random drift to make it look realistic
          const randomDriftY = Math.floor(Math.random() * 60 - 30);
          const computedY = Math.max(80, Math.min(window.innerHeight - 300, currentTarget.y + randomDriftY));

          return {
            ...prev,
            [targetApp]: {
              ...currentTarget,
              isOpen: true,
              isMinimized: false,
              y: computedY,
              zIndex: topZIndex + 1,
              lastActivityTime: Date.now(),
            },
          };
        }

        // Check if too many windows (more than 4 on desktop, more than 1 on mobile) are open:
        // Automatically minimize the oldest inactive window to keep the workspace tidy & realistic!
        const openApps = Object.values(prev).filter((w) => w.isOpen && !w.isMinimized);
        const maxSimultaneous = isMobile ? 1 : 4;

        if (openApps.length > maxSimultaneous) {
          const sortedByAge = [...openApps].sort(
            (a, b) => (a.lastActivityTime || 0) - (b.lastActivityTime || 0)
          );
          // Don't minimize the active target or terminal
          const candidateToCycle = sortedByAge.find((w) => w.id !== targetApp && w.id !== 'terminal');
          if (candidateToCycle) {
            return {
              ...prev,
              [candidateToCycle.id]: {
                ...candidateToCycle,
                isMinimized: true,
              },
            };
          }
        }

        return prev;
      });
    }, 4800);

    return () => clearInterval(interval);
  }, [isVisible, isPaused, isCollapsed, topZIndex]);

  // =========================================================================
  // FULL-SCREEN CANVAS: MATRIX RAIN + CONNECTED NODES
  // =========================================================================
  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const chars = '01010101#$<>{}[]+=-_~*^%!?@ABCDEF0123456789';
    const charArray = chars.split('');
    const fontSize = isMobile ? 12 : 14;
    const columns = Math.floor(width / (fontSize * (isMobile ? 2.4 : 1.7)));
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -80);
    }

    const nodeCount = isMobile ? 14 : 32;
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
      if (isPaused) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Matrix Code Streams
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * (fontSize * (isMobile ? 2.4 : 1.7));
        const y = drops[i] * fontSize;

        if (Math.random() > 0.88) {
          ctx.fillStyle = '#FFFFFF';
        } else if (i % 3 === 0) {
          ctx.fillStyle = 'rgba(0, 217, 255, 0.4)';
        } else {
          ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
        }

        if (y > 0 && y < height) {
          ctx.fillText(text, x, y);
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.85;
      }

      // 2. Network Nodes
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

          const maxDist = isMobile ? 80 : 125;
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = i % 2 === 0 ? '#00FF41' : '#00FF88';
            ctx.globalAlpha = (1 - dist / maxDist) * 0.16;
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
  }, [isVisible, isPaused]);

  const activeAppCount = Object.values(windows).filter((w) => w.isOpen && !w.isMinimized).length;

  if (!isVisible) {
    return (
      <>
        {/* Deep fallback background when hidden */}
        <div className="fixed inset-0 bg-[#020704] -z-10 pointer-events-none" />
        <BackgroundControlWidget
          isVisible={false}
          isPaused={isPaused}
          isCollapsed={isCollapsed}
          activeAppCount={0}
          onToggleVisibility={handleToggleVisibility}
          onTogglePause={handleTogglePause}
          onToggleCollapse={handleToggleCollapse}
        />
      </>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Deep Cyber Black & Dark Green Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020704] via-[#031107] to-[#010603] opacity-98" />

      {/* 2. Cyber Circuit Grid Pattern */}
      <div className="absolute inset-0 cyber-grid-pattern opacity-35" />

      {/* 3. Subtle Cyber Scanlines */}
      <div className="absolute inset-0 cyber-scanlines opacity-20" />

      {/* 4. Ambient Neon Green & Emerald Glows */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-[#00FF41]/08 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -right-32 w-[34rem] h-[34rem] bg-[#00FF88]/08 rounded-full blur-[150px]" />
      <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] bg-[#00FF41]/06 rounded-full blur-[140px]" />

      {/* 5. Persistent Canvas Layer (Matrix code + Network Mesh) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-85 block" />

      {/* 6. Subtle Horizontal Laser Scan Beam */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FF41]/30 to-transparent animate-scan-line pointer-events-none" />

      {/* ========================================================================= */}
      {/* 7. INDEPENDENT FLOATING SIMULATED PROGRAM WINDOWS                          */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* WINDOW 1: LIVE TERMINAL */}
        <CyberWindowFrame
          window={windows.terminal}
          title={windows.terminal.title}
          icon={<Terminal className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'terminal'}
          onFocus={() => focusWindow('terminal')}
          onClose={() => closeWindow('terminal')}
          onMinimize={() => minimizeWindow('terminal')}
          onToggleMaximize={() => toggleMaximizeWindow('terminal')}
          onUpdatePosition={(x, y) => updateWindowPosition('terminal', x, y)}
        >
          <LiveTerminalWindow />
        </CyberWindowFrame>

        {/* WINDOW 2: SYSTEM RADAR SCANNER */}
        <CyberWindowFrame
          window={windows.scanner}
          title={windows.scanner.title}
          icon={<Radar className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'scanner'}
          onFocus={() => focusWindow('scanner')}
          onClose={() => closeWindow('scanner')}
          onMinimize={() => minimizeWindow('scanner')}
          onToggleMaximize={() => toggleMaximizeWindow('scanner')}
          onUpdatePosition={(x, y) => updateWindowPosition('scanner', x, y)}
        >
          <SystemScannerWindow />
        </CyberWindowFrame>

        {/* WINDOW 3: NETWORK MONITOR */}
        <CyberWindowFrame
          window={windows.network}
          title={windows.network.title}
          icon={<Activity className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'network'}
          onFocus={() => focusWindow('network')}
          onClose={() => closeWindow('network')}
          onMinimize={() => minimizeWindow('network')}
          onToggleMaximize={() => toggleMaximizeWindow('network')}
          onUpdatePosition={(x, y) => updateWindowPosition('network', x, y)}
        >
          <NetworkMonitorWindow />
        </CyberWindowFrame>

        {/* WINDOW 4: ENCRYPTION ENGINE */}
        <CyberWindowFrame
          window={windows.encryption}
          title={windows.encryption.title}
          icon={<KeyRound className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'encryption'}
          onFocus={() => focusWindow('encryption')}
          onClose={() => closeWindow('encryption')}
          onMinimize={() => minimizeWindow('encryption')}
          onToggleMaximize={() => toggleMaximizeWindow('encryption')}
          onUpdatePosition={(x, y) => updateWindowPosition('encryption', x, y)}
        >
          <EncryptionEngineWindow />
        </CyberWindowFrame>

        {/* WINDOW 5: SERVER MONITOR */}
        <CyberWindowFrame
          window={windows.server}
          title={windows.server.title}
          icon={<Server className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'server'}
          onFocus={() => focusWindow('server')}
          onClose={() => closeWindow('server')}
          onMinimize={() => minimizeWindow('server')}
          onToggleMaximize={() => toggleMaximizeWindow('server')}
          onUpdatePosition={(x, y) => updateWindowPosition('server', x, y)}
        >
          <ServerMonitorWindow />
        </CyberWindowFrame>

        {/* WINDOW 6: FIREWALL MONITOR */}
        <CyberWindowFrame
          window={windows.firewall}
          title={windows.firewall.title}
          icon={<Shield className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'firewall'}
          onFocus={() => focusWindow('firewall')}
          onClose={() => closeWindow('firewall')}
          onMinimize={() => minimizeWindow('firewall')}
          onToggleMaximize={() => toggleMaximizeWindow('firewall')}
          onUpdatePosition={(x, y) => updateWindowPosition('firewall', x, y)}
        >
          <FirewallMonitorWindow />
        </CyberWindowFrame>

        {/* WINDOW 7: CODE EDITOR */}
        <CyberWindowFrame
          window={windows.code}
          title={windows.code.title}
          icon={<Code2 className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'code'}
          onFocus={() => focusWindow('code')}
          onClose={() => closeWindow('code')}
          onMinimize={() => minimizeWindow('code')}
          onToggleMaximize={() => toggleMaximizeWindow('code')}
          onUpdatePosition={(x, y) => updateWindowPosition('code', x, y)}
        >
          <CodeEditorWindow />
        </CyberWindowFrame>

        {/* WINDOW 8: SECURITY ANALYTICS */}
        <CyberWindowFrame
          window={windows.analytics}
          title={windows.analytics.title}
          icon={<BarChart3 className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'analytics'}
          onFocus={() => focusWindow('analytics')}
          onClose={() => closeWindow('analytics')}
          onMinimize={() => minimizeWindow('analytics')}
          onToggleMaximize={() => toggleMaximizeWindow('analytics')}
          onUpdatePosition={(x, y) => updateWindowPosition('analytics', x, y)}
        >
          <SecurityAnalyticsWindow />
        </CyberWindowFrame>

        {/* WINDOW 9: DATA STREAM */}
        <CyberWindowFrame
          window={windows.datastream}
          title={windows.datastream.title}
          icon={<Binary className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'datastream'}
          onFocus={() => focusWindow('datastream')}
          onClose={() => closeWindow('datastream')}
          onMinimize={() => minimizeWindow('datastream')}
          onToggleMaximize={() => toggleMaximizeWindow('datastream')}
          onUpdatePosition={(x, y) => updateWindowPosition('datastream', x, y)}
        >
          <DataStreamWindow />
        </CyberWindowFrame>

        {/* WINDOW 10: DIGITAL MAP */}
        <CyberWindowFrame
          window={windows.map}
          title={windows.map.title}
          icon={<Globe2 className="w-3.5 h-3.5" />}
          isActive={activeWindowId === 'map'}
          onFocus={() => focusWindow('map')}
          onClose={() => closeWindow('map')}
          onMinimize={() => minimizeWindow('map')}
          onToggleMaximize={() => toggleMaximizeWindow('map')}
          onUpdatePosition={(x, y) => updateWindowPosition('map', x, y)}
        >
          <DigitalMapWindow />
        </CyberWindowFrame>

      </div>

      {/* 8. Floating Background Control Button */}
      <BackgroundControlWidget
        isVisible={isVisible}
        isPaused={isPaused}
        isCollapsed={isCollapsed}
        activeAppCount={activeAppCount}
        onToggleVisibility={handleToggleVisibility}
        onTogglePause={handleTogglePause}
        onToggleCollapse={handleToggleCollapse}
      />
    </div>
  );
};
