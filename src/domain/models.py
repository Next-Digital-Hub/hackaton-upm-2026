from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    id: Optional[int]
    nick_name: str
    team_name: str
    hashed_password: str
