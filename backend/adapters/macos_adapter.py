import sys
from backend.adapters.base import BaseWindowMonitor, WindowInfo

class MacOSAdapter(BaseWindowMonitor):
    def is_available(self) -> bool:
        return sys.platform == 'darwin'
        
    def get_active_window(self) -> WindowInfo | None:
        if not self.is_available():
            return None
            
        raise NotImplementedError("macOS monitoring requires AppKit — install with: pip install pyobjc-framework-Cocoa")
