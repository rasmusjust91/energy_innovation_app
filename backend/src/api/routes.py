from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from src.models.database import Idea, Comment
from src.models.idea_model import IdeaCreate, CommentCreate, IdeaResponse, CommentResponse, StatusUpdate
from src.utils.db import get_db

router = APIRouter()

@router.post("/ideas", response_model=IdeaResponse, description="Submit a new idea")
def create_idea(idea: IdeaCreate, db: Session = Depends(get_db)):
    new_idea = Idea(
        title=idea.title,
        description=idea.description,
        category=idea.category,
        submitter=idea.submitter,
        created_at=datetime.now(),
        status="under review"  # Default status
    )
    db.add(new_idea)
    db.commit()
    db.refresh(new_idea)
    return new_idea

@router.get("/ideas", response_model=List[IdeaResponse], description="Retrieve ideas (with optional filters)")
def get_ideas(category: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Idea)
    if category:
        query = query.filter(Idea.category == category)
    if status:
        query = query.filter(Idea.status == status)
    return query.all()

@router.put("/ideas/{id}", response_model=IdeaResponse, description="Update the status of an idea")
def update_idea_status(id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    idea = db.query(Idea).filter(Idea.id == id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    idea.status = status_update.status
    db.commit()
    db.refresh(idea)
    return idea

@router.post("/ideas/{id}/comments", response_model=CommentResponse, description="Add a comment to an idea")
def add_comment_to_idea(id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    idea = db.query(Idea).filter(Idea.id == id).first()
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    new_comment = Comment(
        idea_id=id,
        content=comment.content,
        author=comment.author,
        created_at=datetime.now()
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.get("/ideas/{idea_id}/comments", response_model=List[CommentResponse], description="Retrieve comments for a specific idea")
def get_comments_for_idea(idea_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.idea_id == idea_id).all()
    if not comments:
        raise HTTPException(status_code=404, detail="Comments not found")
    return comments