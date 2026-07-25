import React from 'react';
import { useLocation } from 'react-router-dom';
import { Minus, Square, X, Search, Bell, Sparkles, User, Zap } from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore';
import { useMonitorStore } from '../../store/useMonitorStore';

export default function TopBar() {
  const location = useLocation();
  const { currentSession } = useSessionStore();
  const wsConnected = useMonitorStore((state) => state.isConnected);

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
    <div
      className="drag-region flex h-16 w-full items-center justify-between border-b border-white/5 px-6 backdrop-blur-md sticky top-0 z-40"
      style={{ background: 'rgba(9, 9, 11, 0.75)' }}
    >
      {/* Left: Breadcrumbs & Search bar */}
      <div className="flex items-center gap-6 no-drag">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-100">{pageTitle}</span>
          {currentSession && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Focusing
            </span>
          )}
        </div>

        {/* Search Bar Input */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search dashboard... (Ctrl+K)"
            className="w-full bg-white/3 border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-purple-500/40 focus:bg-white/5 transition-all placeholder:text-zinc-650"
          />
        </div>
      </div>

      {/* Middle: Drag area spacer */}
      <div className="flex-1 h-full drag-region" />

      {/* Right: Actions, Avatar, Connection & Controls */}
      <div className="flex items-center gap-4 no-drag">
        {/* Connection status pills */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/3 border border-white/5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${wsConnected ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-zinc-600'}`} />
          {wsConnected ? 'Connected' : 'Offline'}
        </div>

        {/* Notifications Button */}
        <button className="relative p-2 rounded-xl bg-white/3 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-zinc-950" />
        </button>

        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 border border-white/10 text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-90 transition-opacity">
          SK
        </div>

        <div className="h-4 w-[1px] bg-white/5" />

        {/* Window controls (Electron app shell specific) */}
        <div className="flex items-center gap-1 bg-white/3 border border-white/5 rounded-xl p-1">
          <button
            id="btn-minimize"
            onClick={handleMinimize}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            id="btn-maximize"
            onClick={handleMaximize}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Maximize"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            id="btn-close"
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-500/80 text-zinc-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
