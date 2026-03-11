from fastapi import FastAPI
from src.infrastructure.database import engine, Base
from src.api.routes import router

app = FastAPI(title="FastAPI Hexagonal Architecture")

app.include_router(router)

# Crear tablas en la base de datos
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
