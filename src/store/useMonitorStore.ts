import { create } from 'zustand'
import { MonitorState, ActivityUpdateData, DistractionAlertData, Classification } from '../types'

interface MonitorStore extends MonitorState {
  // Actions
  setCurrentApp: (app: string, title: string, classification: Classification) => void
  setProductivityScore: (score: number) => void
  setConnected: (connected: boolean) => void
  showDistractionAlert: (data: DistractionAlertData) => void
  dismissDistractionAlert: () => void
  setCoachMessage: (message: string | null) => void
  updateFromActivityEvent: (data: ActivityUpdateData) => void
  // Computed
  timeFocusedToday: number
  timeDistractedToday: number
  focusSessionCount: number
  // Setters for computed
  setTimeFocusedToday: (minutes: number) => void
  setTimeDistractedToday: (minutes: number) => void
  setFocusSessionCount: (count: number) => void
}

export const useMonitorStore = create<MonitorStore>((set) => ({
  // Initial state
  currentApp: 'Unknown',
  currentTitle: '',
  currentClassification: 'NEUTRAL',
  productivityScore: 0,
  isConnected: false,
  lastUpdate: null,
  distractionAlertVisible: false,
  distractionAlertData: null,
  coachMessage: null,
  timeFocusedToday: 0,
  timeDistractedToday: 0,
  focusSessionCount: 0,

  // Actions
  setCurrentApp: (app, title, classification) =>
    set({
      currentApp: app,
      currentTitle: title,
      currentClassification: classification,
      lastUpdate: new Date().toISOString(),
    }),

  setProductivityScore: (score) => set({ productivityScore: score }),

  setConnected: (connected) => set({ isConnected: connected }),

  showDistractionAlert: (data) =>
    set({ distractionAlertVisible: true, distractionAlertData: data }),

  dismissDistractionAlert: () =>
    set({ distractionAlertVisible: false, distractionAlertData: null }),

  setCoachMessage: (message) => set({ coachMessage: message }),

  updateFromActivityEvent: (data: ActivityUpdateData) =>
    set({
      currentApp: data.app_name,
      currentTitle: data.window_title,
      currentClassification: data.classification,
      productivityScore: data.productivity_score,
      lastUpdate: new Date().toISOString(),
    }),

  setTimeFocusedToday: (minutes) => set({ timeFocusedToday: minutes }),
  setTimeDistractedToday: (minutes) => set({ timeDistractedToday: minutes }),
  setFocusSessionCount: (count) => set({ focusSessionCount: count }),
}))
