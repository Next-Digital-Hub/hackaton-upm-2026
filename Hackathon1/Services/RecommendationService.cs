using Hackathon1.Data;
using Hackathon1.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Hackathon1.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<RecommendationService> _logger;

        public RecommendationService(
            ApplicationDbContext context,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<RecommendationService> logger)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<List<string>> GetRecommendationsAsync(WeatherDto forecast, string? userId = null)
        {
            var baseUrl = _configuration["ApiClima:BaseUrl"]
                ?? throw new InvalidOperationException("La configuración 'ApiClima:BaseUrl' no está definida.");
            var apiKey = _configuration["ApiClima:ApiKey"]
                ?? throw new InvalidOperationException("La configuración 'ApiClima:ApiKey' no está definida.");

            // Fetch user profile when a userId is provided
            ApplicationUser? user = null;
            if (!string.IsNullOrEmpty(userId))
            {
                user = await _context.Users
                    .AsNoTracking()
                    .OfType<ApplicationUser>()
                    .FirstOrDefaultAsync(u => u.Id == userId);
            }

            var provincia = string.IsNullOrWhiteSpace(user?.Provincia)
                ? (string.IsNullOrWhiteSpace(forecast.Provincia) ? "no especificada" : forecast.Provincia)
                : user.Provincia;
            var tipoVivienda = string.IsNullOrWhiteSpace(user?.TipoVivienda) ? "no especificado" : user.TipoVivienda;
            var necesidades = string.IsNullOrWhiteSpace(user?.NecesidadesEspeciales) ? "no especificadas" : user.NecesidadesEspeciales;

            if (user == null || string.IsNullOrWhiteSpace(user.TipoVivienda) || string.IsNullOrWhiteSpace(user.NecesidadesEspeciales))
            {
                _logger.LogWarning(
                    "El prompt se envía sin datos de perfil completos para el usuario {UserId}. " +
                    "TipoVivienda='{TipoVivienda}', NecesidadesEspeciales='{Necesidades}'.",
                    userId ?? "(anónimo)", tipoVivienda, necesidades);
            }

            var systemPrompt = "Eres un asistente de protección civil.";

            var userPrompt =
                $"Devuelve una lista breve de recomendaciones accionables para hoy.\n" +
                $"Perfil:\n" +
                $"  - Provincia: {provincia}\n" +
                $"  - Tipo de vivienda: {tipoVivienda}\n" +
                $"  - Necesidades especiales: {necesidades}\n" +
                $"Meteo:\n" +
                $"  - Fecha: {forecast.Fecha:yyyy-MM-dd}\n" +
                $"  - Tmax: {forecast.Tmax}°C a las {forecast.HoraTmax}\n" +
                $"  - Tmin: {forecast.Tmin}°C a las {forecast.HoraTmin}\n" +
                $"  - Precipitación: {forecast.Prec} mm\n" +
                $"  - Humedad: {forecast.HrMedia}% (máx {forecast.HrMax}%, mín {forecast.HrMin}%)\n" +
                $"  - Viento medio: {forecast.Velmedia} km/h, racha máx: {forecast.Racha} km/h dir {forecast.Dir}\n" +
                $"  - Presión: max {forecast.PresMax} a las {forecast.HoraPresMax}, min {forecast.PresMin} a las {forecast.HoraPresMin}\n" +
                $"  - Horas de sol: {forecast.Sol}\n" +
                $"Instrucciones:\n" +
                $"  - Adapta consejos a movilidad reducida si se indica.\n" +
                $"  - Si es piso en planta alta, considera ascensor/escaleras, cortes eléctricos y viento fuerte.\n" +
                $"  - Si hay dependencia eléctrica, alerta sobre baterías de respaldo ante tormenta/viento.\n" +
                $"  - Usa frases cortas y prácticas (2-5 ítems). Sin saludos ni relleno.\n" +
                $"Formato de salida: JSON array de strings.";

            var requestBody = new LlmPromptRequest
            {
                SystemPrompt = systemPrompt,
                UserPrompt = userPrompt
            };

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            string rawText;
            int tokensUsed = 0;
            List<string> recommendations;

            try
            {
                var response = await client.PostAsync($"{baseUrl}/prompt", content);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();

                var llmResponse = JsonSerializer.Deserialize<LlmPromptResponse>(responseJson,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                // The API may return the generated text in a "response" or "text" field depending on the version.
                rawText = llmResponse?.Response ?? llmResponse?.Text ?? string.Empty;
                tokensUsed = llmResponse?.TokensUsed ?? 0;

                // Try to deserialize JSON array; fall back to line-splitting if not valid JSON
                recommendations = ParseRecommendations(rawText);
            }
            catch (Exception ex) when (ex is HttpRequestException || ex is JsonException || ex is InvalidOperationException)
            {
                _logger.LogError(ex, "Error al obtener recomendaciones personalizadas del servicio LLM ({BaseUrl}/prompt).", baseUrl);
                rawText = string.Empty;
                recommendations = new List<string>
                {
                    "No se pudo obtener recomendaciones personalizadas; revisa el refugio cercano.",
                    "Mantén el teléfono cargado y sigue las instrucciones de Protección Civil.",
                    "Consulta la web oficial de emergencias de tu provincia para avisos vigentes."
                };
            }

            var log = new LlmQueryLog
            {
                UserId = userId,
                Prompt = userPrompt,
                Response = rawText,
                TokensUsed = tokensUsed,
                CreatedAt = DateTime.UtcNow
            };

            _context.LlmQueryLogs.Add(log);
            await _context.SaveChangesAsync();

            return recommendations;
        }

        private static List<string> ParseRecommendations(string rawText)
        {
            if (string.IsNullOrWhiteSpace(rawText))
                return new List<string>();

            var trimmed = rawText.Trim();

            // Locate the JSON array within the response (the LLM may wrap it in prose)
            var start = trimmed.IndexOf('[');
            var end = trimmed.LastIndexOf(']');
            if (start >= 0 && end > start && end < trimmed.Length)
            {
                try
                {
                    var jsonArray = trimmed[start..(end + 1)];
                    var items = JsonSerializer.Deserialize<List<string>>(jsonArray,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (items != null && items.Count > 0)
                        return items;
                }
                catch (JsonException)
                {
                    // Fall through to line-split
                }
            }

            // Fallback: split by newlines
            return rawText
                .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Where(line => !string.IsNullOrWhiteSpace(line))
                .ToList();
        }

        private sealed class LlmPromptRequest
        {
            [JsonPropertyName("system_prompt")]
            public string SystemPrompt { get; set; } = string.Empty;

            [JsonPropertyName("user_prompt")]
            public string UserPrompt { get; set; } = string.Empty;
        }

        private sealed class LlmPromptResponse
        {
            [JsonPropertyName("response")]
            public string? Response { get; set; }

            [JsonPropertyName("text")]
            public string? Text { get; set; }

            [JsonPropertyName("tokens_used")]
            public int TokensUsed { get; set; }
        }
    }
}
