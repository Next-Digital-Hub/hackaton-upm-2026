using Hackathon1.Data;
using Hackathon1.Models;
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

        public RecommendationService(ApplicationDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<List<string>> GetRecommendationsAsync(WeatherDto forecast, string? userId = null)
        {
            var baseUrl = _configuration["ApiClima:BaseUrl"]
                ?? throw new InvalidOperationException("La configuración 'ApiClima:BaseUrl' no está definida.");
            var apiKey = _configuration["ApiClima:ApiKey"]
                ?? throw new InvalidOperationException("La configuración 'ApiClima:ApiKey' no está definida.");

            var systemPrompt = "Eres un asistente experto en meteorología y gestión de emergencias. " +
                               "Dado un resumen de condiciones meteorológicas, devuelve una lista de recomendaciones " +
                               "concretas y breves para los ciudadanos, una por línea, sin numeración ni viñetas.";

            var userPrompt = $"Condiciones meteorológicas actuales en {forecast.Provincia} ({forecast.Nombre}):\n" +
                             $"- Temperatura máxima: {forecast.Tmax} °C\n" +
                             $"- Temperatura mínima: {forecast.Tmin} °C\n" +
                             $"- Temperatura media: {forecast.Tmed} °C\n" +
                             $"- Precipitación: {forecast.Prec} mm\n" +
                             $"- Humedad relativa media: {forecast.HrMedia} %\n" +
                             $"- Velocidad media del viento: {forecast.Velmedia} km/h\n" +
                             $"- Racha máxima del viento: {forecast.Racha} km/h\n" +
                             $"Genera entre 3 y 5 recomendaciones para los ciudadanos.";

            var requestBody = new LlmPromptRequest
            {
                SystemPrompt = systemPrompt,
                UserPrompt = userPrompt
            };

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response;
            try
            {
                response = await client.PostAsync($"{baseUrl}/prompt", content);
                response.EnsureSuccessStatusCode();
            }
            catch (HttpRequestException ex)
            {
                throw new InvalidOperationException(
                    $"Error al obtener recomendaciones del servicio LLM ({baseUrl}/prompt): {ex.Message}", ex);
            }

            var responseJson = await response.Content.ReadAsStringAsync();

            var llmResponse = JsonSerializer.Deserialize<LlmPromptResponse>(responseJson,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            // The API may return the generated text in a "response" or "text" field depending on the version.
            var rawText = llmResponse?.Response ?? llmResponse?.Text ?? string.Empty;

            var recommendations = rawText
                .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Where(line => !string.IsNullOrWhiteSpace(line))
                .ToList();

            var log = new LlmQueryLog
            {
                UserId = userId,
                Prompt = userPrompt,
                Response = rawText,
                TokensUsed = llmResponse?.TokensUsed ?? 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.LlmQueryLogs.Add(log);
            await _context.SaveChangesAsync();

            return recommendations;
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
