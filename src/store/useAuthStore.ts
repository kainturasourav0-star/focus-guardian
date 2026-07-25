import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  isDemoMode: boolean
  user: { email: string; name: string } | null
  login: (email: string, name: string) => void
  enableDemo: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isDemoMode: false,
      user: null,
      login: (email, name) =>
        set({
          isAuthenticated: true,
          isDemoMode: false,
          user: { email, name: name || 'Focus Guardian User' },
        }),
      enableDemo: () =>
        set({
          isAuthenticated: true,
          isDemoMode: true,
          user: { email: 'demo@focusguardian.com', name: 'Demo Explorer' },
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          isDemoMode: false,
          user: null,
        }),
    }),
    {
      name: 'focus-guardian-auth',
    }
  )
)
