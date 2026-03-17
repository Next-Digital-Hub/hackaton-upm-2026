# hackaton-upm-2026

Documentación y código para el hackaton de la UPM de 2026.

# Guía de Uso de la API

Se ha publicado una API para el consumo de los participantes del Hackaton que permite realizar dos acciones principales:
- Obtener datos del clima.
- Generar respuestas con un LLM.

Y de manera adicional existen unos endpoints para registrarse y generar un "bearer token" que enviar con las peticiones a las acciones anteriores.

## Autenticación

Como se ha comentado antes, para acceder a los endpoints de `/weather` y `prompt`, es necesario registrarse e iniciar sesión para obtener un **Bearer Token**. Esto se puede hacer directamente a traves del navegador en [http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com](http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com), pero tambien mediante peticiones HTTP.

Crea una cuenta para tu equipo.
- **URL**: `POST /register`
- **Body (Form Data)**: `nickName`, `teamName`, `password`

```bash
curl -X POST http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/register \
     -d "nickName=mi_usuario" \
     -d "teamName=mi_equipo" \
     -d "password=mi_password"
```

Obtén el token de acceso.
- **URL**: `POST /login`
- **Body (Form Data)**: `nickName`, `password`

```bash
curl -X POST http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/login \
     -d "nickName=mi_usuario" \
     -d "password=mi_password"
```
*Nota: El servidor redirige al root con el token en la URL, pero el token se genera y valida mediante JWT.*

## Endpoints del Proyecto

Obtener los datos del clima, que devuelve un JSON con datos meteorológicos de ejemplo.
- **URL**: `GET /weather`
- **Query Params**: `disaster=true|false` (opcional)

```bash
curl -X GET "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/weather?disaster=false" \
     -H "Authorization: Bearer <TU_TOKEN>"
```

#### Enviar Prompt al LLM

Envía instrucciones y una consulta al modelo de lenguaje (por debajo usa el servicio de AWS de Bedrock Knowledge Base).
- **URL**: `POST /prompt`
- **Body (JSON)**: `system_prompt`, `user_prompt`

```bash
curl -X POST http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt \
     -H "Authorization: Bearer <TU_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
           "system_prompt": "Eres un asistente experto en meteorología.",
           "user_prompt": "¿Qué precauciones debo tomar ante una lluvia de 800mm?"
         }'
```

---

# Web Progreso Hackaton
hrank.onrender.com

Utilizad el código de vuestro equipo para entrar.

*Desarrollado para el Hackaton UPM 2026.*

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
