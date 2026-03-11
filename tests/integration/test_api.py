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
    # Verificar que el token aparece tras el registro
    assert "Copia este token para usarlo en tus peticiones a la API:" in response.text
    assert "token=" in str(response.url)
    assert "registered=true" in str(response.url)

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
    
    response = client.post("/register", data=data2, follow_redirects=True)
    assert response.status_code == 200
    assert "El nickname ya existe" in response.text

def test_register_duplicate_team(client):
    data = {
        "nickName": "nick1",
        "teamName": "DuplicateTeam",
        "password": "pw1"
    }
    client.post("/register", data=data)
    
    # Intentar registrar el mismo equipo con distinto nick
    data2 = {
        "nickName": "nick2",
        "teamName": "DuplicateTeam",
        "password": "pw2"
    }
    
    response = client.post("/register", data=data2, follow_redirects=True)
    assert response.status_code == 200
    assert "El nombre del equipo ya existe" in response.text

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

def test_login_user(client):
    # Registrar primero
    reg_data = {
        "nickName": "logintest",
        "teamName": "LoginTeam",
        "password": "loginpass"
    }
    client.post("/register", data=reg_data)

    # Login exitoso
    login_data = {
        "nickName": "logintest",
        "password": "loginpass"
    }
    response = client.post("/login", data=login_data, follow_redirects=True)
    assert response.status_code == 200
    assert "Copia este token para usarlo en tus peticiones a la API:" in response.text
    # El token se pasa por query param y se muestra en el card
    assert "token=" in str(response.url)

def test_login_invalid_credentials(client):
    # Registrar primero
    reg_data = {
        "nickName": "badlogin",
        "teamName": "BadTeam",
        "password": "goodpass"
    }
    client.post("/register", data=reg_data)

    # Login con pass incorrecta
    login_data = {
        "nickName": "badlogin",
        "password": "wrongpass"
    }
    response = client.post("/login", data=login_data, follow_redirects=True)
    assert response.status_code == 200
    assert "Nombre de usuario o contraseña incorrectos" in response.text

def test_get_weather_no_token(client):
    response = client.get("/weather")
    assert response.status_code == 401

def test_get_weather_with_token(client):
    # Registrar y login para obtener token
    reg_data = {
        "nickName": "weathertest",
        "teamName": "WeatherTeam",
        "password": "weatherpass"
    }
    client.post("/register", data=reg_data)
    
    login_data = {
        "nickName": "weathertest",
        "password": "weatherpass"
    }
    # Por defecto follow_redirects es False en TestClient si no se especifica?
    # En FastAPI TestClient, el comportamiento depende de la versión, pero
    # normalmente post() no sigue redirecciones a menos que se indique.
    # Si response.status_code es 200, es que ha renderizado el template (ha seguido redirect o algo).
    response = client.post("/login", data=login_data, follow_redirects=False)
    assert response.status_code == 303
    token = response.headers["location"].split("token=")[1].split("&")[0]
    
    # Hacer peticion a /weather con el token
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/weather", headers=headers)
    
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert response.json()["nombre"] == "TURÍS"
