import time
import threading

class IdleDetector:
    def __init__(self):
        self.last_input_time = time.time()
        self._running = False
        self._listeners = []
        
    def _on_input(self, *args, **kwargs):
        self.last_input_time = time.time()
        
    def start(self):
        if self._running:
            return
            
        self._running = True
        try:
            from pynput import mouse, keyboard
            
            mouse_listener = mouse.Listener(
                on_move=self._on_input,
                on_click=self._on_input,
                on_scroll=self._on_input
            )
            keyboard_listener = keyboard.Listener(
                on_press=self._on_input
            )
            
            mouse_listener.start()
            keyboard_listener.start()
            
            self._listeners = [mouse_listener, keyboard_listener]
        except ImportError:
            print("pynput not available - idle detection disabled")
            self._running = False
            
    def stop(self):
        self._running = False
        for listener in self._listeners:
            listener.stop()
        self._listeners = []
        
    def seconds_since_last_input(self) -> float:
        if not self._running:
            return 0.0
        return time.time() - self.last_input_time
        
    def is_idle(self, threshold_seconds: int) -> bool:
        if not self._running:
            return False
        return self.seconds_since_last_input() >= threshold_seconds

# Singleton
idle_detector = IdleDetector()
