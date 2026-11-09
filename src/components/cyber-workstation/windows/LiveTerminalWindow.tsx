import React, { useState, useEffect, useRef } from 'react';

const INITIAL_LOGS = [
  'VIKAS HACKER [Version 4.2.0-SECURE-STATION]',
  'Unauthorized tampering detected: NONE. System kernel integrity verified.',
  'Starting security daemon: auth_guard, network_mesh, packet_filter...',
  'root@vikas-sec:~# nmap -sV -p 443,80,22 --system-dns 10.0.1.0/24',
  'Starting Nmap 7.94 at workstation [THREAD: 0x9AF2]',
  'Nmap scan report for gateway.sec (10.0.1.1)',
  'Host is up (0.00042s latency).',
  'PORT    STATE SERVICE  VERSION',
  '22/tcp  OPEN  ssh      OpenSSH 9.6p1 (Debian 12)',
  '80/tcp  OPEN  http     nginx/1.24 (Reverse Proxy)',
  '443/tcp OPEN  ssl/http nginx/1.24 (TLSv1.3 TLS_AES_256_GCM_SHA384)',
  'root@vikas-sec:~# ./verify_incident_pipeline.sh --mode=authorized',
  '[+] Zero-Password Protocol: ACTIVE',
  '[+] 7 Authorized Recovery Queues Synced: Instagram, WhatsApp, Gmail, Facebook, Snapchat',
  '[+] Payment Webhook Listener: PORT 3000 NOMINAL',
];

export const LiveTerminalWindow: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [inputVal, setInputVal] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-stream realistic logs every few seconds
  useEffect(() => {
    const streamPool = [
      '[AUDIT] Account recovery dispatch verified for user queue',
      '[NET] Inbound secure TLS handshake completed (128-bit forward secrecy)',
      '[CRYPT] Key rotation scheduled: Next cycle in 180s',
      '[FW] Rate limit bucket cleared: 0 IPs blacklisted',
      '[DIAG] Memory footprint 142MB / Swap 0B (OPTIMAL)',
      '[TELEMETRY] Latency spike test: 8.4ms round-trip to UPI Gateway',
      '[CORE] Incident ticket VK-9412-SEC status updated -> UNDER_REVIEW',
      '[SYNC] Admin database heartbeat acknowledged (POSTGRES OK)',
    ];

    const timer = setInterval(() => {
      const nextMsg = streamPool[Math.floor(Math.random() * streamPool.length)];
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs((prev) => [...prev.slice(-45), `[${ts}] ${nextMsg}`]);
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const lower = cmd.toLowerCase();
    const newEntry = `root@vikas-sec:~# ${cmd}`;

    let reply = '';
    if (lower === 'help') {
      reply = 'AVAILABLE COMMANDS: status, scan, clear, services, whatsapp, ping, info';
    } else if (lower === 'status') {
      reply = 'SYSTEM STATUS: 100% OPERATIONAL · THREAT LEVEL: GREEN · NO BREACHES';
    } else if (lower === 'clear') {
      setLogs(['Terminal buffer cleared.']);
      setInputVal('');
      return;
    } else if (lower === 'scan') {
      reply = '[+] Quick scan running... 0 security anomalies found. All endpoints locked.';
    } else if (lower === 'services') {
      reply = '7 Active Services: Instagram (₹499), Suspended (₹329), Disabled (₹399), WhatsApp (₹439), Facebook (₹350), Gmail (₹549), Snapchat (₹369)';
    } else if (lower === 'whatsapp') {
      reply = 'Official WhatsApp Incident Support: +91 8279026491';
    } else if (lower === 'ping') {
      reply = '64 bytes from 10.0.1.1: icmp_seq=1 ttl=64 time=0.482 ms';
    } else {
      reply = `bash: command not found: ${cmd}. Type 'help' for simulated commands.`;
    }

    setLogs((prev) => [...prev, newEntry, reply]);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[11px] p-3 select-text overflow-hidden">
      {/* Scrollable logs */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin leading-relaxed"
      >
        {logs.map((log, i) => (
          <div
            key={i}
            className={`${
              log.startsWith('root@')
                ? 'text-[#00FF88] font-bold'
                : log.startsWith('[+]')
                ? 'text-cyan-300'
                : log.startsWith('[AUDIT]') || log.startsWith('[CORE]')
                ? 'text-emerald-300'
                : 'text-[#00FF41]/85'
            }`}
          >
            {log}
          </div>
        ))}
      </div>

      {/* Interactive Command Prompt Line */}
      <form onSubmit={handleCommandSubmit} className="pt-2 border-t border-[#00FF41]/20 flex items-center gap-1.5 mt-1">
        <span className="text-[#00FF88] font-bold shrink-0">root@vikas:~#</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type 'help' or commands..."
          className="flex-1 bg-transparent text-[#00FF41] placeholder-[#00FF41]/40 focus:outline-none text-[11px] font-mono"
        />
        <span className="w-2 h-4 bg-[#00FF41] animate-pulse inline-block shrink-0" />
      </form>
    </div>
  );
};
