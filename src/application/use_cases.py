import re
from typing import List
from src.domain.models import User
from src.domain.repositories import UserRepository
from src.infrastructure.security import hash_password

class UserUseCases:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def list_users(self) -> List[User]:
        return self.user_repository.get_all()

    def create_user(self, nick_name: str, team_name: str, password: str) -> User:
        if not nick_name or not re.match(r"^[a-zA-Z0-9_]+$", nick_name):
            raise ValueError("El nickname no puede contener espacios ni caracteres extraños")
        
        hashed_pw = hash_password(password)
        user = User(
            id=None,
            nick_name=nick_name,
            team_name=team_name,
            hashed_password=hashed_pw
        )
        return self.user_repository.save(user)
