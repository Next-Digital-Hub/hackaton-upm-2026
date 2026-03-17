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

## Despliegue

### Linux + Nginx (reverse proxy)
```bash
dotnet publish -c Release -o out
cd out
ASPNETCORE_URLS="http://0.0.0.0:5000" \
ApiClima__BaseUrl=... ApiClima__ApiKey=... \
ApiLlm__BaseUrl=...   ApiLlm__ApiKey=... \
ConnectionStrings__DefaultConnection="Server=...;Database=...;User Id=...;Password=...;TrustServerCertificate=True" \
dotnet Hackathon1.dll
```
Configura Nginx para proxyear a `http://localhost:5000` con HTTPS en el frontal.

### IIS / Windows
- `dotnet publish -c Release`
- Configura sitio apuntando a `Hackathon1.dll` (app pool 64-bit, .NET CLR “No Managed Code”).

### Docker (ejemplo)
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Hackathon1.dll"]
```
Ejecuta con:
```bash
docker run -e ConnectionStrings__DefaultConnection="Server=db;Database=Hackathon1;User Id=sa;Password=Passw0rd!;TrustServerCertificate=True" \
           -e ApiClima__BaseUrl=... -e ApiClima__ApiKey=... \
           -e ApiLlm__BaseUrl=...   -e ApiLlm__ApiKey=... \
           -p 8080:8080 hackathon1:latest
```

### Migraciones en producción
```bash
dotnet ef database update --connection "<cadena_prod>"
```

### Variables de entorno clave
- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection`
- `ApiClima__BaseUrl`, `ApiClima__ApiKey`
- `ApiLlm__BaseUrl`, `ApiLlm__ApiKey`

---

## Estructura relevante
- `Program.cs`: registra Identity, SignalR, servicios meteo/LLM/alertas.
- `Data/ApplicationDbContext.cs`: tablas `WeatherRecords`, `Alerts`, `LlmQueryLogs`.
- `Services/`: `WeatherService`, `RecommendationService`, `AlertEmitter`, `AlertRecommendationService`, `AlertGuidanceService`.
- `Views/`: dashboards Backoffice/Ciudadano, logs, históricos.
- `wwwroot/js/realtime.js`: conexión SignalR.

---

## Comandos útiles
```bash
dotnet restore
dotnet ef database update
dotnet run
dotnet publish -c Release -o out
```

---

## Troubleshooting
- **SQL**: revisa `DefaultConnection` y `TrustServerCertificate`.
- **Tokens API**: asegura `ApiKey` válidos; sin ellos se cae al fallback.
- **SignalR**: verifica carga de `signalr.min.js` y acceso a `/hubs/notifications`.
- **Roles**: se crean al arrancar; si no, revisa permisos de BD.