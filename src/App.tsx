import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import AICoachFloat from './components/layout/AICoachFloat';
import Dashboard from './pages/Dashboard';
import FocusMode from './pages/FocusMode';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Goals from './pages/Goals';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useSessionStore } from './store/useSessionStore';
import { useGoalStore } from './store/useGoalStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useMonitorStore } from './store/useMonitorStore';
import { useAuthStore } from './store/useAuthStore';
import { useWebSocket } from './hooks/useWebSocket';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { DistractionNotification } from './components/ui/Notification';
import { ToastContainer } from './components/ui/ToastContainer';

export default function App() {
  const { fetchSessions } = useSessionStore();
  const { fetchGoals } = useGoalStore();
  const { fetchSettings } = useSettingsStore();
  const { isAuthenticated, isDemoMode } = useAuthStore();
  const [booting, setBooting] = useState(true);

  // Initialize WebSocket connection globally
  useWebSocket();

  useEffect(() => {
    const initialize = async () => {
      try {
        if (isAuthenticated && !isDemoMode) {
          await fetchSettings();
          await fetchSessions();
          await fetchGoals();
        }
      } catch (err) {
        console.error('Failed to initialize app', err);
      } finally {
        setBooting(false);
      }
    };
    initialize();
  }, [isAuthenticated, isDemoMode, fetchSessions, fetchGoals, fetchSettings]);

  // Demo Mode Simulation
  useEffect(() => {
    if (!isAuthenticated || !isDemoMode) return;

    // Seed mock data for stores immediately
    const mockGoals = [
      { id: 1, title: 'Code Focus Guardian', type: 'coding', target_hours: 6, current_hours: 4.5, completed: false, created_at: new Date().toISOString() },
      { id: 2, title: 'Read Rust Docs', type: 'reading', target_hours: 2, current_hours: 1, completed: false, created_at: new Date().toISOString() },
      { id: 3, title: 'Math practice', type: 'study', target_hours: 4, current_hours: 4, completed: true, created_at: new Date().toISOString() }
    ];
    
    useSettingsStore.getState().setSettings({
      id: 1,
      warning_threshold_minutes: 5,
      focus_duration_minutes: 25,
      break_duration_minutes: 5,
      idle_threshold_seconds: 90,
      dark_mode: true,
      notifications_enabled: true,
      allowed_apps: ['VS Code', 'Terminal'],
      blocked_websites: ['instagram.com', 'facebook.com'],
      gemini_api_key: null
    });

    useGoalStore.setState({
      goals: mockGoals,
      totalTargetHoursToday: 8,
      totalCurrentHoursToday: 5.5
    });

    const mockSessions = [
      { id: 101, start_time: new Date(Date.now() - 3600000).toISOString(), end_time: new Date().toISOString(), task_name: 'Developing Vercel integrations', productivity_score: 88, distraction_count: 2, idle_seconds: 60, notes: '', is_active: false },
      { id: 102, start_time: new Date(Date.now() - 7200000).toISOString(), end_time: new Date(Date.now() - 5400000).toISOString(), task_name: 'Debugging CSS compiling', productivity_score: 95, distraction_count: 0, idle_seconds: 10, notes: '', is_active: false }
    ];
    useSessionStore.setState({ sessions: mockSessions });

    // Seed monitor values
    useMonitorStore.getState().setTimeFocusedToday(195);
    useMonitorStore.getState().setTimeDistractedToday(42);
    useMonitorStore.getState().setFocusSessionCount(2);

    // Simulate active window tracing loop
    const appsList = [
      { app_name: 'VS Code', window_title: 'main.tsx - focus-guardian', classification: 'PRODUCTIVE' },
      { app_name: 'Google Chrome', window_title: 'Vercel Deployment Dashboard', classification: 'PRODUCTIVE' },
      { app_name: 'Terminal', window_title: 'pnpm dev', classification: 'PRODUCTIVE' },
      { app_name: 'Discord', window_title: '#hackathon-chat', classification: 'DISTRACTION' },
      { app_name: 'Spotify', window_title: 'Chill Lofi Beats', classification: 'NEUTRAL' }
    ];

    let idx = 0;
    const interval = setInterval(() => {
      const active = appsList[idx % appsList.length];
      useMonitorStore.getState().setCurrentApp(active.app_name, active.window_title, active.classification as any);
      
      const scores = [82, 85, 88, 79, 81];
      useMonitorStore.getState().setProductivityScore(scores[idx % scores.length]);

      if (idx % 3 === 0) {
        const coachTips = [
          "Amazing focus block! Keep coding in VS Code.",
          "You've been in Discord for a bit. Ready to get back to coding?",
          "Take a 5-minute break. Stretch and grab some water!"
        ];
        useMonitorStore.getState().setCoachMessage(coachTips[Math.floor(idx / 3) % coachTips.length]);
      }
      
      idx++;
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isDemoMode]);

  // Loader during initial boots
  if (isAuthenticated && booting && !isDemoMode) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: '#09090B' }}>
        <div className="text-center">
          <LoadingSpinner size="lg" message="Starting Focus Guardian..." />
        </div>
      </div>
    );
  }

  // Not logged in -> Render login screen with entrance animations
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen flex flex-col justify-center items-center" style={{ background: '#09090B' }}>
        <Login />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div
        className="flex h-screen w-screen flex-col overflow-hidden text-white selection:bg-purple-500/30"
        style={{ background: '#09090B' }}
      >
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/focus" element={<FocusMode />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        {/* Global overlays */}
        <DistractionNotification />
        <AICoachFloat />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
