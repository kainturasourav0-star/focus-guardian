import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Target,
  BarChart3,
  Sparkles,
  Trophy,
  History as HistoryIcon,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMonitorStore } from '../../store/useMonitorStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/focus', label: 'Focus Mode', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/insights', label: 'AI Insights', icon: Sparkles },
  { path: '/goals', label: 'Goals', icon: Trophy },
  { path: '/history', label: 'History', icon: HistoryIcon },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const wsConnected = useMonitorStore((state) => state.isConnected);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex h-full flex-col border-r border-white/5 backdrop-blur-2xl shrink-0 overflow-hidden"
      style={{ background: 'rgba(9, 9, 11, 0.4)' }}
    >
      {/* Brand logo header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 h-16 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-md shadow-purple-500/20 ring-1 ring-white/10 shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-md font-bold text-transparent tracking-tight whitespace-nowrap"
            >
              Focus Guardian
            </motion.h1>
          )}
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center rounded-xl py-3 transition-all duration-300 border border-transparent ${
                isCollapsed ? 'justify-center px-0' : 'px-4'
              } ${
                isActive
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
              }`
            }
            title={isCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <div className="flex items-center gap-3.5 w-full justify-start">
                <item.icon
                  className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                    isActive ? 'text-purple-400' : 'text-zinc-400 group-hover:text-zinc-200'
                  } ${isCollapsed ? 'mx-auto' : ''}`}
                />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {!isCollapsed && isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7] shrink-0" />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle Switch Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-[-10px] top-[74px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white shadow-md hover:scale-110 transition-all cursor-pointer"
        style={{ transform: 'translateX(-50%)' }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Footer Connection status */}
      <div className="border-t border-white/5 p-4 shrink-0" style={{ background: 'rgba(5, 5, 8, 0.1)' }}>
        <div className={`flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/3 ${isCollapsed ? 'justify-center p-2' : 'px-3 py-2'}`}>
          <div className="relative flex h-2 w-2 shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                wsConnected ? 'bg-emerald-400' : 'bg-zinc-650'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                wsConnected ? 'bg-emerald-400' : 'bg-zinc-650'
              }`}
            />
          </div>
          {!isCollapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 whitespace-nowrap">
              {wsConnected ? 'Monitor active' : 'Monitor idle'}
            </span>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
