from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import JSON
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.order import Order
from app.models.order_item import OrderItem


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    for table in Base.metadata.tables.values():
        for col in table.columns:
            if isinstance(col.type, JSONB):
                col.type = JSON()

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client, session
    app.dependency_overrides.clear()
    session.close()


def test_create_order_persists_order_items(client):
    test_client, session = client
    payload = {
        "customer_name": "Sara",
        "phone": "0550000000",
        "city": "الرياض",
        "items": [{"slug": "keratin-bond", "qty": 2}],
        "event_id": "pytest_order_1",
    }
    with patch("app.services.geoip.check_order_ip"):
        res = test_client.post("/api/orders", json=payload)

    assert res.status_code == 201, res.text
    data = res.json()
    assert data["total"] == 329
    order = session.scalar(select(Order).where(Order.order_number == data["order_number"]))
    assert order is not None
    rows = session.scalars(select(OrderItem).where(OrderItem.order_id == order.id)).all()
    assert len(rows) == 1
    assert rows[0].slug == "keratin-bond"
