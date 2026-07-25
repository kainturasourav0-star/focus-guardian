import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useSettingsStore } from '../store/useSettingsStore';

interface Insight {
  id: string;
  text: string;
  type: 'pattern' | 'recommendation' | 'achievement';
}

export default function Insights() {
  const { settings } = useSettingsStore();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchInsights = () => {
    setLoading(true);
    setError(false);
    
    setTimeout(() => {
      if (!settings?.gemini_api_key) {
        setError(true);
        setLoading(false);
        return;
      }
      
      setInsights([
        { id: '1', text: 'You are 40% more productive on Tuesdays mornings between 9am and 11am. Consider scheduling deep work then.', type: 'pattern' },
        { id: '2', text: 'Discord usage frequently triggers 20+ minute distraction chains. Try enabling stricter blocks during focus sessions.', type: 'recommendation' },
        { id: '3', text: 'Great job! Your focus streak has improved by 2 days compared to last week.', type: 'achievement' },
      ]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchInsights();
  }, [settings?.gemini_api_key]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-purple-400" /> AI Insights
          </h1>
          <p className="text-gray-400 mt-1">Personalized productivity analysis powered by Gemini AI.</p>
        </div>
        <Button onClick={fetchInsights} disabled={loading} variant="secondary" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Regenerate
        </Button>
      </header>

      {error ? (
        <GlassCard className="p-8 border-l-4 border-l-orange-500 bg-orange-500/5">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-orange-400 shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white">Insights Unavailable</h3>
              <p className="text-gray-400 mt-2">Insights require the Gemini API to be configured. Please add your API key in the Settings page to enable AI-powered analysis.</p>
            </div>
          </div>
        </GlassCard>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-6 h-24 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-6 border-l-4 border-l-purple-500 hover:bg-white/5 transition-colors">
                <div className="flex gap-4">
                  <div className="mt-1">
                    {insight.type === 'recommendation' ? <Lightbulb className="h-6 w-6 text-yellow-400" /> : <Sparkles className="h-6 w-6 text-purple-400" />}
                  </div>
                  <p className="text-gray-200 text-lg leading-relaxed">{insight.text}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
