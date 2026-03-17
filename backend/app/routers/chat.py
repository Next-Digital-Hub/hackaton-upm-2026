import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.models.models import User
from app.routers.user import require_user
from app.services.prompt_engine import chat_response
from app.services.weather_proxy import get_weather

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

VALID_AVATAR_STATES = {"tired", "energized", "sick", "athletic", "important"}


class ChatRequest(BaseModel):
    user_prompt: str
    avatar_state: str = "energized"


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
    1. Fetches current (non-disaster) weather from the external API.
    2. Combines the user's message with their avatar system_prompt + weather context.
    3. Calls the LLM and returns the personalised reply.
    The LLM is instructed to always match the user's writing language.
    """
    if body.avatar_state not in VALID_AVATAR_STATES:
        # Fall back gracefully instead of 400 — chat should be forgiving
        logger.warning(f"Unknown avatar_state '{body.avatar_state}', using 'energized'")
        body.avatar_state = "energized"

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
