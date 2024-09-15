from pydantic import BaseModel, ConfigDict
from datetime import datetime

class IdeaBase(BaseModel):
    title: str
    description: str
    category: str
    submitter: str

class IdeaCreate(IdeaBase):
    pass

class IdeaResponse(IdeaBase):
    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CommentBase(BaseModel):
    content: str
    author: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    idea_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StatusUpdate(BaseModel):
    status: str
