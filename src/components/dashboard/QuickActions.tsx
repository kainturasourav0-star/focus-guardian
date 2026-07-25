import React from 'react';
import { motion } from 'framer-motion';
import { Play, ShieldOff, FileText, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Action {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  color: string;
  onClick: () => void;
}

export default function QuickActions() {
  const navigate = useNavigate();

  const actions: Action[] = [
    {
      id: 'focus',
      icon: <Play size={16} />,
      label: 'Start Focus',
      shortcut: '⌃⇧F',
      color: 'hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300',
      onClick: () => navigate('/focus'),
    },
    {
      id: 'block',
      icon: <ShieldOff size={16} />,
      label: 'Block Sites',
      shortcut: '⌃⇧B',
      color: 'hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300',
      onClick: () => navigate('/settings'),
    },
    {
      id: 'report',
      icon: <FileText size={16} />,
      label: 'AI Report',
      shortcut: '⌃⇧R',
      color: 'hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300',
      onClick: () => navigate('/analytics'),
    },
    {
      id: 'ai',
      icon: <Bot size={16} />,
      label: 'AI Coach',
      shortcut: '⌃⇧A',
      color: 'hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300',
      onClick: () => navigate('/insights'),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, i) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border border-white/5 bg-white/2 text-zinc-400 text-xs font-semibold transition-all duration-200 cursor-pointer ${action.color}`}
        >
          {action.icon}
          <span className="leading-none text-[11px]">{action.label}</span>
          <span className="text-[9px] font-mono text-zinc-600">{action.shortcut}</span>
        </motion.button>
      ))}
    </div>
  );
}
