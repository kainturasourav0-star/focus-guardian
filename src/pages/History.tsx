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
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Session History</h1>
          <p className="text-gray-400 mt-1">Review your past focus sessions and productivity trends.</p>
        </div>
        <div className="flex bg-gray-900 rounded-lg p-1 border border-white/10">
          <button 
            onClick={() => setFilter('today')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'today' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setFilter('week')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'week' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            This Week
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            All Time
          </button>
        </div>
      </header>

      {filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-900/30 rounded-2xl border border-white/5">
          <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <HistoryIcon className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No sessions yet</h2>
          <p className="text-gray-400 mb-6">Start your first focus session to see it here.</p>
          <Link to="/focus">
            <Button>Go to Focus Mode</Button>
          </Link>
        </div>
      ) : (
        <SessionTimeline sessions={filteredSessions} />
      )}
    </div>
  );
}
