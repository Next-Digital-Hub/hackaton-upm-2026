from unittest.mock import patch
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
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_prompt_endpoint_no_token(client):
    data = {
        "system_prompt": "You are a helpful assistant",
        "user_prompt": "Hello"
    }
    response = client.post("/prompt", json=data)
    assert response.status_code == 401

def test_prompt_endpoint_with_token(client, caplog):
    import logging
    caplog.set_level(logging.INFO)
    
    # Registrar y login para obtener token
    reg_data = {
        "nickName": "prompttest",
        "teamName": "PromptTeam",
        "password": "promptpass"
    }
    client.post("/register", data=reg_data)
    
    login_data = {
        "nickName": "prompttest",
        "password": "promptpass"
    }
    response = client.post("/login", data=login_data, follow_redirects=False)
    token = response.headers["location"].split("token=")[1].split("&")[0]
    
    # Hacer peticion a /prompt con el token
    headers = {"Authorization": f"Bearer {token}"}
    prompt_payload = {
        "system_prompt": "System instructions",
        "user_prompt": "User message"
    }
    
    with patch("src.application.prompt_use_cases.invoke_llm") as mock_invoke:
        mock_invoke.return_value = "Mocked LLM response"
        response = client.post("/prompt", json=prompt_payload, headers=headers)
    
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "response": "Mocked LLM response"}
    
    # Verificar que se llamó al mock
    mock_invoke.assert_called_once_with("System instructions", "User message")
    
    # Verificar logs
    assert "User: prompttest" in caplog.text
    assert "System Prompt: System instructions" in caplog.text
    assert "User Prompt: User message" in caplog.text
