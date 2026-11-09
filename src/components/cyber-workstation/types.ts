import React from 'react';

export type CyberAppId =
  | 'terminal'
  | 'network'
  | 'firewall'
  | 'encryption'
  | 'server'
  | 'scanner'
  | 'map'
  | 'code'
  | 'analytics'
  | 'datastream';

export interface CyberWindowConfig {
  id: CyberAppId;
  title: string;
  shortTitle: string;
  icon: string;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
}

export interface CyberWindowState {
  id: CyberAppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  lastActivityTime?: number;
}

export interface BackgroundControlState {
  isVisible: boolean;
  isPaused: boolean;
  isCollapsed: boolean;
}
