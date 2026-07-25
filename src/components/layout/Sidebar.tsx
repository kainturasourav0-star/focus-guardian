import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, BarChart3, Sparkles, Trophy, History as HistoryIcon, Settings, Shield } from 'lucide-react';
import { useMonitorStore } from '../../store/useMonitorStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/focus', label: 'Focus Mode', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/insights', label: 'Insights', icon: Sparkles },
  { path: '/goals', label: 'Goals', icon: Trophy },
  { path: '/history', label: 'History', icon: HistoryIcon },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const wsConnected = useMonitorStore((state) => state.isConnected);

  return (
    <aside className="flex h-full w-[240px] flex-col border-r border-white/10 bg-gray-900/50 backdrop-blur-xl">
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/20">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h1 className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-lg font-bold text-transparent">
          Focus Guardian
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-l-2 border-purple-500 bg-purple-500/10 text-purple-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className={`h-2 w-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-gray-600'}`} />
          <span>{wsConnected ? 'Monitor Connected' : 'Monitor Disconnected'}</span>
        </div>
      </div>
    </aside>
  );
}
