import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsForm from '../components/settings/SettingsForm';
import AppListManager from '../components/settings/AppListManager';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useSettingsStore } from '../store/useSettingsStore';
import { Settings2, Keyboard, Shield, Brain, Palette } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: <Settings2 size={14} /> },
  { id: 'ai', label: 'AI & Model', icon: <Brain size={14} /> },
  { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard size={14} /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield size={14} /> },
];

const SHORTCUTS = [
  { keys: ['Ctrl', 'Shift', 'F'], action: 'Start Focus Session', page: '/focus' },
  { keys: ['Ctrl', 'Shift', 'B'], action: 'Block Websites (Settings)', page: '/settings' },
  { keys: ['Ctrl', 'Shift', 'P'], action: 'Pause Focus Session', page: '/focus' },
  { keys: ['Ctrl', 'Shift', 'R'], action: 'Generate AI Report', page: '/analytics' },
  { keys: ['Ctrl', 'Shift', 'A'], action: 'Open AI Coach', page: '/insights' },
  { keys: ['Ctrl', 'Shift', 'H'], action: 'Achievements', page: '/achievements' },
];

const TRACKED_ITEMS = [
  { icon: '🖥️', name: 'Active Window', description: 'Tracks which app is in focus' },
  { icon: '🌐', name: 'Browser Tabs', description: 'Monitors active browser domain' },
  { icon: '⏱️', name: 'Focus Duration', description: 'Measures time in each app' },
  { icon: '🖱️', name: 'Idle Detection', description: 'Detects inactive sessions' },
  { icon: '📊', name: 'Productivity Score', description: 'Calculated per session' },
  { icon: '🎯', name: 'Session Goals', description: 'Tracks goal completion' },
];

export default function Settings() {
  const { settings, updateSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState('general');

  const handleSaveSettings = (newSettings: any) => updateSettings(newSettings);
  const handleAddBlocked = (item: string) => { if (!settings) return; updateSettings({ blocked_websites: [...settings.blocked_websites, item] }); };
  const handleRemoveBlocked = (item: string) => { if (!settings) return; updateSettings({ blocked_websites: settings.blocked_websites.filter((i) => i !== item) }); };
  const handleAddAllowed = (item: string) => { if (!settings) return; updateSettings({ allowed_apps: [...settings.allowed_apps, item] }); };
  const handleRemoveAllowed = (item: string) => { if (!settings) return; updateSettings({ allowed_apps: settings.allowed_apps.filter((i) => i !== item) }); };

  if (!settings) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <LoadingSpinner size="md" message="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Configure your focus rules, AI model, privacy, and keyboard shortcuts.</p>
      </header>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-zinc-950/80 p-1 rounded-xl border border-white/5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === t.id
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SettingsForm settings={settings} onSave={handleSaveSettings} />
              <div className="space-y-6">
                <AppListManager
                  label="Blocked Websites & Apps"
                  placeholder="e.g., instagram.com, Discord"
                  items={settings.blocked_websites}
                  onAdd={handleAddBlocked}
                  onRemove={handleRemoveBlocked}
                  colorTheme="red"
                />
                <AppListManager
                  label="Always Allowed Apps"
                  placeholder="e.g., VS Code, Terminal"
                  items={settings.allowed_apps}
                  onAdd={handleAddAllowed}
                  onRemove={handleRemoveAllowed}
                  colorTheme="green"
                />
              </div>
            </div>
          )}

          {/* AI & Model Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              <GlassCard className="p-6 border border-white/5" style={{ background: '#18181B' }}>
                <h3 className="text-sm font-bold text-white mb-4">Cloud AI (Gemini)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Gemini API Key</label>
                    <input
                      type="password"
                      defaultValue={settings.gemini_api_key || ''}
                      onBlur={(e) => updateSettings({ gemini_api_key: e.target.value })}
                      placeholder="AIza... or nvapi-..."
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">AI Coach Tone</label>
                    <select
                      defaultValue={settings.ai_coach_tone || 'motivational'}
                      onChange={(e) => updateSettings({ ai_coach_tone: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                    >
                      <option value="motivational">Motivational</option>
                      <option value="strict">Strict</option>
                      <option value="gentle">Gentle</option>
                      <option value="analytical">Analytical</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border border-white/5" style={{ background: '#18181B' }}>
                <h3 className="text-sm font-bold text-white mb-1">Local AI (Ollama)</h3>
                <p className="text-xs text-zinc-500 mb-4">Run AI models locally for maximum privacy. Requires Ollama installed and running.</p>
                <div className="flex gap-3 flex-wrap">
                  {['llama3', 'mistral', 'gemma', 'phi3'].map((model) => (
                    <div key={model} className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/3 text-xs font-bold text-zinc-400">
                      {model}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-600 mt-3">Local AI endpoint: <code className="text-zinc-400">http://localhost:11434</code></p>
              </GlassCard>
            </div>
          )}

          {/* Keyboard Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <GlassCard className="p-6 border border-white/5" style={{ background: '#18181B' }}>
              <h3 className="text-sm font-bold text-white mb-5">Global Keyboard Shortcuts</h3>
              <div className="space-y-3">
                {SHORTCUTS.map((s) => (
                  <div key={s.action} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{s.action}</p>
                      <p className="text-xs text-zinc-600">{s.page}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k, i) => (
                        <React.Fragment key={k}>
                          <kbd className="px-2 py-1 text-xs font-bold bg-zinc-800 border border-zinc-700 rounded-md text-zinc-300">{k}</kbd>
                          {i < s.keys.length - 1 && <span className="text-zinc-600 text-xs">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <GlassCard className="p-6 border border-white/5" style={{ background: '#18181B' }}>
                <h3 className="text-sm font-bold text-white mb-1">What Focus Guardian Tracks</h3>
                <p className="text-xs text-zinc-500 mb-5">All data is stored locally in <code className="text-zinc-400">focus_guardian.db</code>. Nothing is sent to external servers.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TRACKED_ITEMS.map((item) => (
                    <div key={item.name} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-zinc-200">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6 border border-red-500/10 bg-red-500/3" style={{ background: '#18181B' }}>
                <h3 className="text-sm font-bold text-white mb-2">Data Management</h3>
                <p className="text-zinc-500 text-sm mb-5 max-w-2xl leading-relaxed">
                  Clearing data will permanently remove all focus history, goals, sessions, and reset all preferences.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="border-white/10 bg-white/3"
                    onClick={() => alert('Export started — coming soon!')}
                  >
                    Export All Data
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (confirm('Are you sure? This permanently deletes all local data.')) {
                        // Clear action handler
                      }
                    }}
                  >
                    Clear All Data
                  </Button>
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
