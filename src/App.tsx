import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { useSessionStore } from './store/useSessionStore';
import { useGoalStore } from './store/useGoalStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useWebSocket } from './hooks/useWebSocket';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { DistractionNotification } from './components/ui/Notification';

export default function App() {
  const { fetchSessions } = useSessionStore();
  const { fetchGoals } = useGoalStore();
  const { fetchSettings } = useSettingsStore();
  const [booting, setBooting] = useState(true);

  // Initialize WebSocket connection globally
  useWebSocket();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Mock health check
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetchSettings();
        await fetchSessions();
        await fetchGoals();
      } catch (err) {
        console.error('Failed to initialize app', err);
      } finally {
        setBooting(false);
      }
    };
    initialize();
  }, [fetchSessions, fetchGoals, fetchSettings]);

  if (booting) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="text-center">
          <LoadingSpinner size="lg" message="Starting Focus Guardian..." />
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div
        className="flex h-screen w-screen flex-col overflow-hidden text-white selection:bg-purple-500/30"
        style={{ background: '#0a0a0f' }}
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
            </Routes>
          </main>
        </div>
        {/* Global overlays — always rendered regardless of route */}
        <DistractionNotification />
        <AICoachFloat />
      </div>
    </BrowserRouter>
  );
}
