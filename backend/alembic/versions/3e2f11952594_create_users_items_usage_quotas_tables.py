"""create users items usage_quotas tables

Revision ID: 3e2f11952594
Revises: 
Create Date: 2026-04-19 01:42:51.065044

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3e2f11952594'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("whatsapp", sa.String(), nullable=True),
        sa.Column("plan", sa.String(), nullable=False, server_default="free"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("item_type", sa.String(), nullable=False, server_default="clothing_2d"),
        sa.Column("status", sa.String(), nullable=False, server_default="pending"),
        sa.Column("job_id", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("asset_id_roblox", sa.String(), nullable=True),
        sa.Column("marketplace_url", sa.String(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_items_user_id", "items", ["user_id"])

    op.create_table(
        "usage_quotas",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("period_month", sa.String(), nullable=False),
        sa.Column("items_2d_used", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("items_3d_used", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_index("ix_usage_quotas_user_id", "usage_quotas", ["user_id"])
    op.create_index("ix_usage_quotas_period_month", "usage_quotas", ["period_month"])


def downgrade() -> None:
    op.drop_table("usage_quotas")
    op.drop_table("items")
    op.drop_table("users")
