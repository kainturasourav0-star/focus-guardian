import google.generativeai as genai
import random

STATIC_TIPS = [
    "Take a deep breath and gently return your focus.",
    "Remember your goals - a quick reset can get you back on track.",
    "It's normal to get distracted. Just course-correct now.",
    "You've got this! Close the distraction and refocus.",
    "Is this bringing you closer to your target today?",
    "Every minute of focus counts.",
    "Small steps lead to big progress. Back to work!",
    "Distractions happen. Acknowledge it, and switch back.",
    "Time is your most valuable asset.",
    "Let's get back to the zone!"
]

def get_coaching_message(recent_activities: list[dict], api_key: str) -> str:
    if not api_key:
        return random.choice(STATIC_TIPS)
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        apps = ", ".join([f"{a['app_name']} ({a['classification']})" for a in recent_activities])
        
        prompt = f"""
        You are a highly supportive, concise productivity coach.
        The user has been distracted recently. Recent apps used: {apps}.
        
        Provide exactly one short sentence of encouragement to get them back on track.
        Do not be judgmental or harsh. Be motivating.
        """
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text:
            return text
            
    except Exception as e:
        print(f"Coach error: {e}")
        
    return random.choice(STATIC_TIPS)
