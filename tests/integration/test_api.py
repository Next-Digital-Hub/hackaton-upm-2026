import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from main import app
from src.infrastructure.database import Base, get_db

# Configuración de base de datos para tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client():
    # Sobrescribir la dependencia de la base de datos
    app.dependency_overrides[get_db] = override_get_db
    # Crear tablas en la base de datos de test
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    # Limpiar
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Registro de Usuarios del Hackaton" in response.text

def test_register_user(client):
    data = {
        "nickName": "itest",
        "teamName": "ITeam",
        "password": "ipass"
    }
    # Enviar formulario POST
    response = client.post("/register", data=data, follow_redirects=True)
    
    assert response.status_code == 200
    # Verificar que el usuario aparece en la lista tras la redirección
    assert "itest" in response.text
    assert "ITeam" in response.text

def test_register_duplicate_nick(client):
    data = {
        "nickName": "duplicate",
        "teamName": "Team 1",
        "password": "pw1"
    }
    client.post("/register", data=data)
    
    # Intentar registrar el mismo nick
    data2 = {
        "nickName": "duplicate",
        "teamName": "Team 2",
        "password": "pw2"
    }
    
    # Actualmente no hay manejo de excepciones en el repo/api, 
    # por lo que SQLAlchemy lanza IntegrityError que FastAPI traduce a 500
    with pytest.raises(Exception):
         client.post("/register", data=data2)

def test_register_invalid_nickname(client):
    data = {
        "nickName": "nick with space",
        "teamName": "Team 1",
        "password": "pw1"
    }
    # El API redirige a /?error=...
    response = client.post("/register", data=data, follow_redirects=True)
    
    assert response.status_code == 200
    assert "El nickname no puede contener espacios ni caracteres extraños" in response.text
