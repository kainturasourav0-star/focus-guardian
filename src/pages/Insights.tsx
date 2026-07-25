import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useSettingsStore } from '../store/useSettingsStore';
import { insightsApi } from '../services/api';

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

  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    
    try {
      const res = await insightsApi.get();
      const rawInsights: string[] = res.data;
      
      const formatted = rawInsights.map((text, idx) => {
        const lower = text.toLowerCase();
        let type: 'pattern' | 'recommendation' | 'achievement' = 'pattern';
        if (
          lower.includes('score') ||
          lower.includes('streak') ||
          lower.includes('completed') ||
          lower.includes('great') ||
          lower.includes('achievement')
        ) {
          type = 'achievement';
        } else if (
          lower.includes('try') ||
          lower.includes('consider') ||
          lower.includes('suggest') ||
          lower.includes('recommend') ||
          lower.includes('should') ||
          lower.includes('limit') ||
          lower.includes('enable')
        ) {
          type = 'recommendation';
        }
        return {
          id: String(idx),
          text,
          type,
        };
      });
      setInsights(formatted);
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [settings?.gemini_api_key]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Sparkles className="h-7 w-7 text-purple-400" /> AI Insights
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Personalized productivity analysis powered by Gemini AI.</p>
        </div>
        <Button onClick={fetchInsights} disabled={loading} variant="secondary" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Regenerate
        </Button>
      </header>

      {!settings?.gemini_api_key && (
        <GlassCard 
          className="p-6 border-l-4 border-l-amber-500 bg-amber-500/5 border border-white/5" 
          style={{ background: '#18181B' }}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">Gemini Key Missing</h4>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Using local rule-based insights. Add your Gemini API key in Settings to unlock deep, personalized AI coaching reports.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {error ? (
        <GlassCard 
          className="p-8 border-l-4 border-l-red-500 bg-red-500/5 border border-white/5" 
          style={{ background: '#18181B' }}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-400 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Failed to load insights</h3>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                Please make sure the Focus Guardian backend is running and healthy.
              </p>
            </div>
          </div>
        </GlassCard>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <GlassCard 
              key={i} 
              className="p-6 h-28 relative overflow-hidden border border-white/5"
              style={{ background: '#18181B' }}
            >
              {/* Skeleton loading shimmer */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="h-4 w-1/3 bg-white/5 rounded mb-4" />
              <div className="h-4 w-2/3 bg-white/5 rounded" />
            </GlassCard>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {insights.map((insight) => (
            <motion.div key={insight.id} variants={itemVariants}>
              <GlassCard 
                className="p-6 border border-white/5 border-l-4 border-l-purple-500 hover:scale-[1.01] transition-transform shadow-md"
                style={{ background: '#18181B' }}
              >
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/10 mt-0.5">
                    {insight.type === 'recommendation' ? <Lightbulb className="h-5 w-5 text-amber-400" /> : <Sparkles className="h-5 w-5 text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                      {insight.type}
                    </span>
                    <p className="text-zinc-200 text-base leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
