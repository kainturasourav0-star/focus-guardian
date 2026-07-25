import sys
from backend.adapters.base import BaseWindowMonitor, WindowInfo

class WindowsAdapter(BaseWindowMonitor):
    def is_available(self) -> bool:
        return sys.platform == 'win32'
        
    def get_active_window(self) -> WindowInfo | None:
        if not self.is_available():
            return None
            
        try:
            import pygetwindow as gw
            window = gw.getActiveWindow()
            if not window:
                return None
            
            title = window.title
            if not title:
                return None
                
            # Extract app name from title (heuristically last part)
            parts = title.split(' - ')
            if len(parts) == 1:
                parts = title.split(' — ')
            
            app_name = parts[-1].strip() if len(parts) > 1 else title
            return WindowInfo(app_name=app_name, window_title=title)
            
        except Exception as e:
            print(f"Error getting windows active window: {e}")
            return None
