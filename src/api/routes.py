from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from src.application.use_cases import UserUseCases
from src.api.dependencies import get_user_use_cases

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def read_item(request: Request, error: str = None, user_use_cases: UserUseCases = Depends(get_user_use_cases)):
    users = user_use_cases.list_users()
    return templates.TemplateResponse(request, "index.html", {
        "message": "Registro de Usuarios del Hackaton",
        "users": users,
        "error": error
    })

@router.post("/register")
async def register_user(
    nickName: str = Form(...),
    teamName: str = Form(...),
    password: str = Form(...),
    user_use_cases: UserUseCases = Depends(get_user_use_cases)
):
    try:
        user_use_cases.create_user(nickName, teamName, password)
    except ValueError as e:
        return RedirectResponse(url=f"/?error={str(e)}", status_code=303)
    return RedirectResponse(url="/", status_code=303)
