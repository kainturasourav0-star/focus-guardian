import React, { useState } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import SessionTimeline from '../components/history/SessionTimeline';
import { Button } from '../components/ui/Button';
import { useSessionStore } from '../store/useSessionStore';
import { Link } from 'react-router-dom';

export default function History() {
  const { sessions } = useSessionStore();
  const [filter, setFilter] = useState('all'); // all, today, week

  // In a real app, filter logic here
  const filteredSessions = sessions;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Session History</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Review your past focus sessions, tracked durations, and scores.</p>
        </div>
        <div className="flex bg-zinc-950 rounded-xl p-1 border border-white/5 shadow-sm">
          <button 
            onClick={() => setFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${filter === 'today' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'text-zinc-400 hover:text-white border border-transparent'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setFilter('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${filter === 'week' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'text-zinc-400 hover:text-white border border-transparent'}`}
          >
            This Week
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${filter === 'all' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'text-zinc-400 hover:text-white border border-transparent'}`}
          >
            All Time
          </button>
        </div>
      </header>

      {filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/30 rounded-2xl border border-white/5 max-w-md mx-auto">
          <div className="h-16 w-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
            <HistoryIcon className="h-7 w-7 text-zinc-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">No sessions recorded</h2>
          <p className="text-zinc-500 text-sm mb-6 max-w-xs leading-relaxed">
            Your completed focus periods will show up here. Take a break and start a focus session!
          </p>
          <Link to="/focus">
            <Button variant="primary">Go to Focus Mode</Button>
          </Link>
        </div>
      ) : (
        <SessionTimeline sessions={filteredSessions} />
      )}
    </div>
  );
}
