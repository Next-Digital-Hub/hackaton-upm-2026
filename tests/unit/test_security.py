from src.infrastructure.security import hash_password, verify_password

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
