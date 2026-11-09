import React, { useState, useEffect } from 'react';

export const DataStreamWindow: React.FC = () => {
  const [streamLines, setStreamLines] = useState<string[]>([
    '0x00FF4100: 48 89 E5 48 83 EC 20 48 89 7D E8 48 8B 45 E8',
    '0x00FF4110: 80 38 00 74 12 48 8B 45 E8 0F B6 00 0F BE C0',
    '0x00FF4120: 89 C7 E8 2B FE FF FF 48 83 45 E8 01 EB E2 C9',
    '0x00FF4130: 01101001 01101110 01110011 01110100 01100001',
    '0x00FF4140: 01110010 01100101 01100011 01101111 01110110',
    '0x00FF4150: 9A F2 00 12 CC DE FF 01 44 89 FA 10 22 88 41',
    '0x00FF4160: 55 48 89 E5 53 48 83 EC 08 E8 C3 FE FF FF 48',
  ]);

  useEffect(() => {
    const hexChars = '0123456789ABCDEF';
    const interval = setInterval(() => {
      // Generate a new simulated hex memory row
      const offset = (Math.floor(Math.random() * 65535)).toString(16).padStart(4, '0').toUpperCase();
      let bytes = '';
      for (let i = 0; i < 14; i++) {
        bytes += hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + ' ';
      }
      const newLine = `0x00FF${offset}: ${bytes.trim()}`;
      setStreamLines((prev) => [...prev.slice(-18), newLine]);
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#030d07] text-[#00FF41] font-mono text-[9.5px] p-2.5 overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#00FF41]/20">
        <div>
          <span className="font-bold text-xs text-white">MEMORY STREAM HEAP</span>
          <span className="text-slate-400 block text-[9px]">RAW BINARY &amp; OPCODES</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-[#00FF88]/40 text-[#00FF88] text-[9px] font-bold">
          BUFFER: 64 KB
        </span>
      </div>

      {/* Cascading Stream */}
      <div className="flex-1 my-1.5 overflow-hidden p-2 rounded bg-black/60 border border-[#00FF41]/15 space-y-1">
        {streamLines.map((line, idx) => (
          <div
            key={idx}
            className={`truncate transition-colors ${
              idx % 4 === 0
                ? 'text-cyan-300 font-bold'
                : idx % 3 === 0
                ? 'text-[#00FF88]'
                : 'text-[#00FF41]/80'
            }`}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-1.5 border-t border-[#00FF41]/20 flex items-center justify-between text-[9px] text-slate-400">
        <span className="text-[#00FF88]">HEAP: UNLOCKED &amp; VERIFIED</span>
        <span>RATE: 2.8 MB/s</span>
      </div>
    </div>
  );
};
