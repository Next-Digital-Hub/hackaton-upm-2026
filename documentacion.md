# Hackaton UPM 2026 – Gestión de Emergencias Climáticas

Aplicación web ASP.NET Core que integra previsión meteorológica externa, recomendaciones personalizadas mediante LLM, alertas en tiempo real con SignalR y roles Ciudadano/Backoffice.

---

## Requisitos previos

- .NET 8 SDK
- SQL Server (local o contenedor)
- (Opcional) Node/NPM si quieres gestionar librerías cliente; no es necesario para correr.
- Credenciales de API:
  - `ApiClima:BaseUrl`, `ApiClima:ApiKey`
  - `ApiLlm:BaseUrl`, `ApiLlm:ApiKey`

## Configuración local

1. Copia `appsettings.json` → `appsettings.Development.json` y rellena:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=Hackathon1;Trusted_Connection=True;TrustServerCertificate=True"
     },
     "ApiClima": {
       "BaseUrl": "http://.../weather",
       "ApiKey": "Bearer <token_meteo>"
     },
     "ApiLlm": {
       "BaseUrl": "http://.../llm",
       "ApiKey": "Bearer <token_llm>"
     }
   }
   ```
2. Restaurar y migrar BD:
   ```bash
   dotnet restore
   dotnet ef database update
   ```
3. Ejecutar:
   ```bash
   dotnet run
   ```
   Escucha en HTTPS (p.ej. https://localhost:5001). Roles y admin demo se siembran al arrancar.

### Credenciales demo
- Email: `admin@demo.com`
- Password: `Admin!123?`
- Rol: Backoffice.

## Flujo de uso
- **Ciudadano**: registra cuenta → completa perfil (Provincia, TipoVivienda, NecesidadesEspeciales) → ve dashboard con meteo y recomendaciones del LLM → puede ver histórico de meteo, alertas y sus propios logs LLM.
- **Backoffice**: ve dashboard con meteo, recomendación de emitir alerta, crea alertas (se emiten a todos), consulta históricos y logs LLM globales.
- **Tiempo real**: SignalR (`/hubs/notifications`) envía alertas y actualizaciones de meteo sin refrescar.

---

## Troubleshooting
- **SQL**: revisa `DefaultConnection` y `TrustServerCertificate`.
- **Tokens API**: asegura `ApiKey` válidos; sin ellos se cae al fallback.
- **SignalR**: verifica carga de `signalr.min.js` y acceso a `/hubs/notifications`.
- **Roles**: se crean al arrancar; si no, revisa permisos de BD.
