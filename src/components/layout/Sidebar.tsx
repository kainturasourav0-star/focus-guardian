import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, BarChart3, Sparkles, Trophy, History as HistoryIcon, Settings, Shield } from 'lucide-react';
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

  return (
    <aside
      className="flex h-full w-[240px] flex-col border-r border-white/5 backdrop-blur-2xl"
      style={{ background: 'rgba(10, 10, 15, 0.4)' }}
    >
      {/* Brand logo header */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/25 ring-1 ring-white/10">
          <Shield className="h-5.5 w-5.5 text-white" />
        </div>
        <h1 className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-lg font-bold text-transparent tracking-tight">
          Focus Guardian
        </h1>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 px-4 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3.5 rounded-xl px-4.5 py-3 text-sm font-medium transition-all duration-300 border border-transparent ${
                isActive
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_4px_12px_rgba(124,58,237,0.1)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 hover:border-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Connection status */}
      <div className="border-t border-white/5 p-4" style={{ background: 'rgba(5, 5, 8, 0.2)' }}>
        <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/3 border border-white/5">
          <div className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                wsConnected ? 'bg-emerald-400' : 'bg-slate-500'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                wsConnected ? 'bg-emerald-400' : 'bg-slate-500'
              }`}
            />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {wsConnected ? 'Monitor active' : 'Monitor idle'}
          </span>
        </div>
      </div>
    </aside>
  );
}
