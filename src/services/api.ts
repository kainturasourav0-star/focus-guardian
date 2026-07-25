import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'
import { useSessionStore } from '../store/useSessionStore'
import { useGoalStore } from '../store/useGoalStore'
import { useSettingsStore } from '../store/useSettingsStore'

const BASE_URL = 'http://127.0.0.1:8000'

let sharedSecret: string | null = null

async function getSecret(): Promise<string> {
  if (sharedSecret) return sharedSecret
  if (window.electronAPI?.getSharedSecret) {
    sharedSecret = await window.electronAPI.getSharedSecret()
  } else {
    sharedSecret = 'fg-dev-secret-2024'
  }
  return sharedSecret
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Inject auth header and mock requests in Demo Mode
apiClient.interceptors.request.use(async (config) => {
  const { isDemoMode } = useAuthStore.getState()
  
  if (isDemoMode) {
    const url = config.url || ''
    const method = config.method || 'get'
    let data: any = null

    if (url.includes('/api/health')) {
      data = { status: 'ok', db: 'connected' }
    } else if (url.includes('/api/settings')) {
      if (method === 'get') {
        data = useSettingsStore.getState().settings
      } else {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
        const updated = { ...useSettingsStore.getState().settings, ...body }
        useSettingsStore.getState().setSettings(updated)
        data = updated
      }
    } else if (url.includes('/api/sessions')) {
      if (url.includes('/start')) {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
        const newSession = {
          id: Math.floor(Math.random() * 1000),
          start_time: new Date().toISOString(),
          end_time: null,
          task_name: body?.task_name || 'Active Task',
          productivity_score: 100,
          distraction_count: 0,
          idle_seconds: 0,
          notes: '',
          is_active: true
        }
        const current = useSessionStore.getState().sessions
        useSessionStore.setState({ sessions: [newSession, ...current] })
        data = newSession
      } else if (url.match(/\/api\/sessions\/\d+\/end/)) {
        const match = url.match(/\/api\/sessions\/(\d+)\/end/)
        const id = match ? parseInt(match[1]) : 0
        const current = useSessionStore.getState().sessions.map(s => 
          s.id === id ? { ...s, end_time: new Date().toISOString(), is_active: false, productivity_score: 92 } : s
        )
        useSessionStore.setState({ sessions: current })
        data = current.find(s => s.id === id)
      } else if (url.match(/\/api\/sessions\/\d+/)) {
        const match = url.match(/\/api\/sessions\/(\d+)/)
        const id = match ? parseInt(match[1]) : 0
        if (method === 'delete') {
          const current = useSessionStore.getState().sessions.filter(s => s.id !== id)
          useSessionStore.setState({ sessions: current })
          data = { status: 'deleted' }
        }
      } else {
        data = useSessionStore.getState().sessions
      }
    } else if (url.includes('/api/goals')) {
      const match = url.match(/\/api\/goals\/(\d+)/)
      const id = match ? parseInt(match[1]) : 0
      
      if (url.includes('/complete')) {
        const current = useGoalStore.getState().goals.map(g => 
          g.id === id ? { ...g, completed: true } : g
        )
        useGoalStore.setState({ goals: current })
        data = current.find(g => g.id === id)
      } else if (method === 'post') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
        const newGoal = {
          id: Math.floor(Math.random() * 1000),
          title: body?.title || 'New Goal',
          type: body?.type || 'coding',
          target_hours: body?.target_hours || 4,
          current_hours: 0,
          completed: false,
          created_at: new Date().toISOString()
        }
        const current = useGoalStore.getState().goals
        useGoalStore.setState({ goals: [...current, newGoal] })
        data = newGoal
      } else if (method === 'delete') {
        const current = useGoalStore.getState().goals.filter(g => g.id !== id)
        useGoalStore.setState({ goals: current })
        data = { status: 'deleted' }
      } else {
        data = useGoalStore.getState().goals
      }
    } else if (url.includes('/api/analytics')) {
      if (url.includes('/weekly')) {
        data = [
          { day: 'Mon', focus_minutes: 240, distract_minutes: 30, score: 85 },
          { day: 'Tue', focus_minutes: 310, distract_minutes: 20, score: 91 },
          { day: 'Wed', focus_minutes: 180, distract_minutes: 45, score: 78 },
          { day: 'Thu', focus_minutes: 290, distract_minutes: 15, score: 88 },
          { day: 'Fri', focus_minutes: 340, distract_minutes: 10, score: 93 },
          { day: 'Sat', focus_minutes: 120, distract_minutes: 50, score: 70 },
          { day: 'Sun', focus_minutes: 90, distract_minutes: 60, score: 60 }
        ]
      } else if (url.includes('/heatmap')) {
        data = Array.from({ length: 168 }, (_, i) => ({
          weekday: Math.floor(i / 24),
          hour: i % 24,
          focus_minutes: Math.random() > 0.4 ? Math.floor(Math.random() * 60) : 0
        }))
      } else if (url.includes('/top-apps')) {
        data = [
          { app_name: 'VS Code', classification: 'productive', minutes: 420 },
          { app_name: 'Chrome', classification: 'productive', minutes: 180 },
          { app_name: 'Discord', classification: 'distraction', minutes: 60 },
          { app_name: 'Terminal', classification: 'productive', minutes: 50 },
          { app_name: 'Spotify', classification: 'neutral', minutes: 40 }
        ]
      }
    } else if (url.includes('/api/insights')) {
      data = [
        "You maintained an average focus score of 87% this week, which is 5% higher than last week.",
        "Consider limiting Discord usage in the morning — it accounts for 65% of your distraction time.",
        "Completed focus sessions: 8/10. Great job staying committed to your goals!",
        "Try scheduling focus blocks between 9 AM and 11 AM, when your focus score peaks."
      ]
    } else if (url.includes('/api/interventions')) {
      data = { status: 'logged' }
    }

    return Promise.reject({
      mock: true,
      response: {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      }
    })
  }

  const secret = await getSecret()
  config.headers['X-Focus-Guardian-Secret'] = secret
  return config
})

