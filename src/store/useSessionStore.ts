import { create } from 'zustand'
import { FocusSession } from '../types'
import { sessionsApi } from '../services/api'

interface SessionStore {
  // State
  currentSession: FocusSession | null
  sessions: FocusSession[]
  isLoading: boolean
  focusModeActive: boolean
  elapsedSeconds: number
  timerInterval: ReturnType<typeof setInterval> | null

  // Actions
  fetchSessions: () => Promise<void>
  startSession: (taskName?: string) => Promise<void>
  endSession: () => Promise<void>
  setFocusMode: (active: boolean) => void
  tickTimer: () => void
  resetTimer: () => void
  setCurrentSession: (session: FocusSession | null) => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSession: null,
  sessions: [],
  isLoading: false,
  focusModeActive: false,
  elapsedSeconds: 0,
  timerInterval: null,

  fetchSessions: async () => {
    set({ isLoading: true })
    try {
      const res = await sessionsApi.list()
      set({ sessions: res.data })
      // Restore active session
      const active = res.data.find((s: FocusSession) => s.is_active)
      if (active) {
        set({ currentSession: active })
        const elapsed = Math.floor(
          (Date.now() - new Date(active.start_time).getTime()) / 1000
        )
        set({ elapsedSeconds: Math.max(0, elapsed) })
        get().setFocusMode(true)
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  startSession: async (taskName?: string) => {
    set({ isLoading: true })
    try {
      const res = await sessionsApi.start(taskName)
      const session: FocusSession = res.data
      set({ currentSession: session, elapsedSeconds: 0 })
      get().setFocusMode(true)

      // Start timer
      const interval = setInterval(() => {
        get().tickTimer()
      }, 1000)
      set({ timerInterval: interval })
    } catch (err) {
      console.error('Failed to start session:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  endSession: async () => {
    const { currentSession, timerInterval } = get()
    if (!currentSession) return

    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval)
      set({ timerInterval: null })
    }

    try {
      const res = await sessionsApi.end(currentSession.id)
      set((state) => ({
        currentSession: null,
        sessions: [res.data, ...state.sessions.filter((s) => s.id !== res.data.id)],
        elapsedSeconds: 0,
        focusModeActive: false,
      }))
    } catch (err) {
      console.error('Failed to end session:', err)
    }
  },

  setFocusMode: (active: boolean) => {
    set({ focusModeActive: active })
    window.electronAPI?.setFocusMode(active)
  },

  tickTimer: () => {
    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }))
  },

  resetTimer: () => {
    const { timerInterval } = get()
    if (timerInterval) clearInterval(timerInterval)
    set({ elapsedSeconds: 0, timerInterval: null })
  },

  setCurrentSession: (session) => set({ currentSession: session }),
}))
