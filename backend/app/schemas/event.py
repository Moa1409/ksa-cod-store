from __future__ import annotations

from pydantic import BaseModel


class EventContent(BaseModel):
    id: str
    quantity: int = 1
    price: float | None = None
    name: str | None = None


class EventUserData(BaseModel):
    ph: str | None = None  # raw phone (hashed server-side)
    fn: str | None = None  # raw first name
    external_id: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    sc_click_id: str | None = None
    user_agent: str | None = None


class TrackEventIn(BaseModel):
    event_name: str  # PageView | ViewContent | AddToCart | InitiateCheckout | Purchase
    event_id: str
    value: float | None = None
    currency: str = "SAR"
    contents: list[EventContent] = []
    num_items: int = 0
    event_source_url: str | None = None
    user_data: EventUserData | None = None
