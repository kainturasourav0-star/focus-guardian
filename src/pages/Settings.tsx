import React from 'react';
import SettingsForm from '../components/settings/SettingsForm';
import AppListManager from '../components/settings/AppListManager';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useSettingsStore } from '../store/useSettingsStore';

export default function Settings() {
  const { settings, updateSettings } = useSettingsStore();

  const handleSaveSettings = (newSettings: any) => {
    updateSettings(newSettings);
  };

  const handleAddBlocked = (item: string) => {
    if (!settings) return;
    updateSettings({ blocked_websites: [...settings.blocked_websites, item] });
  };

  const handleRemoveBlocked = (item: string) => {
    if (!settings) return;
    updateSettings({ blocked_websites: settings.blocked_websites.filter(i => i !== item) });
  };

  const handleAddAllowed = (item: string) => {
    if (!settings) return;
    updateSettings({ allowed_apps: [...settings.allowed_apps, item] });
  };

  const handleRemoveAllowed = (item: string) => {
    if (!settings) return;
    updateSettings({ allowed_apps: settings.allowed_apps.filter(i => i !== item) });
  };

  if (!settings) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <LoadingSpinner size="md" message="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Configure focus timer thresholds, warning blocks, and integrations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SettingsForm settings={settings} onSave={handleSaveSettings} />
        </div>

        <div className="space-y-6">
          <AppListManager
            label="Blocked Websites & Apps"
            placeholder="e.g., twitter.com, Discord"
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

      <GlassCard 
        className="p-6 mt-8 border border-white/5 relative overflow-hidden group"
        style={{ background: '#18181B' }}
      >
        <h3 className="text-base font-bold text-white tracking-tight mb-2">Data & Privacy</h3>
        <p className="text-zinc-500 text-sm mb-4 max-w-2xl font-medium leading-relaxed">
          Your data is stored locally in SQLite database (`focus_guardian.db`). Clearing data will permanently remove all focus history, goals, and reset preferences. This action cannot be undone.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Are you sure you want to delete all local data? This action is permanent and cannot be undone.')) {
              // Action handler if applicable
            }
          }}
        >
          Clear All Data
        </Button>
      </GlassCard>
    </div>
  );
}
