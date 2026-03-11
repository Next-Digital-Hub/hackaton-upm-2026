from fastapi import APIRouter, Depends
from src.application.weather_use_cases import WeatherUseCases
from src.api.dependencies import get_weather_use_cases, get_current_user

router = APIRouter()

@router.get("/weather")
async def get_weather(
    disaster: bool = False,
    weather_use_cases: WeatherUseCases = Depends(get_weather_use_cases),
    current_user: str = Depends(get_current_user)
):
    return weather_use_cases.get_random_weather(disaster=disaster)
