from fastapi import FastAPI
from src.infrastructure.database import engine, Base
from src.api.auth import router as auth_router
from src.api.weather import router as weather_router
from src.api.prompt import router as prompt_router

app = FastAPI(title="FastAPI Hexagonal Architecture")

app.include_router(auth_router)
app.include_router(weather_router)
app.include_router(prompt_router)

# Crear tablas en la base de datos
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
