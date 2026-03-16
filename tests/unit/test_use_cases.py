import pytest
from unittest.mock import MagicMock, patch
from src.application.user_use_cases import UserUseCases
from src.application.prompt_use_cases import PromptUseCases
from src.domain.user import User
from src.domain.repositories import UserRepository

@pytest.fixture
def mock_repo():
    return MagicMock(spec=UserRepository)

@pytest.fixture
def user_use_cases(mock_repo):
    return UserUseCases(mock_repo)

def test_list_users(user_use_cases, mock_repo):
    expected_users = [
        User(id=1, nick_name="nick1", team_name="team1", hashed_password="hpw1"),
        User(id=2, nick_name="nick2", team_name="team2", hashed_password="hpw2")
    ]
    mock_repo.get_all.return_value = expected_users

    users = user_use_cases.list_users()

    assert len(users) == 2
    assert users == expected_users
    mock_repo.get_all.assert_called_once()

def test_create_user(user_use_cases, mock_repo):
    name = "Test User"
    nick = "test_nick"
    team = "test_team"
    password = "test_password"
    
    # Configuramos el mock para que devuelva None al buscar por nick o equipo
    mock_repo.get_by_nick_name.return_value = None
    mock_repo.get_by_team_name.return_value = None
    
    # Preparamos el mock para devolver un usuario con ID cuando se llame a save
    mock_repo.save.side_effect = lambda u: User(
        id=1,
        nick_name=u.nick_name,
        team_name=u.team_name,
        hashed_password=u.hashed_password
    )

    user = user_use_cases.create_user(nick, team, password)

    assert user.id == 1
    assert user.nick_name == nick
    assert user.team_name == team
    # La contraseña debe estar hasheada
    assert user.hashed_password != password
    
def test_create_user_with_invalid_nickname(user_use_cases, mock_repo):
    # Configuramos el mock para que devuelva None al buscar por nick o equipo
    mock_repo.get_by_nick_name.return_value = None
    mock_repo.get_by_team_name.return_value = None
    
    invalid_nicks = ["nick with space", "nick!", "nick@test", "nick#", "   ", ""]
    for nick in invalid_nicks:
        with pytest.raises(ValueError) as excinfo:
            user_use_cases.create_user(nick, "team", "password")
        assert "El nickname no puede contener espacios ni caracteres extraños" in str(excinfo.value)

def test_prompt_use_cases_invoke():
    use_case = PromptUseCases()
    with patch("src.application.prompt_use_cases.invoke_llm") as mock_invoke:
        mock_invoke.return_value = "LLM Response"
        result = use_case.invoke("system", "user")
        
        assert result == "LLM Response"
        mock_invoke.assert_called_once_with("system", "user")
