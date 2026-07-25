import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Code2, Building2 } from 'lucide-react';

const TABS = [
  { id: 'friends', label: 'Friends', icon: <Users size={13} /> },
  { id: 'college', label: 'College', icon: <GraduationCap size={13} /> },
  { id: 'team', label: 'Hackathon Team', icon: <Code2 size={13} /> },
];

const MOCK_DATA: Record<string, { rank: number; name: string; score: number; streak: number; badge: string }[]> = {
  friends: [
    { rank: 1, name: 'You', score: 87, streak: 7, badge: '🔥' },
    { rank: 2, name: 'Rahul K.', score: 82, streak: 5, badge: '⚡' },
    { rank: 3, name: 'Priya S.', score: 79, streak: 4, badge: '🎯' },
    { rank: 4, name: 'Arjun M.', score: 71, streak: 3, badge: '📚' },
  ],
  college: [
    { rank: 1, name: 'Vishal R.', score: 94, streak: 12, badge: '🏆' },
    { rank: 2, name: 'Sneha P.', score: 91, streak: 10, badge: '⭐' },
    { rank: 3, name: 'You', score: 87, streak: 7, badge: '🔥' },
    { rank: 4, name: 'Ananya D.', score: 85, streak: 6, badge: '💡' },
    { rank: 5, name: 'Karan B.', score: 80, streak: 4, badge: '🎯' },
  ],
  team: [
    { rank: 1, name: 'You', score: 87, streak: 7, badge: '🔥' },
    { rank: 2, name: 'Dev T.', score: 84, streak: 6, badge: '💻' },
    { rank: 3, name: 'Meera K.', score: 76, streak: 3, badge: '🎨' },
  ],
};

export default function LeaderboardPanel() {
  const [activeTab, setActiveTab] = useState('friends');
  const entries = MOCK_DATA[activeTab];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-5 bg-zinc-950/80 p-1 rounded-xl border border-white/5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
              entry.name === 'You'
                ? 'bg-purple-500/10 border-purple-500/20 text-white'
                : 'bg-white/2 border-white/5 text-zinc-300 hover:bg-white/4'
            }`}
          >
            <span className={`text-sm font-black w-6 text-center ${
              entry.rank === 1 ? 'text-amber-400' : entry.rank === 2 ? 'text-zinc-300' : entry.rank === 3 ? 'text-amber-700' : 'text-zinc-600'
            }`}>
              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
            </span>
            <span className="text-sm font-bold flex-1">{entry.name}</span>
            <span className="text-xs text-zinc-500">🔥 {entry.streak}d</span>
            <span className="text-sm font-black text-cyan-400">{entry.score}%</span>
            <span className="text-lg">{entry.badge}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
