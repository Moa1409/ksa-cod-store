from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.site_event import SiteEvent

ORDER_STATUSES = (
    "new",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
)


def _as_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def parse_range(date_from: str | None, date_to: str | None) -> tuple[datetime, datetime]:
    """Inclusive calendar days in UTC. Defaults: last 30 days → today."""
    today = datetime.now(timezone.utc).date()
    end_d = date.fromisoformat(date_to) if date_to else today
    start_d = date.fromisoformat(date_from) if date_from else (end_d - timedelta(days=29))
    start = datetime(start_d.year, start_d.month, start_d.day, tzinfo=timezone.utc)
    end = datetime(end_d.year, end_d.month, end_d.day, 23, 59, 59, tzinfo=timezone.utc)
    return start, end


def _valid_order_filter():
    """Orders from valid KSA non-VPN traffic (or legacy rows without geo)."""
    return (Order.geo_allowed.is_(True)) | (Order.geo_allowed.is_(None) & Order.geo_vpn.is_not(True))


def dashboard_metrics(db: Session, start: datetime, end: datetime) -> dict[str, Any]:
    # --- Site events (only counted = valid KSA) ---
    page_views = db.scalar(
        select(func.count())
        .select_from(SiteEvent)
        .where(SiteEvent.counted.is_(True))
        .where(SiteEvent.event_type == "page_view")
        .where(SiteEvent.created_at >= start)
        .where(SiteEvent.created_at <= end)
    ) or 0

    clicks = db.scalar(
        select(func.count())
        .select_from(SiteEvent)
        .where(SiteEvent.counted.is_(True))
        .where(SiteEvent.event_type == "click")
        .where(SiteEvent.created_at >= start)
        .where(SiteEvent.created_at <= end)
    ) or 0

    unique_sessions = db.scalar(
        select(func.count(func.distinct(SiteEvent.session_id)))
        .where(SiteEvent.counted.is_(True))
        .where(SiteEvent.created_at >= start)
        .where(SiteEvent.created_at <= end)
        .where(SiteEvent.session_id.is_not(None))
    ) or 0

    # Rejected / not counted traffic (for ops awareness)
    blocked_events = db.scalar(
        select(func.count())
        .select_from(SiteEvent)
        .where(SiteEvent.counted.is_(False))
        .where(SiteEvent.created_at >= start)
        .where(SiteEvent.created_at <= end)
    ) or 0

    # --- Orders (valid KSA) ---
    orders_count = db.scalar(
        select(func.count())
        .select_from(Order)
        .where(Order.created_at >= start)
        .where(Order.created_at <= end)
        .where(_valid_order_filter())
    ) or 0

    revenue = db.scalar(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(Order.created_at >= start)
        .where(Order.created_at <= end)
        .where(_valid_order_filter())
    ) or 0

    upsells = db.scalar(
        select(func.count())
        .select_from(Order)
        .where(Order.created_at >= start)
        .where(Order.created_at <= end)
        .where(_valid_order_filter())
        .where(Order.upsell_taken.is_(True))
    ) or 0

    aov = float(revenue) / orders_count if orders_count else 0.0
    # Conversion: orders / unique sessions (fallback page_views)
    denom = unique_sessions or page_views
    conversion_rate = (orders_count / denom * 100) if denom else 0.0
    click_to_order = (orders_count / clicks * 100) if clicks else 0.0

    # Status breakdown
    status_rows = db.execute(
        select(Order.status, func.count())
        .where(Order.created_at >= start)
        .where(Order.created_at <= end)
        .where(_valid_order_filter())
        .group_by(Order.status)
    ).all()
    by_status = {row[0]: row[1] for row in status_rows}

    # Top products from order_items joined to valid orders
    top_products = db.execute(
        select(
            OrderItem.slug,
            OrderItem.name,
            func.sum(OrderItem.qty).label("qty"),
            func.sum(OrderItem.qty * OrderItem.unit_price).label("revenue"),
        )
        .join(Order, Order.id == OrderItem.order_id)
        .where(Order.created_at >= start)
        .where(Order.created_at <= end)
        .where(_valid_order_filter())
        .group_by(OrderItem.slug, OrderItem.name)
        .order_by(func.sum(OrderItem.qty).desc())
        .limit(8)
    ).all()

    # Daily series
    day_trunc = func.date_trunc("day", Order.created_at)
    daily_orders = db.execute(
        select(day_trunc.label("day"), func.count(), func.coalesce(func.sum(Order.total), 0))
        .where(Order.created_at >= start)
        .where(Order.created_at <= end)
        .where(_valid_order_filter())
        .group_by(day_trunc)
        .order_by(day_trunc)
    ).all()

    ev_day = func.date_trunc("day", SiteEvent.created_at)
    daily_views = db.execute(
        select(ev_day.label("day"), func.count())
        .where(SiteEvent.counted.is_(True))
        .where(SiteEvent.event_type == "page_view")
        .where(SiteEvent.created_at >= start)
        .where(SiteEvent.created_at <= end)
        .group_by(ev_day)
        .order_by(ev_day)
    ).all()

    daily_clicks = db.execute(
        select(ev_day.label("day"), func.count())
        .where(SiteEvent.counted.is_(True))
        .where(SiteEvent.event_type == "click")
        .where(SiteEvent.created_at >= start)
        .where(SiteEvent.created_at <= end)
        .group_by(ev_day)
        .order_by(ev_day)
    ).all()

    # Top click labels
    top_clicks = db.execute(
        select(SiteEvent.label, func.count())
        .where(SiteEvent.counted.is_(True))
        .where(SiteEvent.event_type == "click")
        .where(SiteEvent.created_at >= start)
        .where(SiteEvent.created_at <= end)
        .where(SiteEvent.label.is_not(None))
        .group_by(SiteEvent.label)
        .order_by(func.count().desc())
        .limit(10)
    ).all()

    return {
        "range": {"from": start.date().isoformat(), "to": end.date().isoformat()},
        "traffic": {
            "page_views": int(page_views),
            "clicks": int(clicks),
            "unique_sessions": int(unique_sessions),
            "blocked_or_non_ksa_events": int(blocked_events),
            "note": "Only KSA non-VPN traffic is counted (MaxMind).",
        },
        "orders": {
            "count": int(orders_count),
            "revenue": float(revenue),
            "aov": round(float(aov), 2),
            "upsells": int(upsells),
            "upsell_rate": round((upsells / orders_count * 100) if orders_count else 0.0, 2),
            "by_status": by_status,
        },
        "conversion": {
            "session_to_order_pct": round(conversion_rate, 2),
            "click_to_order_pct": round(click_to_order, 2),
            "view_to_order_pct": round(
                (orders_count / page_views * 100) if page_views else 0.0, 2
            ),
        },
        "top_products": [
            {
                "slug": r[0],
                "name": r[1],
                "qty": int(r[2] or 0),
                "revenue": float(r[3] or 0),
            }
            for r in top_products
        ],
        "top_clicks": [{"label": r[0], "count": int(r[1])} for r in top_clicks],
        "daily": {
            "orders": [
                {
                    "day": _as_aware(r[0]).date().isoformat(),
                    "count": int(r[1]),
                    "revenue": float(r[2] or 0),
                }
                for r in daily_orders
            ],
            "page_views": [
                {"day": _as_aware(r[0]).date().isoformat(), "count": int(r[1])}
                for r in daily_views
            ],
            "clicks": [
                {"day": _as_aware(r[0]).date().isoformat(), "count": int(r[1])}
                for r in daily_clicks
            ],
        },
    }


