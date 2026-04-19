from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class Plan(str, Enum):
    free = "free"
    creator = "creator"
    studio = "studio"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    name: str
    whatsapp: str | None = None
    plan: Plan = Field(default=Plan.free)
    created_at: datetime = Field(default_factory=datetime.utcnow)
