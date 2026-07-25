import asyncio
import random

try:
    from google import genai as google_genai
    USE_NEW_SDK = True
except ImportError:
    try:
        import google.generativeai as genai_legacy
        USE_NEW_SDK = False
    except ImportError:
        USE_NEW_SDK = False
        genai_legacy = None

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

async def get_coaching_message_async(recent_activities: list[dict], api_key: str) -> str:
    if not api_key:
        import os
        api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return random.choice(STATIC_TIPS)
        
    apps = ", ".join([f"{a['app_name']} ({a['classification']})" for a in recent_activities])
    prompt = f"""
    You are a highly supportive, concise productivity coach.
    The user has been distracted recently. Recent apps used: {apps}.
    
    Provide exactly one short sentence of encouragement to get them back on track.
    Do not be judgmental or harsh. Be motivating.
    """

    try:
        loop = asyncio.get_event_loop()
        
        if USE_NEW_SDK:
            client = google_genai.Client(api_key=api_key)
            response = await asyncio.wait_for(
                loop.run_in_executor(
                    None,
                    lambda: client.models.generate_content(
                        model="gemini-2.0-flash",
                        contents=prompt,
                    )
                ),
                timeout=8.0
            )
            text = response.text
        else:
            if genai_legacy is None:
                return random.choice(STATIC_TIPS)
            genai_legacy.configure(api_key=api_key)
            model = genai_legacy.GenerativeModel('gemini-1.5-flash')
            response = await asyncio.wait_for(
                loop.run_in_executor(None, lambda: model.generate_content(prompt)),
                timeout=8.0
            )
            text = response.text
            
        text = text.strip()
        if text:
            return text
            
    except Exception as e:
        print(f"Coach error: {e}")
        
    return random.choice(STATIC_TIPS)
