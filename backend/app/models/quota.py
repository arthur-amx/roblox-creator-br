from typing import Optional
from sqlmodel import Field, SQLModel


class UsageQuota(SQLModel, table=True):
    __tablename__ = "usage_quotas"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    period_month: str = Field(index=True)  # formato: "2026-04"
    items_2d_used: int = Field(default=0)
    items_3d_used: int = Field(default=0)
