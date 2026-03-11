from src.infrastructure.security import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM
import jwt
from datetime import datetime, timezone

def test_hash_password_is_not_plain():
    password = "secret_password"
    hashed = hash_password(password)
    assert hashed != password
    assert len(hashed) > 0

def test_verify_correct_password():
    password = "secret_password"
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True

def test_verify_incorrect_password():
    password = "secret_password"
    hashed = hash_password(password)
    assert verify_password("wrong_password", hashed) is False

def test_different_hashes_for_same_password():
    password = "secret_password"
    hashed1 = hash_password(password)
    hashed2 = hash_password(password)
    # Bcrypt includes a salt, so hashes should be different
    assert hashed1 != hashed2

def test_create_access_token_expiration():
    data = {"sub": "test_user"}
    token = create_access_token(data)
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    assert "exp" in decoded
    exp_timestamp = decoded['exp']
    exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
    
    now = datetime.now(timezone.utc)
    diff = exp_datetime - now
    
    # Debe ser aproximadamente 24 horas (1440 minutos)
    assert 1439 <= diff.total_seconds() / 60 <= 1441
