// ─── Shared TypeScript Types for Focus Guardian ───────────────────────────────

// ── Electron API (injected via preload) ──────────────────────────────────────
declare global {
  interface Window {
    electronAPI: {
      minimize: () => void
      maximize: () => void
      close: () => void
      getSharedSecret: () => Promise<string>
      setFocusMode: (active: boolean) => void
      onToggleFocusMode: (callback: (active: boolean) => void) => () => void
      showNotification: (title: string, body: string) => void
      openExternal: (url: string) => void
      getTheme: () => Promise<boolean>
    }
  }
}

// ── Session ───────────────────────────────────────────────────────────────────
export interface FocusSession {
  id: number
  start_time: string
  end_time: string | null
  task_name: string
  productivity_score: number
  distraction_count: number
  idle_seconds: number
  notes: string | null
  is_active: boolean
}

// ── Activity ──────────────────────────────────────────────────────────────────
export type Classification = 'PRODUCTIVE' | 'DISTRACTION' | 'NEUTRAL'

export interface ActivityLog {
  id: number
  session_id: number | null
  timestamp: string
  app_name: string
  window_title: string
  classification: Classification
  confidence: number
  source: 'gemini' | 'rule_fallback'
  duration_seconds: number
  category: string | null
}

// ── Goal ──────────────────────────────────────────────────────────────────────
export type GoalType = 'study' | 'coding' | 'reading' | 'focus_hours' | 'weekly_target'

export interface Goal {
  id: number
  title: string
  type: GoalType
  target_hours: number
  current_hours: number
  deadline: string | null
  completed: boolean
  created_at: string
}

// ── Settings ──────────────────────────────────────────────────────────────────
export interface UserSettings {
  id: number
  warning_threshold_minutes: number
  focus_duration_minutes: number
  break_duration_minutes: number
  idle_threshold_seconds: number
  dark_mode: boolean
  notifications_enabled: boolean
  allowed_apps: string[]
  blocked_websites: string[]
  gemini_api_key: string | null
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export interface AppUsage {
  app_name: string
  minutes: number
  classification: Classification
}

export interface DailyStats {
  date: string
  focus_minutes: number
  distraction_minutes: number
  neutral_minutes: number
  productivity_score: number
  session_count: number
  top_apps: AppUsage[]
}

export interface HeatmapData {
  hour: number
  day: number
  value: number
}

// ── WebSocket Events ──────────────────────────────────────────────────────────
export type WsEventType =
  | 'activity_update'
  | 'distraction_alert'
  | 'coach_message'
  | 'session_update'
  | 'score_update'

export interface WsEvent<T = unknown> {
  type: WsEventType
  data: T
  timestamp: string
}

export interface ActivityUpdateData {
  app_name: string
  window_title: string
  classification: Classification
  confidence: number
  productivity_score: number
  source: string
}

export interface DistractionAlertData {
  app_name: string
  window_title: string
  minutes_on_distraction: number
  threshold_minutes: number
}

// ── Monitor State ─────────────────────────────────────────────────────────────
export interface MonitorState {
  currentApp: string
  currentTitle: string
  currentClassification: Classification
  productivityScore: number
  isConnected: boolean
  lastUpdate: string | null
  distractionAlertVisible: boolean
  distractionAlertData: DistractionAlertData | null
  coachMessage: string | null
}

// ── Intervention ──────────────────────────────────────────────────────────────
export type InterventionAction = 'return_to_work' | 'snooze' | 'ignore'
