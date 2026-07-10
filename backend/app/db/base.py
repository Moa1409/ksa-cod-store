from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# NOTE: models must be imported before using Base.metadata (e.g. in Alembic's
# env.py: `import app.models`). We avoid importing them here to prevent a
# circular import (models import Base from this module).
