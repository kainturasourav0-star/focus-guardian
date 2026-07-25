import asyncio
from datetime import date
from sqlalchemy.orm import Session
from backend.services.analytics import AnalyticsEngine

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

async def generate_insights_async(target_date: date, db: Session, api_key: str) -> list[str]:
    stats = AnalyticsEngine.get_daily_stats(target_date, db)
    
    fallback_insights = [
        f"You spent {stats['focus_minutes']} minutes doing productive work today.",
        f"Your productivity score is {stats['productivity_score']}/100.",
        f"You completed {stats['session_count']} focus sessions.",
    ]
    if stats['top_apps']:
        top_app = stats['top_apps'][0]
        fallback_insights.append(f"Your most used app was {top_app['app_name']}.")

    if not api_key:
        import os
        api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return fallback_insights
        
    prompt = f"""
    Act as an expert productivity analyst. Review the following daily statistics and provide 4-5 concise, actionable bullet points of insight.
    Focus Minutes: {stats['focus_minutes']}
    Distraction Minutes: {stats['distraction_minutes']}
    Score: {stats['productivity_score']}
    Sessions: {stats['session_count']}
    Top Apps: {', '.join([f"{a['app_name']} ({a['minutes']}m)" for a in stats['top_apps']])}
    
    Return ONLY the bullet points (one per line, starting with '- '). No introductory or concluding text.
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
                return fallback_insights
            genai_legacy.configure(api_key=api_key)
            model = genai_legacy.GenerativeModel('gemini-1.5-flash')
            response = await asyncio.wait_for(
                loop.run_in_executor(None, lambda: model.generate_content(prompt)),
                timeout=8.0
            )
            text = response.text
            
        lines = [line.strip().lstrip('- ') for line in text.strip().split('\n') if line.strip()]
        return lines if lines else fallback_insights
        
    except Exception as e:
        print(f"Insights error: {e}")
        return fallback_insights
