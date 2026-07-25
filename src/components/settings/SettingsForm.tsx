import React, { useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { UserSettings } from '../../types';

interface Props {
  settings: UserSettings;
  onSave: (s: Partial<UserSettings>) => void;
}

export default function SettingsForm({ settings, onSave }: Props) {
  const [formData, setFormData] = useState({ ...settings });
  const [showApiKey, setShowApiKey] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const inputClass = "w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors";

  return (
    <GlassCard className="p-6 space-y-8 h-full">
      <section>
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Timing Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Focus Duration (min)</label>
            <input type="number" name="focus_duration_minutes" value={formData.focus_duration_minutes} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Break Duration (min)</label>
            <input type="number" name="break_duration_minutes" value={formData.break_duration_minutes} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Idle Detection (sec)</label>
            <input type="number" name="idle_threshold_seconds" value={formData.idle_threshold_seconds} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Warning Threshold (min)</label>
            <input type="number" name="warning_threshold_minutes" value={formData.warning_threshold_minutes} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-slate-300">Enable Desktop Notifications</span>
            <div className="relative">
              <input type="checkbox" name="notifications_enabled" checked={formData.notifications_enabled} onChange={handleChange} className="sr-only" />
              <div className={`block w-10 h-6 rounded-full transition-colors ${formData.notifications_enabled ? 'bg-purple-500' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.notifications_enabled ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-slate-300">Dark Mode</span>
            <div className="relative">
              <input type="checkbox" name="dark_mode" checked={formData.dark_mode} onChange={handleChange} className="sr-only" />
              <div className={`block w-10 h-6 rounded-full transition-colors ${formData.dark_mode ? 'bg-purple-500' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.dark_mode ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
          
          <div className="flex flex-col gap-1.5 pt-2">
            <span className="text-sm font-medium text-slate-300">AI Coach Persona / Tone</span>
            <select
              name="ai_coach_tone"
              value={formData.ai_coach_tone || 'motivational'}
              onChange={(e) => setFormData(prev => ({ ...prev, ai_coach_tone: e.target.value as any }))}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            >
              <option value="motivational">🌟 Motivational & Supportive</option>
              <option value="brutal">🔥 Brutal & Sarcastic (Strict)</option>
              <option value="calm">🧘 Calming & Mindful</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">AI Integrations</h3>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Gemini API Key</label>
          <div className="relative">
            <input 
              type={showApiKey ? "text" : "password"} 
              name="gemini_api_key" 
              value={formData.gemini_api_key || ''} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="AI-zaSy..." 
            />
            <button 
              type="button" 
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Required for AI Insights and Personalized Coach.</p>
        </div>
      </section>

      <Button onClick={handleSave} className="w-full flex justify-center items-center gap-2 py-3 mt-4">
        <Save className="h-4 w-4" /> Save Settings
      </Button>
    </GlassCard>
  );
}
