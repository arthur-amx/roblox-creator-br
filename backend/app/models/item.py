from datetime import datetime
from enum import Enum

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

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str
    prompt: str
    item_type: ItemType = Field(default=ItemType.clothing_2d)
    status: ItemStatus = Field(default=ItemStatus.pending)
    job_id: str | None = None
    image_url: str | None = None
    asset_id_roblox: str | None = None
    marketplace_url: str | None = None
    error_message: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
