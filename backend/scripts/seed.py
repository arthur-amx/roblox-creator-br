"""
Script de seed para ambiente de desenvolvimento.
Uso: python scripts/seed.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime

from sqlmodel import Session

from app.core.database import create_db_and_tables, engine
from app.models.item import Item, ItemStatus, ItemType
from app.models.quota import UsageQuota
from app.models.user import Plan, User


def seed():
    create_db_and_tables()

    with Session(engine) as session:
        # Usuário de teste
        user = User(
            email="dev@robloxcreator.com.br",
            hashed_password="$2b$12$placeholder_hash",  # senha: dev123
            name="Dev User",
            whatsapp="5511999999999",
            plan=Plan.creator,
            created_at=datetime.utcnow(),
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        # Item de exemplo
        item = Item(
            user_id=user.id,
            title="Camisa Azul com Dragão",
            prompt="camisa azul com dragão japonês nas costas, estilo anime",
            item_type=ItemType.clothing_2d,
            status=ItemStatus.published,
            asset_id_roblox="123456789",
            marketplace_url="https://www.roblox.com/catalog/123456789",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        session.add(item)

        # Cota do mês atual
        quota = UsageQuota(
            user_id=user.id,
            period_month=datetime.utcnow().strftime("%Y-%m"),
            items_2d_used=1,
            items_3d_used=0,
        )
        session.add(quota)
        session.commit()

        print(f"Seed concluído. Usuário criado: {user.email} (id={user.id})")


if __name__ == "__main__":
    seed()
