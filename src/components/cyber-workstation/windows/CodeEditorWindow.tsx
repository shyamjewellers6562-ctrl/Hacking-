import React, { useState, useEffect, useRef } from 'react';

const CODE_LINES = [
  '// VIKAS HACKER - AUTHORIZED ACCOUNT RECOVERY ENGINE v4.2',
  'import { createHash, randomBytes } from "node:crypto";',
  'import { verifyClientPayload, issueAuditTicket } from "@/security";',
  '',
  'export async function executeIncidentDispatch(caseId: string, username: string) {',
  '  console.log(`[DISPATCH] Initializing secure channel for: ${username}`);',
  '  ',
  '  // Step 1: Enforce Zero-Password & Zero-OTP Invariant',
  '  const integrityPass = await verifyZeroPasswordPolicy({',
  '    caseId,',
  '    usernameOrNumber: username,',
  '    mode: "OFFICIAL_ESCALATION"',
  '  });',
  '  ',
  '  if (!integrityPass) {',
  '    throw new SecurityViolation("Illegal password or OTP request intercepted!");',
  '  }',
  '  ',
  '  // Step 2: Generate 256-Bit Cryptographic Ticket Hash',
  '  const nonce = randomBytes(32).toString("hex");',
  '  const digest = createHash("sha256").update(caseId + nonce).digest("hex");',
  '  ',
  '  // Step 3: Direct Official Platform API Escalation',
  '  const dispatchResponse = await fetch("/api/v1/recovery-escalation", {',
  '    method: "POST",',
  '    headers: {',
  '      "X-Vikas-Sec-Key": process.env.ESC_AUTH_KEY,',
  '      "Content-Type": "application/json"',
  '    },',
  '    body: JSON.stringify({ caseId, ticket: digest, timestamp: Date.now() })',
  '  });',
  '  ',
  '  return { status: "DISPATCHED", digest, etaMinutes: 5 };',
  '}',
  '',
  '// Worker Heartbeat Loop',
  'setInterval(async () => {',
  '  await flushTamperLogBuffer();',
  '  await syncTelemetryMetrics();',
  '}, 3000);',
];

export const CodeEditorWindow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll code smoothly
  useEffect(() => {
    let scrollPos = 0;
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      scrollPos += 1;
      if (scrollPos > containerRef.current.scrollHeight - containerRef.current.clientHeight) {
        scrollPos = 0;
      }
      containerRef.current.scrollTop = scrollPos;
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[10px] p-2.5 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#00FF41]/20">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-black/60 border border-[#00FF41]/30 text-white font-bold text-[9px] flex items-center gap-1">
            <span className="text-[#00FF88]">TS</span> recovery_dispatch.ts
          </span>
          <span className="text-slate-500 text-[9px]">UTF-8</span>
        </div>
        <span className="text-slate-400 text-[9px]">LN 38, COL 1</span>
      </div>

      {/* Code Editor Body */}
      <div
        ref={containerRef}
        className="flex-1 my-1.5 overflow-y-auto space-y-0.5 bg-black/60 rounded p-2 border border-[#00FF41]/15 leading-relaxed"
      >
        {CODE_LINES.map((line, idx) => {
          const isComment = line.trim().startsWith('//');
          const isImport = line.trim().startsWith('import') || line.trim().startsWith('export');
          const isKeyword =
            line.includes('async function') || line.includes('const') || line.includes('await');

          return (
            <div key={idx} className="flex gap-2">
              <span className="text-slate-600 select-none w-5 text-right shrink-0">
                {idx + 1}
              </span>
              <span
                className={`whitespace-pre ${
                  isComment
                    ? 'text-emerald-500/70 italic'
                    : isImport
                    ? 'text-cyan-300 font-bold'
                    : isKeyword
                    ? 'text-[#00FF88]'
                    : line.includes('string') || line.includes('digest')
                    ? 'text-amber-300'
                    : 'text-[#00FF41]'
                }`}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-1.5 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span className="text-[#00FF88]">SYNTAX: TYPESCRIPT</span>
        <span>ZERO COMPILE ERRORS</span>
      </div>
    </div>
  );
};
