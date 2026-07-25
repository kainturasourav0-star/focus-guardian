from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.api.deps import get_database
from backend.models.goal import Goal
from backend.schemas.goal import GoalResponse, GoalCreate, GoalUpdate

router = APIRouter()

@router.get('/api/goals', response_model=List[GoalResponse])
def list_goals(db: Session = Depends(get_database)):
    return db.query(Goal).all()

@router.post('/api/goals', response_model=GoalResponse)
def create_goal(goal_in: GoalCreate, db: Session = Depends(get_database)):
    goal = Goal(**goal_in.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal

@router.put('/api/goals/{goal_id}', response_model=GoalResponse)
def update_goal(goal_id: int, goal_in: GoalUpdate, db: Session = Depends(get_database)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    for key, value in goal_in.model_dump(exclude_unset=True).items():
        setattr(goal, key, value)
        
    db.commit()
    db.refresh(goal)
    return goal

@router.patch('/api/goals/{goal_id}/complete', response_model=GoalResponse)
def complete_goal(goal_id: int, db: Session = Depends(get_database)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    goal.completed = True
    db.commit()
    db.refresh(goal)
    return goal

@router.delete('/api/goals/{goal_id}')
def delete_goal(goal_id: int, db: Session = Depends(get_database)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    db.delete(goal)
    db.commit()
    return {"status": "deleted"}

from pydantic import BaseModel
from backend.models.settings import UserSettings
import os
import json
import asyncio

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

class GoalPlanRequest(BaseModel):
    goals_text: str

@router.post('/api/goals/plan')
async def generate_goal_plan(req: GoalPlanRequest, db: Session = Depends(get_database)):
    settings = db.query(UserSettings).filter(UserSettings.id == 1).first()
    api_key = settings.gemini_api_key if settings else None
    if not api_key:
        api_key = os.getenv("GEMINI_API_KEY")

    prompt = f"""
    The user wants to plan their day with these targets: {req.goals_text}.
    Create a structured timeline (Today's Plan) with 4-6 specific time slots throughout the day.
    Format your response EXACTLY as a JSON array of objects with keys "time" (e.g. "09:00 - 10:30") and "task" (e.g. "DSA practice").
    Return ONLY the raw JSON block without markdown formatting or code fences.
    """

    fallback_plan = [
        {"time": "09:00 – 10:30", "task": f"Focus on goals: {req.goals_text}"},
        {"time": "11:00 – 12:30", "task": "Deep Work Block"},
        {"time": "14:00 – 16:00", "task": "Project Development & Code Review"}
    ]

    if not api_key:
        return {"plan": fallback_plan}

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
                return {"plan": fallback_plan}
            genai_legacy.configure(api_key=api_key)
            model = genai_legacy.GenerativeModel('gemini-1.5-flash')
            response = await asyncio.wait_for(
                loop.run_in_executor(None, lambda: model.generate_content(prompt)),
                timeout=8.0
            )
            text = response.text
            
        text = text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
            
        plan_data = json.loads(text)
        return {"plan": plan_data}
    except Exception as e:
        print(f"Goal Plan generation error: {e}")
        return {"plan": fallback_plan}
