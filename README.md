# Hackaton UPM 2026
Documentación y código oficial para el Hackaton de la Universidad Politécnica de Madrid (UPM) 2026.

Este repositorio incluye la documentación de una API diseñada para los participantes, que permite consultar datos meteorológicos y interactuar con un Modelo de Lenguaje Grande (LLM) integrado con AWS Bedrock Knowledge Base.

## Tabla de Contenidos
- [Características Principales](#características-principales)
- [Requisitos Previos](#requisitos-previos)
- [Autenticación](#autenticación)
- [Endpoints de la API](#endpoints-de-la-api)
- [Web de Progreso](#web-de-progreso)
- [Notas Importantes](#notas-importantes)

## Características Principales
La API ofrece dos funcionalidades core para los participantes:
1. Consulta de datos meteorológicos (con opción de simular escenarios de desastre).
2. Interacción con un LLM especializado en meteorología (via AWS Bedrock).
3. Sistema de autenticación por Bearer Token (JWT) para acceder a los endpoints protegidos.

## Requisitos Previos
- Herramienta para realizar peticiones HTTP (curl, Postman, Insomnia, Python `requests`, etc.).
- Credenciales de equipo (nickName + password) registradas previamente.
- Conocimientos básicos de peticiones HTTP (POST/GET) y manejo de JSON/Form Data.

## Autenticación
Para acceder a los endpoints `/weather` y `/prompt`, debes **registrar tu equipo** y obtener un Bearer Token via JWT.

### 1. Registrar equipo
Crea una cuenta única para tu equipo con los datos solicitados.
- **Método**: `POST`
- **URL**: `http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/register`
- **Body**: Form Data con los campos:
  - `nickName`: Nombre de usuario único del equipo (ej: `equipo_01`)
  - `teamName`: Nombre completo del equipo (ej: `MeteoHackers`)
  - `password`: Contraseña segura para autenticación

#### Ejemplo con curl
```bash
curl -X POST http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/register \
     -d "nickName=equipo_01" \
     -d "teamName=MeteoHackers" \
     -d "password=hackaton2026_upm"
