import React, { useState, useEffect } from 'react';

export const EncryptionEngineWindow: React.FC = () => {
  const [progress, setProgress] = useState(42);
  const [keyBlock, setKeyBlock] = useState('9F A4 3C 12 D8 E7 00 FF 41 B2');
  const [hashDigest, setHashDigest] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [cycle, setCycle] = useState(1);

  useEffect(() => {
    const hexChars = '0123456789ABCDEF';
    const interval = setInterval(() => {
      // Progress increment
      setProgress((p) => {
        if (p >= 100) {
          setCycle((c) => c + 1);
          return 0;
        }
        return p + 4;
      });

      // Randomize parts of keyBlock
      let newBlock = '';
      for (let i = 0; i < 10; i++) {
        const h1 = hexChars[Math.floor(Math.random() * 16)];
        const h2 = hexChars[Math.floor(Math.random() * 16)];
        newBlock += `${h1}${h2} `;
      }
      setKeyBlock(newBlock.trim());

      // Minor hash twist
      const randHex = Math.floor(Math.random() * 16).toString(16);
      setHashDigest((h) => randHex + h.slice(1, -1) + randHex);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[10px] p-2.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#00FF41]/20">
        <div>
          <span className="font-bold text-xs text-white">CRYPTO ENGINE v2</span>
          <span className="text-slate-400 block text-[9px]">ENCRYPT / DECRYPT PIPELINE</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-[#00FF88]/40 text-[#00FF88] text-[9px] font-bold">
          AES-256-GCM
        </span>
      </div>

      {/* Progress Bar */}
      <div className="my-2 p-2 rounded bg-black/50 border border-[#00FF41]/20 space-y-1.5">
        <div className="flex justify-between items-center text-[9px]">
          <span className="text-slate-300">KEY ROTATION CYCLE #{cycle}</span>
          <span className="text-[#00FF88] font-bold">{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-[#00FF41]/20">
          <div
            className="h-full bg-gradient-to-r from-[#00D9FF] to-[#00FF41] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Hex Key Stream */}
      <div className="flex-1 rounded bg-black/40 border border-[#00FF41]/15 p-2 space-y-2 overflow-hidden flex flex-col justify-center">
        <div>
          <span className="text-slate-400 text-[9px] block mb-0.5">CURRENT ENTROPY BLOCK:</span>
          <div className="p-1.5 rounded bg-black/80 border border-[#00FF41]/25 text-cyan-300 tracking-wider text-[11px] font-bold text-center">
            {keyBlock}
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-[9px] block mb-0.5">SHA-256 INTEGRITY DIGEST:</span>
          <div className="p-1 rounded bg-black/80 border border-[#00FF41]/25 text-[#00FF41]/90 break-all text-[8.5px] leading-tight">
            {hashDigest}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-2 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span className="text-[#00FF88]">ZERO_PASSWORD ENFORCED</span>
        <span>ENTROPY: 99.8%</span>
      </div>
    </div>
  );
};
