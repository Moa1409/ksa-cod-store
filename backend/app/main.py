from __future__ import annotations

import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import admin, events, health, orders
from app.api.routes.orders import limiter
from app.core.config import settings
from app.core.logging import configure_logging

configure_logging()
log = logging.getLogger(__name__)

STATIC_DIR = Path(__file__).resolve().parent / "static"
ADMIN_HTML = STATIC_DIR / "admin.html"
LOGO_PNG = STATIC_DIR / "logo.png"
FAVICON_ICO = STATIC_DIR / "favicon.ico"

app = FastAPI(title="Lamsa Glow API", version="1.1.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
app.include_router(events.router, prefix="/api", tags=["events"])
app.include_router(admin.router, prefix="/api", tags=["admin"])


@app.get("/admin", include_in_schema=False)
@app.get("/admin/", include_in_schema=False)
@app.get("/admin.html", include_in_schema=False)
def admin_dashboard_page() -> FileResponse:
    """COD admin UI — served from API so it works even if the Next.js app is stale."""
    if not ADMIN_HTML.is_file():
        raise HTTPException(status_code=404, detail="admin.html missing")
    return FileResponse(ADMIN_HTML, media_type="text/html; charset=utf-8")


@app.get("/logo.png", include_in_schema=False)
def admin_logo() -> FileResponse:
    if not LOGO_PNG.is_file():
        raise HTTPException(status_code=404, detail="logo missing")
    return FileResponse(LOGO_PNG, media_type="image/png")


@app.get("/favicon.ico", include_in_schema=False)
def admin_favicon() -> FileResponse:
    if not FAVICON_ICO.is_file():
        raise HTTPException(status_code=404, detail="favicon missing")
    return FileResponse(FAVICON_ICO, media_type="image/x-icon")


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
