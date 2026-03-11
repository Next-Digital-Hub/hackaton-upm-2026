import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.infrastructure.database import Base
from src.infrastructure.repositories import SQLAlchemyUserRepository
from src.domain.user import User

# Usar base de datos en memoria para los tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture
def db_session():
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def repository(db_session):
    return SQLAlchemyUserRepository(db_session)

def test_save_and_get_by_id(repository):
    user = User(
        id=None,
        nick_name="test_repo",
        team_name="team_repo",
        hashed_password="hashed_repo_pw"
    )
    
    saved_user = repository.save(user)
    assert saved_user.id is not None
    assert saved_user.nick_name == "test_repo"
    
    fetched_user = repository.get_by_id(saved_user.id)
    assert fetched_user is not None
    assert fetched_user.id == saved_user.id
    assert fetched_user.nick_name == "test_repo"

def test_get_all(repository):
    user1 = User(id=None, nick_name="n1", team_name="t1", hashed_password="hp1")
    user2 = User(id=None, nick_name="n2", team_name="t2", hashed_password="hp2")
    
    repository.save(user1)
    repository.save(user2)
    
    users = repository.get_all()
    assert len(users) == 2
    nicks = [u.nick_name for u in users]
    assert "n1" in nicks
    assert "n2" in nicks

def test_get_by_id_not_found(repository):
    user = repository.get_by_id(999)
    assert user is None
