import React from 'react';
import { useLocation } from 'react-router-dom';
import { Minus, Square, X, Zap } from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore';

/**
 * Custom frameless titlebar. The outer div has the `drag-region` class so
 * the user can drag the window from it. Window control buttons are `no-drag`.
 */
export default function TopBar() {
  const location = useLocation();
  const { currentSession } = useSessionStore();

  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => window.electronAPI?.maximize();
  const handleClose = () => window.electronAPI?.close();

  const routeLabels: Record<string, string> = {
    '': 'Dashboard',
    'focus': 'Focus Mode',
    'analytics': 'Analytics',
    'insights': 'AI Insights',
    'goals': 'Goals',
    'history': 'History',
    'settings': 'Settings',
  };

  const pageSegment = location.pathname.split('/')[1] || '';
  const pageTitle = routeLabels[pageSegment] ?? pageSegment;

  return (
    <div className="drag-region flex h-12 w-full items-center justify-between border-b border-white/8 px-4 backdrop-blur-md"
      style={{ background: 'rgba(10,10,15,0.9)' }}
    >
      {/* Left: page title + session indicator */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-400">{pageTitle}</span>
        {currentSession && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
            <Zap className="h-3 w-3" />
            Focus Active
          </span>
        )}
      </div>

      {/* Right: Window controls (no-drag) */}
      <div className="no-drag flex items-center">
        <button
          id="btn-minimize"
          onClick={handleMinimize}
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
          title="Minimize"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          id="btn-maximize"
          onClick={handleMaximize}
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
          title="Maximize"
        >
          <Square className="h-3 w-3" />
        </button>
        <button
          id="btn-close"
          onClick={handleClose}
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-red-500 text-slate-500 hover:text-white transition-colors"
          title="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
