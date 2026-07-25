import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

/**
 * Axios instance configured for the FastAPI backend.
 * The shared secret header is injected on first request via the
 * request interceptor — avoids async complexity in every call site.
 */
let sharedSecret: string | null = null

async function getSecret(): Promise<string> {
  if (sharedSecret) return sharedSecret
  // In Electron context, get from preload bridge
  if (window.electronAPI?.getSharedSecret) {
    sharedSecret = await window.electronAPI.getSharedSecret()
  } else {
    // Dev fallback
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

// Inject auth header on every request
apiClient.interceptors.request.use(async (config) => {
  const secret = await getSecret()
  config.headers['X-Focus-Guardian-Secret'] = secret
  return config
})

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
