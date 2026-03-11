from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from src.application.user_use_cases import UserUseCases
from src.application.weather_use_cases import WeatherUseCases
from src.api.dependencies import get_user_use_cases, get_weather_use_cases, get_current_user

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def read_item(request: Request, error: str = None, token: str = None, user_use_cases: UserUseCases = Depends(get_user_use_cases)):
    users = user_use_cases.list_users()
    return templates.TemplateResponse(request, "index.html", {
        "message": "Registro de Usuarios del Hackaton",
        "users": users,
        "error": error,
        "token": token
    })

@router.post("/login")
async def login_user(
    nickName: str = Form(...),
    password: str = Form(...),
    user_use_cases: UserUseCases = Depends(get_user_use_cases)
):
    try:
        token = user_use_cases.login_user(nickName, password)
    except ValueError as e:
        return RedirectResponse(url=f"/?error={str(e)}", status_code=303)
    return RedirectResponse(url=f"/?token={token}", status_code=303)

@router.post("/register")
async def register_user(
    nickName: str = Form(...),
    teamName: str = Form(...),
    password: str = Form(...),
    user_use_cases: UserUseCases = Depends(get_user_use_cases)
):
    try:
        user_use_cases.create_user(nickName, teamName, password)
        token = user_use_cases.login_user(nickName, password)
    except ValueError as e:
        return RedirectResponse(url=f"/?error={str(e)}", status_code=303)
    return RedirectResponse(url=f"/?token={token}&registered=true", status_code=303)

@router.get("/weather")
async def get_weather(
    disaster: bool = False,
    weather_use_cases: WeatherUseCases = Depends(get_weather_use_cases),
    current_user: str = Depends(get_current_user)
):
    return weather_use_cases.get_random_weather(disaster=disaster)
