# Importar todos os models aqui garante que o SQLModel os registre antes do Alembic
from app.models.item import Item, ItemStatus, ItemType
from app.models.quota import UsageQuota
from app.models.user import Plan, User

__all__ = ["User", "Plan", "Item", "ItemStatus", "ItemType", "UsageQuota"]
