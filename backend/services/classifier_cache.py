from collections import OrderedDict
from typing import Optional

class ClassifierCache:
    def __init__(self, maxsize: int = 200):
        self.cache = OrderedDict()
        self.maxsize = maxsize
        self.hits = 0
        self.misses = 0

    def _get_key(self, app_name: str, title: str) -> str:
        return f"{app_name.lower()}_{title.lower()[:50]}"

    def get_cached(self, app_name: str, title: str) -> Optional[dict]:
        key = self._get_key(app_name, title)
        if key in self.cache:
            self.cache.move_to_end(key)
            self.hits += 1
            return self.cache[key]
        self.misses += 1
        return None

    def set_cached(self, app_name: str, title: str, result: dict):
        key = self._get_key(app_name, title)
        self.cache[key] = result
        self.cache.move_to_end(key)
        if len(self.cache) > self.maxsize:
            self.cache.popitem(last=False)

    def clear_cache(self):
        self.cache.clear()
        self.hits = 0
        self.misses = 0

    def get_stats(self) -> dict:
        return {
            "hits": self.hits,
            "misses": self.misses,
            "size": len(self.cache)
        }

# Singleton instance
classifier_cache = ClassifierCache()
