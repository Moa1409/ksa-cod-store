from __future__ import annotations

from pydantic import BaseModel, Field


class AdminLoginIn(BaseModel):
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=1, max_length=200)


class AdminLoginOut(BaseModel):
    token: str
    expires_in: int
    username: str


class OrderStatusIn(BaseModel):
    status: str | None = None
    notes: str | None = Field(default=None, max_length=1024)


class SiteTrackIn(BaseModel):
    event_type: str = Field(min_length=1, max_length=32)  # page_view | click
    path: str | None = Field(default=None, max_length=512)
    product_slug: str | None = Field(default=None, max_length=64)
    label: str | None = Field(default=None, max_length=120)
    session_id: str | None = Field(default=None, max_length=64)
    referrer: str | None = Field(default=None, max_length=1024)
    utm: dict | None = None
