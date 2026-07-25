PRODUCTIVE_KEYWORDS = [
    "vscode", "visual studio code", "pycharm", "intellij", "jupyter", "google docs",
    "google sheets", "notion", "figma", "leetcode", "stackoverflow", "github",
    "gitlab", "terminal", "cmd", "powershell", "bash", "zsh", "word", "excel",
    "overleaf", "arxiv", "pubmed", "chatgpt", "cursor", "android studio"
]

DISTRACTION_KEYWORDS = [
    "instagram", "facebook", "twitter", "x.com", "tiktok", "netflix", "prime video",
    "hotstar", "discord", "steam", "reddit", "9gag", "snapchat", "pinterest"
]

def classify(app_name: str, window_title: str) -> dict:
    app_lower = app_name.lower()
    title_lower = window_title.lower()
    
    # Special handling for YouTube
    if "youtube" in app_lower or "youtube" in title_lower:
        educational_terms = ["tutorial", "course", "learn", "lecture", "how to", "programming", "python", "javascript"]
        if any(term in title_lower for term in educational_terms):
            return {
                "classification": "PRODUCTIVE",
                "confidence": 0.8,
                "category": "Study",
                "source": "rule_fallback"
            }
        else:
            return {
                "classification": "DISTRACTION",
                "confidence": 0.8,
                "category": "Entertainment",
                "source": "rule_fallback"
            }
            
    for keyword in PRODUCTIVE_KEYWORDS:
        if keyword in app_lower or keyword in title_lower:
            return {
                "classification": "PRODUCTIVE",
                "confidence": 0.9,
                "category": "Work/Study",
                "source": "rule_fallback"
            }
            
    for keyword in DISTRACTION_KEYWORDS:
        if keyword in app_lower or keyword in title_lower:
            return {
                "classification": "DISTRACTION",
                "confidence": 0.9,
                "category": "Social/Entertainment",
                "source": "rule_fallback"
            }
            
    return {
        "classification": "NEUTRAL",
        "confidence": 0.5,
        "category": "Other",
        "source": "rule_fallback"
    }
