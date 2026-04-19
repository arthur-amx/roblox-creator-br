from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel


class ItemType(str, Enum):
    clothing_2d = "clothing_2d"
    model_3d = "model_3d"


class ItemStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    preview_ready = "preview_ready"
    uploading = "uploading"
    published = "published"
    rejected = "rejected"
    failed = "failed"


class Item(SQLModel, table=True):
    __tablename__ = "items"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str
    prompt: str
    item_type: ItemType = Field(default=ItemType.clothing_2d)
    status: ItemStatus = Field(default=ItemStatus.pending)
    job_id: Optional[str] = None
    image_url: Optional[str] = None
    asset_id_roblox: Optional[str] = None
    marketplace_url: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
