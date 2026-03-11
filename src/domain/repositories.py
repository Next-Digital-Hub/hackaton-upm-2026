from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.models import User

class UserRepository(ABC):
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]:
        pass

    @abstractmethod
    def get_by_nick_name(self, nick_name: str) -> Optional[User]:
        pass

    @abstractmethod
    def get_by_team_name(self, team_name: str) -> Optional[User]:
        pass

    @abstractmethod
    def get_all(self) -> List[User]:
        pass

    @abstractmethod
    def save(self, user: User) -> User:
        pass
