# ClimAlert Valencia — Frontend

Frontend Flask que llama al backend API y renderiza HTML.

## Arquitectura

```
Usuario → localhost:3000 (Frontend Flask) → localhost:5000 (Backend API)
                ↓                                    ↓
          Renderiza HTML                    SQLAlchemy + JWT + Weather API
```

El frontend **no tiene base de datos**. Solo guarda el JWT en la sesión de Flask.

## Estructura

```
frontend/
├── app.py                             ← Flask: todas las rutas
├── requirements.txt                   ← flask + requests
├── static/
│   ├── css/style.css                  ← Dark theme
│   └── js/app.js                      ← Polling alertas, toasts, campana
└── templates/
    ├── base.html                      ← Layout: nav, 🔔, toasts, footer
    ├── 404.html
    ├── perfil.html                    ← PUT /api/auth/me
    ├── auth/
    │   ├── login.html                 ← POST /api/auth/login
    │   └── registro.html              ← POST /api/auth/register
    ├── ciudadano/
    │   ├── dashboard.html             ← GET /api/citizen/alerts
    │   ├── clima.html                 ← GET /api/citizen/weather
    │   ├── recomendaciones.html       ← GET /api/citizen/recommendations
    │   └── historial.html             ← GET /api/citizen/history/*
    └── backoffice/
        ├── dashboard.html             ← CRUD /api/backoffice/alerts
        ├── clima.html                 ← GET /api/backoffice/weather/<prov>
        └── historial.html             ← GET /api/backoffice/logs/*
```

## Cómo probarlo

### Terminal 1 — Backend (puerto 5000)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Terminal 2 — Frontend (puerto 3000)
```bash
cd frontend
pip install flask requests
python app.py
```

Abre **http://localhost:3000** en tu navegador.

## Flujo

1. **Login/Registro** → Frontend envía POST al backend → recibe `{token, user}` → guarda JWT en session de Flask
2. **Cada página** → Frontend mete `Authorization: Bearer <token>` en peticiones al backend → recibe JSON → renderiza HTML
3. **Alertas en tiempo real** → JS hace polling cada 15s → muestra toasts + actualiza campana 🔔
4. **Si el token expira** → el backend devuelve 401 → el frontend redirige a login

## Variables de entorno (opcionales)

```bash
export BACKEND_URL=http://localhost:5000   # default
export SECRET_KEY=tu-clave-secreta         # para session de Flask
```

## Endpoints del backend que usa

| Frontend | Método | Backend API |
|----------|--------|-------------|
| Login | POST | `/api/auth/login` |
| Registro | POST | `/api/auth/register` |
| Ver perfil | GET | `/api/auth/me` |
| Editar perfil | PUT | `/api/auth/me` |
| Clima ciudadano | GET | `/api/citizen/weather` |
| Recomendaciones IA | GET | `/api/citizen/recommendations` |
| Alertas ciudadano | GET | `/api/citizen/alerts` |
| Historial weather | GET | `/api/citizen/history/weather` |
| Historial LLM | GET | `/api/citizen/history/llm` |
| Panel admin | GET | `/api/backoffice/alerts` + `/api/backoffice/users` |
| Clima admin | GET | `/api/backoffice/weather/<provincia>` |
| Crear alerta | POST | `/api/backoffice/alerts` |
| Desactivar alerta | DELETE | `/api/backoffice/alerts/<id>` |
| Logs weather | GET | `/api/backoffice/logs/weather` |
| Logs LLM | GET | `/api/backoffice/logs/llm` |
