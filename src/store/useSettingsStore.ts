import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserSettings } from '../types'
import { settingsApi } from '../services/api'

interface SettingsStore {
  settings: UserSettings | null
  isLoading: boolean
  fetchSettings: () => Promise<void>
  updateSettings: (data: Partial<UserSettings>) => Promise<void>
  setSettings: (settings: UserSettings) => void
}

const defaultSettings: UserSettings = {
  id: 1,
  warning_threshold_minutes: 5,
  focus_duration_minutes: 25,
  break_duration_minutes: 5,
  idle_threshold_seconds: 90,
  dark_mode: true,
  notifications_enabled: true,
  allowed_apps: [],
  blocked_websites: ['instagram.com', 'facebook.com', 'netflix.com', 'tiktok.com'],
  gemini_api_key: null,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,

      fetchSettings: async () => {
        set({ isLoading: true })
        try {
          const res = await settingsApi.get()
          set({ settings: res.data })
        } catch (err) {
          console.warn('Could not fetch settings from backend, using defaults:', err)
        } finally {
          set({ isLoading: false })
        }
      },

      updateSettings: async (data: Partial<UserSettings>) => {
        const current = get().settings
        if (!current) return
        const updated = { ...current, ...data }
        set({ settings: updated })
        try {
          await settingsApi.update(updated)
        } catch (err) {
          console.error('Failed to save settings:', err)
        }
      },

      setSettings: (settings) => set({ settings }),
    }),
    {
      name: 'focus-guardian-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)
