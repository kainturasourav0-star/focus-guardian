import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { currentSession } = useSessionStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only trigger with Ctrl + Shift
      if (!e.ctrlKey || !e.shiftKey) return;

      switch (e.key.toUpperCase()) {
        case 'F':
          e.preventDefault();
          navigate('/focus');
          break;
        case 'B':
          e.preventDefault();
          navigate('/settings');
          break;
        case 'P':
          e.preventDefault();
          // Pause is handled inside FocusMode, just navigate there
          navigate('/focus');
          break;
        case 'R':
          e.preventDefault();
          navigate('/analytics');
          break;
        case 'A':
          e.preventDefault();
          navigate('/insights');
          break;
        case 'H':
          e.preventDefault();
          navigate('/achievements');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
}
