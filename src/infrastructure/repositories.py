from typing import List, Optional
from sqlalchemy.orm import Session
from src.domain.models import User
from src.domain.repositories import UserRepository
from src.infrastructure.database import DBUser

class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        db_user = self.db.query(DBUser).filter(DBUser.id == user_id).first()
        if db_user:
            return User(
                id=db_user.id,
                nick_name=db_user.nick_name,
                team_name=db_user.team_name,
                hashed_password=db_user.hashed_password
            )
        return None

    def get_by_nick_name(self, nick_name: str) -> Optional[User]:
        db_user = self.db.query(DBUser).filter(DBUser.nick_name == nick_name).first()
        if db_user:
            return User(
                id=db_user.id,
                nick_name=db_user.nick_name,
                team_name=db_user.team_name,
                hashed_password=db_user.hashed_password
            )
        return None

    def get_by_team_name(self, team_name: str) -> Optional[User]:
        db_user = self.db.query(DBUser).filter(DBUser.team_name == team_name).first()
        if db_user:
            return User(
                id=db_user.id,
                nick_name=db_user.nick_name,
                team_name=db_user.team_name,
                hashed_password=db_user.hashed_password
            )
        return None

    def get_all(self) -> List[User]:
        db_users = self.db.query(DBUser).all()
        return [
            User(
                id=u.id,
                nick_name=u.nick_name,
                team_name=u.team_name,
                hashed_password=u.hashed_password
            ) for u in db_users
        ]

    def save(self, user: User) -> User:
        db_user = DBUser(
            nick_name=user.nick_name,
            team_name=user.team_name,
            hashed_password=user.hashed_password
        )
        if user.id:
             db_user.id = user.id
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return User(
            id=db_user.id,
            nick_name=db_user.nick_name,
            team_name=db_user.team_name,
            hashed_password=db_user.hashed_password
        )
