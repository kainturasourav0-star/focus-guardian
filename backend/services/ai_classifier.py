import json
import asyncio
try:
    from google import genai as google_genai
    from google.genai import types as genai_types
    USE_NEW_SDK = True
except ImportError:
    try:
        import google.generativeai as genai_legacy
        USE_NEW_SDK = False
    except ImportError:
        USE_NEW_SDK = False
        genai_legacy = None
from backend.services.rule_classifier import classify as rule_classify

async def classify_async(app_name: str, window_title: str, api_key: str) -> dict:
    if not api_key:
        return rule_classify(app_name, window_title)

    prompt = f"""Analyze the following active window:
App Name: {app_name}
Window Title: {window_title}

Classify this activity as PRODUCTIVE, DISTRACTION, or NEUTRAL.
Return ONLY valid JSON (no markdown, no code fences).
Schema:
{{
    "classification": "PRODUCTIVE" | "DISTRACTION" | "NEUTRAL",
    "confidence": float (0.0 to 1.0),
    "category": "Work" | "Study" | "Entertainment" | "Social" | "Development" | "Other",
    "reason": "string"
}}"""

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
                return rule_classify(app_name, window_title)
            genai_legacy.configure(api_key=api_key)
            model = genai_legacy.GenerativeModel('gemini-1.5-flash')
            response = await asyncio.wait_for(
                loop.run_in_executor(None, lambda: model.generate_content(prompt)),
                timeout=8.0
            )
            text = response.text

        # Strip markdown code fences if present
        text = text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]

        data = json.loads(text.strip())

        if data.get('confidence', 0.0) < 0.6:
            data['classification'] = 'NEUTRAL'

        data['source'] = 'gemini'
        return data

    except Exception as e:
        print(f"AI classification failed: {e}")
        return rule_classify(app_name, window_title)
