import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.database import Base, engine
from app.routers import admin, alerts, chat, user, weather, websocket
from app.services.auth_service import startup_auth


def _ensure_user_profile_columns() -> None:
    """Add missing columns for user_profiles in existing SQLite databases."""
    required_columns = {
        "mobility_issue": "BOOLEAN",
        "vision_issue": "BOOLEAN",
        "preferred_transport": "VARCHAR(50)",
        "housing_type": "VARCHAR(20)",
        "housing_floor": "VARCHAR(10)",
    }

    inspector = inspect(engine)
    if "user_profiles" not in inspector.get_table_names():
        return

    existing = {col["name"] for col in inspector.get_columns("user_profiles")}

    for name, col_type in required_columns.items():
        if name in existing:
            continue
        with engine.begin() as conn:
            conn.execute(text(f"ALTER TABLE user_profiles ADD COLUMN {name} {col_type}"))
        logger.info("Added missing column user_profiles.%s", name)


def _ensure_emergency_broadcast_columns() -> None:
    """Add missing columns for emergency_broadcasts in existing SQLite databases."""
    required_columns = {
        "cause": "VARCHAR(50)",
        "severity": "VARCHAR(20)",
        "alert_title": "VARCHAR(200)",
        "alert_color": "VARCHAR(20)",
        "actions": "TEXT",
        "triggered_by": "VARCHAR(50)",
        "recipients_count": "INTEGER",
    }

    inspector = inspect(engine)
    if "emergency_broadcasts" not in inspector.get_table_names():
        return

    existing = {col["name"] for col in inspector.get_columns("emergency_broadcasts")}

    for name, col_type in required_columns.items():
        if name in existing:
            continue
        with engine.begin() as conn:
            conn.execute(text(f"ALTER TABLE emergency_broadcasts ADD COLUMN {name} {col_type}"))
        logger.info("Added missing column emergency_broadcasts.%s", name)

# Create all DB tables
os.makedirs("data", exist_ok=True)
Base.metadata.create_all(bind=engine)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Keep local databases compatible when profile fields are added.
_ensure_user_profile_columns()
_ensure_emergency_broadcast_columns()

app = FastAPI(
    title="WeatherSelf API",
    description="Personalized meteorological assistant — hackathon edition",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow everything for the hackathon (ngrok URLs rotate, credentials are
# carried via Authorization header not cookies so allow_credentials=False is fine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*", "ngrok-skip-browser-warning"],
)

# Register routers
app.include_router(user.router)
app.include_router(weather.router)
app.include_router(chat.router)
app.include_router(admin.router)
app.include_router(alerts.router)
app.include_router(websocket.router)


@app.on_event("startup")
async def on_startup():
    logger.info("=" * 60)
    logger.info("  WeatherSelf API — starting up")
    logger.info("=" * 60)
    await startup_auth()
    logger.info("✅ WeatherSelf API ready")


@app.get("/health", tags=["meta"])
async def health():
    return {"status": "healthy", "service": "WeatherSelf"}


@app.get("/", tags=["meta"])
async def root():
    return {"service": "WeatherSelf API", "version": "1.0.0", "docs": "/docs"}