def list_orders(
    db: Session,
    *,
    start: datetime,
    end: datetime,
    status: str | None = None,
    q: str | None = None,
    page: int = 1,
    page_size: int = 25,
    valid_geo_only: bool = True,
) -> dict[str, Any]:
    page = max(1, page)
    page_size = min(100, max(1, page_size))

    filters = [
        Order.created_at >= start,
        Order.created_at <= end,
    ]
    if valid_geo_only:
        filters.append(_valid_order_filter())
    if status:
        filters.append(Order.status == status)
    if q:
        like = f"%{q.strip()}%"
        filters.append(
            (Order.order_number.ilike(like))
            | (Order.customer_name.ilike(like))
            | (Order.phone.ilike(like))
            | (Order.city.ilike(like))
        )

    total = db.scalar(select(func.count()).select_from(Order).where(*filters)) or 0
    rows = db.scalars(
        select(Order)
        .where(*filters)
        .options(selectinload(Order.order_items))
        .order_by(Order.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    return {
        "total": int(total),
        "page": page,
        "page_size": page_size,
        "orders": [serialize_order(o, detail=False) for o in rows],
    }


def serialize_order(order: Order, *, detail: bool = True) -> dict[str, Any]:
    data: dict[str, Any] = {
        "order_number": order.order_number,
        "status": order.status,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "city": order.city,
        "items": order.items_as_dicts(),
        "num_items": order.num_items,
        "bundle_subtotal": float(order.bundle_subtotal),
        "upsell_taken": order.upsell_taken,
        "upsell_slug": order.upsell_slug,
        "upsell_price": float(order.upsell_price) if order.upsell_price is not None else None,
        "total": float(order.total),
        "currency": order.currency,
        "sheet_synced": order.sheet_synced,
        "geo": {
            "country": order.geo_country,
            "allowed": order.geo_allowed,
            "vpn": order.geo_vpn,
            "reason": order.geo_reason,
            "trait": order.geo_trait,
        },
    }
    if detail:
        data.update(
            {
                "notes": order.notes,
                "landing_url": order.landing_url,
                "utm": order.utm,
                "client_ip": order.client_ip,
                "capi_result": order.capi_result,
                "event_id": order.event_id,
            }
        )
    return data
