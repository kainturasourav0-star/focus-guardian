import google.generativeai as genai
from datetime import date
from sqlalchemy.orm import Session
from backend.services.analytics import AnalyticsEngine

def generate_insights(target_date: date, db: Session, api_key: str) -> list[str]:
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
        return fallback_insights
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Act as an expert productivity analyst. Review the following daily statistics and provide 4-5 concise, actionable bullet points of insight.
        Focus Minutes: {stats['focus_minutes']}
        Distraction Minutes: {stats['distraction_minutes']}
        Score: {stats['productivity_score']}
        Sessions: {stats['session_count']}
        Top Apps: {', '.join([f"{a['app_name']} ({a['minutes']}m)" for a in stats['top_apps']])}
        
        Return ONLY the bullet points (one per line, starting with '- '). No introductory or concluding text.
        """
        
        response = model.generate_content(prompt)
        lines = [line.strip().lstrip('- ') for line in response.text.strip().split('\n') if line.strip()]
        return lines if lines else fallback_insights
        
    except Exception as e:
        print(f"Insights error: {e}")
        return fallback_insights