// Resolve mocked requests correctly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.mock) {
      return Promise.resolve(error.response)
    }
    return Promise.reject(error)
  }
)

// ─── Sessions ────────────────────────────────────────────────────────────────
export const sessionsApi = {
  list: () => apiClient.get('/api/sessions'),
  start: (taskName?: string) =>
    apiClient.post('/api/sessions/start', { task_name: taskName }),
  end: (id: number) => apiClient.post(`/api/sessions/${id}/end`),
  get: (id: number) => apiClient.get(`/api/sessions/${id}`),
  delete: (id: number) => apiClient.delete(`/api/sessions/${id}`),
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsApi = {
  daily: (date?: string) =>
    apiClient.get('/api/analytics/daily', { params: { date } }),
  weekly: () => apiClient.get('/api/analytics/weekly'),
  heatmap: () => apiClient.get('/api/analytics/heatmap'),
  topApps: () => apiClient.get('/api/analytics/top-apps'),
}

// ─── Goals ───────────────────────────────────────────────────────────────────
export const goalsApi = {
  list: () => apiClient.get('/api/goals'),
  create: (data: object) => apiClient.post('/api/goals', data),
  update: (id: number, data: object) => apiClient.put(`/api/goals/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/goals/${id}`),
  complete: (id: number) => apiClient.patch(`/api/goals/${id}/complete`),
}

// ─── Settings ────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => apiClient.get('/api/settings'),
  update: (data: object) => apiClient.put('/api/settings', data),
}

// ─── Insights ────────────────────────────────────────────────────────────────
export const insightsApi = {
  get: (date?: string) =>
    apiClient.get('/api/insights', { params: { date } }),
}

// ─── Interventions ────────────────────────────────────────────────────────────
export const interventionsApi = {
  log: (data: { session_id?: number; action: string; app_name: string }) =>
    apiClient.post('/api/interventions', data),
}

// ─── Health ───────────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => axios.get(`${BASE_URL}/api/health`, { timeout: 3000 }),
}
