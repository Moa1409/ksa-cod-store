"""Widen order_number to fit SKU-based references.

Revision ID: 0004_order_number_sku_length
Revises: 0003_admin_analytics
Create Date: 2026-07-31
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004_order_number_sku_length"
down_revision: Union[str, None] = "0003_admin_analytics"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "orders",
        "order_number",
        existing_type=sa.String(length=32),
        type_=sa.String(length=64),
        existing_nullable=False,
    )
    op.alter_column(
        "tracking_events",
        "order_number",
        existing_type=sa.String(length=32),
        type_=sa.String(length=64),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "tracking_events",
        "order_number",
        existing_type=sa.String(length=64),
        type_=sa.String(length=32),
        existing_nullable=True,
    )
    op.alter_column(
        "orders",
        "order_number",
        existing_type=sa.String(length=64),
        type_=sa.String(length=32),
        existing_nullable=False,
    )
