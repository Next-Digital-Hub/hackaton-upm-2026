import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.models.models import User
from app.routers.user import require_user
from app.services.prompt_engine import chat_response
from app.services.weather_proxy import get_weather

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

# Same dict as weather.py — keeps things self-contained
SIMULATED_WEATHER = {
    "rain":   {"temperature": 12, "tmin": 8,  "humidity": 95, "wind_speed": 40,
               "description": "Lluvia fuerte",     "prec": 25},
    "fog":    {"temperature": 10, "tmin": 7,  "humidity": 98, "wind_speed": 5,
               "description": "Niebla densa",      "prec": 2},
    "desert": {"temperature": 42, "tmin": 28, "humidity": 15, "wind_speed": 20,
               "description": "Despejado extremo", "prec": 0},
    "snow":   {"temperature": 1,  "tmin": -3, "humidity": 88, "wind_speed": 15,
               "description": "Nevada",            "prec": 8},
}

SIMPLE_STATES = {"tired", "energized", "sick", "athletic", "important"}


class ChatRequest(BaseModel):
    user_prompt: str
    avatar_state: str = "energized"
    weather_mode: Optional[str] = None  # "rain" | "fog" | "desert" | "snow"


class ChatResponse(BaseModel):
    response: str
    avatar_state: str


@router.post("/", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    current_user: User = Depends(require_user),
):
    """
    Conversational weather endpoint.
    • weather_mode overrides EC2 fetch with simulated data for the chosen mode.
    • Compound avatar_state keys (e.g. energized_focused_outdoors) are passed through.
    """
    # Allow compound questionnaire keys; only fall back for truly unknown simple keys
    is_compound = "_" in body.avatar_state
    if not is_compound and body.avatar_state not in SIMPLE_STATES:
        logger.warning(f"Unknown avatar_state '{body.avatar_state}', using 'energized'")
        body.avatar_state = "energized"

    # Resolve weather context
    if body.weather_mode and body.weather_mode in SIMULATED_WEATHER:
        weather_data = SIMULATED_WEATHER[body.weather_mode]
    else:
        try:
            weather_data = await get_weather(disaster=False)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Weather API unavailable: {exc}")

    try:
        reply = await chat_response(
            avatar_state=body.avatar_state,
            user_prompt=body.user_prompt,
            weather_data=weather_data,
            user_name=current_user.username,
        )
    except Exception as exc:
        logger.error(f"chat_response failed: {exc}")
        raise HTTPException(status_code=500, detail="AI response unavailable, please try again")

    return ChatResponse(response=reply, avatar_state=body.avatar_state)
