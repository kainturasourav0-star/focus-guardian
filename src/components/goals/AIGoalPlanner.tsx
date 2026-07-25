import React, { useState } from 'react';
import { Sparkles, Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';

interface PlanItem {
  time: string;
  task: string;
}

export default function AIGoalPlanner() {
  const { isDemoMode } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanItem[]>([]);

  const handleGeneratePlan = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    
    try {
      if (isDemoMode) {
        // Mock response for Web Preview mode
        setTimeout(() => {
          setPlan([
            { time: '09:00 – 10:30', task: 'Practice DSA Questions' },
            { time: '10:45 – 12:00', task: 'Study DBMS Concepts' },
            { time: '12:00 – 13:00', task: 'Lunch & Screen Break' },
            { time: '13:00 – 15:30', task: 'Complete Hackathon Coding' },
            { time: '15:45 – 17:00', task: 'Review & Debug' }
          ]);
          setLoading(false);
        }, 1500);
      } else {
        // Call FastAPI Backend AI endpoint
        const res = await axios.post('http://127.0.0.1:8000/api/goals/plan', {
          goals_text: inputText
        }, {
          headers: { 'X-Focus-Guardian-Secret': 'fg-dev-secret-2024' }
        });
        setPlan(res.data.plan || []);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to generate AI plan:', err);
      // Fallback
      setPlan([
        { time: '09:00 – 10:00', task: 'DSA practice' },
        { time: '10:00 – 11:00', task: 'Hackathon coding' },
        { time: '11:00 – 12:00', task: 'Break & rest' }
      ]);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPlan([]);
    setInputText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
          Enter your targets for today
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., Complete Hackathon dashboard, Finish DSA trees practice, Study DBMS normal forms"
          rows={3}
          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-650 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleGeneratePlan}
          disabled={loading || !inputText.trim()}
          variant="primary"
          className="flex-1 justify-center py-3 shadow-lg shadow-purple-500/25"
          icon={<Sparkles size={15} />}
        >
          {loading ? 'Analyzing with Gemini...' : 'Generate Today\'s Plan'}
        </Button>
        {plan.length > 0 && (
          <Button onClick={handleClear} variant="secondary" className="px-3 border-white/5 bg-white/3 hover:bg-white/10">
            <Trash2 size={16} className="text-zinc-400" />
          </Button>
        )}
      </div>

      {plan.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" /> Generated Schedule
          </h3>
          <div className="relative border-l-2 border-purple-500/20 ml-2.5 pl-5 space-y-4">
            {plan.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute left-[-26px] top-1.5 h-3.5 w-3.5 rounded-full border border-purple-500 bg-zinc-950 shadow-[0_0_6px_#a855f7]" />
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5">
                    {item.time}
                  </span>
                  <p className="text-zinc-250 text-sm font-semibold">{item.task}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
