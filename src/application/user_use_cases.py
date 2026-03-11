import re
from typing import List
from src.domain.user import User
from src.domain.repositories import UserRepository
from src.infrastructure.security import hash_password, verify_password, create_access_token

class UserUseCases:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def list_users(self) -> List[User]:
        return self.user_repository.get_all()

    def login_user(self, nick_name: str, password: str) -> str:
        user = self.user_repository.get_by_nick_name(nick_name)
        if not user or not verify_password(password, user.hashed_password):
            raise ValueError("Nombre de usuario o contraseña incorrectos")
        
        access_token = create_access_token(data={"sub": user.nick_name})
        return access_token

    def create_user(self, nick_name: str, team_name: str, password: str) -> User:
        if not nick_name or not re.match(r"^[a-zA-Z0-9_]+$", nick_name):
            raise ValueError("El nickname no puede contener espacios ni caracteres extraños")
        
        if self.user_repository.get_by_nick_name(nick_name):
            raise ValueError("El nickname ya existe")
        
        if self.user_repository.get_by_team_name(team_name):
            raise ValueError("El nombre del equipo ya existe")
        
        hashed_pw = hash_password(password)
        user = User(
            id=None,
            nick_name=nick_name,
            team_name=team_name,
            hashed_password=hashed_pw
        )
        return self.user_repository.save(user)
