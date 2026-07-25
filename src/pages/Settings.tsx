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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your focus environment and preferences.</p>
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

      <GlassCard className="p-6 mt-8 border-red-500/20">
        <h3 className="text-lg font-semibold text-white mb-2">Data & Privacy</h3>
        <p className="text-slate-400 text-sm mb-4 max-w-2xl">
          Your data is stored locally on your device. Clearing data will remove all focus history, goals, and reset settings to default. This action cannot be undone.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
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
