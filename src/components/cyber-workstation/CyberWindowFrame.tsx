import React, { useRef, useState, useEffect } from 'react';
import { CyberWindowState } from './types';
import { Minus, Square, X, Move } from 'lucide-react';

interface CyberWindowFrameProps {
  window: CyberWindowState;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  children: React.ReactNode;
  isDesktopView?: boolean;
}

export const CyberWindowFrame: React.FC<CyberWindowFrameProps> = ({
  window: win,
  title,
  icon,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onUpdatePosition,
  children,
  isDesktopView = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startMouseX: number; startMouseY: number; startWinX: number; startWinY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag from header, not control buttons
    if ((e.target as HTMLElement).closest('button')) return;

    onFocus();
    setIsDragging(true);
    dragRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startWinX: win.x,
      startWinY: win.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragRef.current || win.isMaximized) return;

    const deltaX = e.clientX - dragRef.current.startMouseX;
    const deltaY = e.clientY - dragRef.current.startMouseY;

    const newX = Math.max(10, Math.min(window.innerWidth - win.width - 10, dragRef.current.startWinX + deltaX));
    const newY = Math.max(60, Math.min(window.innerHeight - 120, dragRef.current.startWinY + deltaY));

    onUpdatePosition(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignored
      }
    }
  };

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  // Position and sizing calculations
  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        left: '20px',
        top: '75px',
        width: 'calc(100vw - 40px)',
        height: 'calc(100vh - 150px)',
        zIndex: win.zIndex + 20,
      }
    : {
        position: 'fixed',
        left: `${win.x}px`,
        top: `${win.y}px`,
        width: `${win.width}px`,
        height: `${win.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={style}
      onClick={onFocus}
      className={`cyber-window pointer-events-auto rounded-xl flex flex-col overflow-hidden transition-shadow select-none ${
        isActive ? 'cyber-window-active' : ''
      } ${isDragging ? 'opacity-95 shadow-[0_0_35px_rgba(0,255,65,0.4)]' : ''}`}
    >
      {/* Window Title Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="cyber-window-header px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
      >
        {/* Left: Window Controls (Red, Yellow, Green traffic dots) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 border border-red-400/50 flex items-center justify-center text-black opacity-80 hover:opacity-100 transition-opacity"
            title="Close"
          >
            <X className="w-2 h-2 opacity-0 hover:opacity-100" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 border border-amber-400/50 flex items-center justify-center text-black opacity-80 hover:opacity-100 transition-opacity"
            title="Minimize"
          >
            <Minus className="w-2 h-2 opacity-0 hover:opacity-100" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
            className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 border border-emerald-400/50 flex items-center justify-center text-black opacity-80 hover:opacity-100 transition-opacity"
            title={win.isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="w-1.5 h-1.5 opacity-0 hover:opacity-100" />
          </button>
        </div>

        {/* Center: Title & Icon */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#00FF41] truncate px-2">
          <span className="text-[#00FF88] shrink-0">{icon}</span>
          <span className="truncate">{title}</span>
        </div>

        {/* Right: Drag indicator */}
        <div className="text-[#00FF41]/40 shrink-0">
          <Move className="w-3 h-3" />
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </div>
  );
};
