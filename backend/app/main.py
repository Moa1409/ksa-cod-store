from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import events, health, orders
from app.api.routes.orders import limiter
from app.core.config import settings
from app.core.logging import configure_logging

configure_logging()
log = logging.getLogger(__name__)

app = FastAPI(title="Lamsa Glow API", version="1.0.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
app.include_router(events.router, prefix="/api", tags=["events"])


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    log.exception("unhandled error on %s: %s", request.url.path, exc)
    return JSONResponse(status_code=500, content={"detail": "internal server error"})


@app.on_event("startup")
def on_startup() -> None:
    log.info("Lamsa Glow API starting (env=%s)", settings.ENV)
    if not settings.GOOGLE_SHEET_WEBHOOK_URL:
        log.warning("Google Sheet webhook not configured")
    if not settings.ENABLE_CAPI:
        log.warning("CAPI disabled")
