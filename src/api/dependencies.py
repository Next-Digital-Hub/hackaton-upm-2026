from fastapi import Depends
from sqlalchemy.orm import Session
from src.infrastructure.database import get_db
from src.infrastructure.repositories import SQLAlchemyUserRepository
from src.application.use_cases import UserUseCases

def get_user_use_cases(db: Session = Depends(get_db)) -> UserUseCases:
    repository = SQLAlchemyUserRepository(db)
    return UserUseCases(repository)
