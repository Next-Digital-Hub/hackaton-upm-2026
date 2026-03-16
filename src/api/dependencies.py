from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.infrastructure.database import get_db
from src.infrastructure.repositories import SQLAlchemyUserRepository
from src.application.user_use_cases import UserUseCases
from src.application.weather_use_cases import WeatherUseCases
from src.application.prompt_use_cases import PromptUseCases
from src.infrastructure.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_user_use_cases(db: Session = Depends(get_db)) -> UserUseCases:
    repository = SQLAlchemyUserRepository(db)
    return UserUseCases(repository)

def get_weather_use_cases() -> WeatherUseCases:
    return WeatherUseCases()

def get_prompt_use_cases() -> PromptUseCases:
    return PromptUseCases()

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload.get("sub")
