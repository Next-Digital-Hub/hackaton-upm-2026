import logging
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.api.dependencies import get_current_user, get_prompt_use_cases
from src.application.prompt_use_cases import PromptUseCases

router = APIRouter()
logger = logging.getLogger(__name__)

class PromptData(BaseModel):
    system_prompt: str
    user_prompt: str

@router.post("/prompt")
async def process_prompt(
    data: PromptData,
    current_user: str = Depends(get_current_user),
    prompt_use_cases: PromptUseCases = Depends(get_prompt_use_cases)
):
    logger.info(f"User: {current_user}")
    logger.info(f"System Prompt: {data.system_prompt}")
    logger.info(f"User Prompt: {data.user_prompt}")
    
    response_text = prompt_use_cases.invoke(data.system_prompt, data.user_prompt)
    return {"status": "ok", "response": response_text}
