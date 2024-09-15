# src/models/database.py

from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
from datetime import datetime

DATABASE_URL = "sqlite:///./data/innovation.db"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})  # SQLite specific
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Idea Model
class Idea(Base):
    __tablename__ = "ideas"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    submitter = Column(String)
    status = Column(String, default="under review")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    comments = relationship("Comment", back_populates="idea")

# Comment Model
class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"))
    content = Column(String)
    author = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    idea = relationship("Idea", back_populates="comments")
