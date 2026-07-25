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
