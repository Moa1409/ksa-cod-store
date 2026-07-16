from __future__ import annotations

from pydantic import BaseModel, Field, field_validator


class OrderItemIn(BaseModel):
    slug: str
    qty: int = Field(ge=1, le=20)


class UpsellIn(BaseModel):
    slug: str
    price: float


class AttributionIn(BaseModel):
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    sc_click_id: str | None = None
    landing_url: str | None = None
    user_agent: str | None = None
    utm: dict | None = None


class OrderIn(BaseModel):
    customer_name: str = Field(min_length=1, max_length=120)
    phone: str
    items: list[OrderItemIn]
    upsell: UpsellIn | None = None
    event_id: str | None = None
    city: str | None = Field(default=None, min_length=2, max_length=80)
    attribution: AttributionIn | None = None

    @field_validator("items")
    @classmethod
    def _non_empty(cls, v: list[OrderItemIn]) -> list[OrderItemIn]:
        if not v:
            raise ValueError("items must not be empty")
        return v


class OrderOut(BaseModel):
    order_number: str
    total: float
    currency: str = "SAR"
