from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class WindowInfo:
    app_name: str
    window_title: str
    process_name: str = ''

class BaseWindowMonitor(ABC):
    @abstractmethod
    def get_active_window(self) -> WindowInfo | None:
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        pass
