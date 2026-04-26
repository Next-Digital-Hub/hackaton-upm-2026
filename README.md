# Sistema de Alerta y Resiliencia Ciudadana (SARC) - Equipo EcoCode

**Hackathon UPM 2026 | Next Digital**  
*Protegiendo a la Comunidad Valenciana con Inteligencia Artificial y Comunicacion en Tiempo Real*

SARC es una plataforma Full-Stack disenada para proteger a los ciudadanos antes, durante y despues de desastres climaticos. Combinando datos meteorologicos en tiempo real, Inteligencia Artificial generativa (LLM) y comunicacion mediante WebSockets (ActionCable), el sistema ofrece recomendaciones de autoproteccion hiper-personalizadas basadas en la vulnerabilidad de cada usuario.

**Stack**: Ruby on Rails 8 (API) + React 18 + Vite + SQLite + ActionCable + AWS Bedrock  
**Reto**: Gestion de Emergencias Climaticas - Comunidad Valenciana

---

## Tabla de Contenidos
- [Descripcion](#descripcion)
- [Caracteristicas Principales](#caracteristicas-principales)
- [Roles y Funcionalidades](#roles-y-funcionalidades)
- [Arquitectura](#arquitectura)
- [Tecnologias](#tecnologias)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalacion y Ejecucion](#instalacion-y-ejecucion)
- [Variables de Entorno](#variables-de-entorno)
- [Guia de Pruebas para el Jurado](#guia-de-pruebas-para-el-jurado)
- [API del Backend](#api-del-backend)
- [Modelo de Datos](#modelo-de-datos)
- [Enfoque Sostenible](#enfoque-sostenible)
- [Equipo EcoCode](#equipo-ecocode)
- [Licencia](#licencia)

---

## Descripcion

SARC responde a una necesidad critica: la informacion generica no salva vidas. Durante una DANA o inundacion, una persona en sotano necesita instrucciones distintas a alguien en planta alta; una persona con movilidad reducida requiere rutas de evacuacion accesibles.

Nuestro sistema integra:
1. API Meteorologica del Hackathon: Datos en tiempo real de la Comunidad Valenciana.
2. Perfil de Vulnerabilidad Ciudadana: Ubicacion, tipo de vivienda, necesidades especiales, mascotas, etc.
3. LLM con Prompt Engineering Contextual: Genera recomendaciones que combinan clima + perfil + protocolos oficiales.
4. Sistema de Alertas Push: WebSockets para notificaciones inmediatas sin polling.

Resultado: Un ciudadano recibe "Cierra ventanas, sube a planta 2a y evita el garaje" en lugar de "Protegete de la lluvia".

---

## Caracteristicas Principales

- **Inteligencia Artificial Contextual (Prompt Engineering Avanzado):** La IA no da consejos genericos. Adapta sus instrucciones de evacuacion y supervivencia considerando el tipo de vivienda (ej. sotano vs. piso alto), la ubicacion y las necesidades especiales (silla de ruedas, dependientes, ninos, mascotas).

- **Asistente Virtual Bidireccional:** Un chat en vivo donde el ciudadano puede consultar dudas criticas (ej. "Que hago con los electrodomesticos?") y recibir respuestas autoritarias y seguras basadas en el contexto meteorologico actual.

- **Alertas en Tiempo Real (WebSockets):** Mediante ActionCable, los Administradores (Backoffice) pueden emitir alertas que cambian la interfaz y notifican a los ciudadanos al instante, sin necesidad de refrescar la pagina.

- **Seguridad y Control de Acceso (RBAC):** Flujo de registro seguro que diferencia entre Ciudadanos y Administradores (mediante token secreto de validacion), preparado para integracion federada (OAuth2).

- **Trazabilidad y Registro Historico:** Todo el sistema guarda un registro inmutable de alertas oficiales, datos meteorologicos y consultas a la IA, permitiendo auditorias y seguimiento post-emergencia.

---

## Roles y Funcionalidades

### Ciudadano
- Registro con perfil de vulnerabilidad: Recoge ubicacion, vivienda, movilidad, mascotas, contactos de emergencia.
- Consulta meteorologica en tiempo real: Datos oficiales de la API del hackathon.
- Recomendaciones IA personalizadas: Prompt que inyecta perfil + clima + reglas de la CV.
- Chat con asistente virtual: Preguntas en lenguaje natural con respuestas contextualizadas.
- Alertas push en tiempo real: Notificaciones visuales + sonido al emitir alertas criticas.
- Historial personal: Consultas meteorologicas, recomendaciones y alertas recibidas.

### Administrador (Backoffice)
- Dashboard de emergencia: Vista agregada por provincia: clima, alertas activas, ciudadanos registrados.
- Gestion de alertas: Crear/editar alertas con niveles verde/amarillo/rojo, alcance provincial o global.
- Gestion de usuarios: Listado, busqueda y creacion de nuevos administradores (con token secreto).
- Auditoria y logs: Historial global de consultas meteorologicas y llamadas al LLM.
- Emision push: Alertas que se propagan instantaneamente via WebSockets.

---

## Arquitectura

```
Frontend (React + Vite, puerto 5173)
        |
        | HTTP/JSON + WebSocket (ActionCable)
        v
Backend (Ruby on Rails API, puerto 3000)
        |
        |--- JWT Auth
        |--- ActionCable
        |--- Services: WeatherService, LLMService, AlertService
        |
        v
SQLite (desarrollo) / PostgreSQL (produccion)
        |
        v
API Hackathon AWS (/weather, /prompt con Bedrock)
```

---

## Tecnologias

**Backend**
- Ruby 3.2+
- Ruby on Rails 8
- ActiveRecord
- JWT (autenticacion)
- ActionCable (WebSockets)
- Rack-CORS

**Frontend**
- React 18
- Vite
- Axios
- Tailwind CSS
- React Context + Hooks

**Base de datos**
- SQLite3 (desarrollo)
- PostgreSQL (produccion, opcional)

**Integraciones Externas**
- API UPM Hackathon (datos meteorologicos y LLM)
- Amazon Bedrock (AWS) - Motor de modelos de lenguaje

---

## Estructura del Proyecto

```
ecocode-sarc/
├── backend-hackathon/       # Ruby on Rails API
│   ├── app/
│   │   ├── channels/        # AlertChannel (ActionCable)
│   │   ├── controllers/api/ # Auth, Citizen, Admin controllers
│   │   ├── models/          # User, Alert, WeatherLog, LLMLog
│   │   └── services/        # WeatherService, LLMService, PromptBuilder
│   ├── config/
│   │   ├── routes.rb        # API endpoints
│   │   └── initializers/    # CORS, JWT config
│   ├── db/
│   │   ├── schema.rb
│   │   └── migrate/
│   └── Gemfile
│
├── frontend-hackathon/      # React SPA
│   ├── src/
│   │   ├── components/      # UI reutilizable
│   │   ├── pages/           # Login, Dashboard, Perfil, AdminPanel
│   │   ├── services/        # API client, WebSocket connection
│   │   └── context/         # AuthContext, AlertContext
│   ├── package.json
│   └── vite.config.js
│
├── README.md
├── package.json
└── package-lock.json
```

---

## Instalacion y Ejecucion

### Requisitos previos
- Ruby 3.2+ (rbenv o rvm recomendado)
- Node.js 18+ y npm
- SQLite3 (incluido en Ruby)

### Backend (Rails API)

```bash
cd backend-hackathon

# Instalar dependencias
bundle install

# Configurar base de datos
rails db:create
rails db:migrate

# Iniciar servidor (puerto 3000)
rails server -p 3000
```

Backend disponible en: http://localhost:3000

### Frontend (React + Vite)

```bash
cd frontend-hackathon

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Frontend disponible en: http://localhost:5173

**Nota**: Asegurate de que el frontend apunte a http://localhost:3000 como URL base de la API.

---

## Variables de Entorno

### Backend (backend-hackathon/.env)
```
RAILS_ENV=development
DATABASE_URL=sqlite3:db/development.sqlite3
JWT_SECRET_KEY=tu-clave-secreta-super-segura
HACKATHON_API_BASE=http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com
HACKATHON_BEARER_TOKEN=tu-token-obtenido-del-login
ADMIN_REGISTRATION_TOKEN=UPM_HACK_2026_SECRET
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (frontend-hackathon/.env)
```
VITE_API_BASE_URL=http://localhost:3000
```

**Importante**: Nunca subas archivos .env con credenciales reales al repositorio.

---

## Guia de Pruebas para el Jurado

Para comprobar la potencia de SARC, recomendamos el siguiente flujo de pruebas:

### 1. Perfil Vulnerable
Registrate como "Ciudadano", indicando que vives en un **Sotano** y usas **Silla de Ruedas**.

### 2. Prueba la IA
Ve al Asistente de IA y pregunta: *"El agua esta entrando, que hago?"*. Observa como la IA te da instrucciones especificas para no usar ascensores y como te pide que contactes al 112 inmediatamente.

### 3. Clima en Tiempo Real
Abre el sistema en dos navegadores distintos. En uno, entra como **Administrador** (usa la clave secreta `UPM_HACK_2026_SECRET` durante el registro). En el otro, mantien la vista del Ciudadano.

### 4. Emision de Alerta
Desde el panel de Administrador, lanza una alerta global. Veras como la pantalla del ciudadano se actualiza al instante (WebSockets) sin recargar la pagina.

### 5. Auditoria
Revisa el "Historial de Actividad" para ver como el sistema ha guardado toda la traza de la emergencia.

---

## API del Backend

### Autenticacion
- `POST /api/auth/register` - Registro de ciudadano/admin
- `POST /api/auth/login` - Login (devuelve JWT)
- `GET /api/auth/me` - Perfil del usuario autenticado
- `PUT /api/auth/me` - Actualizar perfil

### Ciudadano (requiere JWT)
- `GET /api/citizen/weather` - Datos meteorologicos
- `POST /api/citizen/recommendations` - Recomendaciones IA
- `GET /api/citizen/alerts` - Alertas activas (por provincia)
- `GET /api/citizen/history` - Historial personal

### Administrador (requiere JWT + rol admin)
- `GET /api/admin/dashboard` - Estadisticas por provincia
- `POST /api/admin/alerts` - Crear alerta
- `DELETE /api/admin/alerts/:id` - Desactivar alerta
- `POST /api/admin/users` - Crear administrador
- `GET /api/admin/audit` - Logs de auditoria

---

## Modelo de Datos

### Users
- email (unico), password_digest, role (citizen/admin)
- provincia, municipio, codigo_postal, cerca_cauce
- tipo_vivienda, numero_planta, num_personas
- movilidad_reducida, persona_dependiente
- detalle_mascotas, telefono_emergencia

### Alerts
- titulo, mensaje, nivel (verde/amarillo/rojo)
- provincia (vacio = todas), activa
- created_by (referencia a User), timestamps

### WeatherLogs / LLMLogs
- user_id (referencia)
- request_payload, response_payload (JSON)
- endpoint, timestamps

---

## Enfoque Sostenible

SARC contribuye a la resiliencia climática mediante:

- **Prevencion hiperpersonalizada**: Recomendaciones adaptadas a la realidad fisica de cada ciudadano reducen exposicion a riesgos.
- **Inclusion y accesibilidad**: Diseno pensado para colectivos vulnerables (movilidad reducida, personas mayores, familias con ninos).
- **Concienciacion contextual**: El ciudadano entiende como le afectan los fenomenos extremos en su situacion real.
- **Reduccion de desplazamientos innecesarios**: Instrucciones claras evitan salir a zonas de riesgo durante emergencias.
- **Codigo eficiente**: Arquitectura ligera con SQLite en desarrollo minimiza recursos computacionales.

---

## Equipo EcoCode

**Hackathon UPM 2026 - Next Digital**  
Universidad Politecnica de Madrid  
*Transformando tecnologia en salvavidas*

| Nombre | Rol |
|--------|-----|
| Junjing Wu | Frontend / React + UX |
| Adriana Zambrano Argandoña | Backend / APIs + WebSockets |

*Actualiza con los nombres reales de vuestro equipo*

---

## Licencia

Proyecto desarrollado con fines educativos para el **Hackathon UPM 2026**, organizado por **Next Digital**.  
Codigo bajo licencia MIT. La API externa y sus terminos de uso pertenecen a la organizacion del evento.

---

**SARC - Sistema de Alerta y Resiliencia Ciudadana**  
