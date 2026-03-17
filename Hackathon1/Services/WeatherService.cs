using Hackathon1.Data;
using Hackathon1.Hubs;
using Hackathon1.Models;
using Microsoft.AspNetCore.SignalR;
using System.Net.Http.Headers;

namespace Hackathon1.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationsHub> _hub;

        public WeatherService(ApplicationDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration, IHubContext<NotificationsHub> hub)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _hub = hub;
        }

        public async Task<WeatherDto> GetForecastAsync(string provincia)
        {
            if (string.IsNullOrWhiteSpace(provincia))
                throw new ArgumentException("La provincia no puede estar vacía.", nameof(provincia));

            var baseUrl = _configuration["ApiClima:BaseUrl"]
                ?? throw new InvalidOperationException("La configuración 'ApiClima:BaseUrl' no está definida.");
            var apiKey = _configuration["ApiClima:ApiKey"]
                ?? throw new InvalidOperationException("La configuración 'ApiClima:ApiKey' no está definida.");

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var apiUrl = $"{baseUrl}/weather?disaster=false";
            var apiData = await client.GetFromJsonAsync<WeatherRecord>(apiUrl);

            var dto = new WeatherDto
            {
                Indicativo = apiData?.Indicativo ?? string.Empty,
                Nombre = apiData?.Nombre ?? provincia,
                Provincia = apiData?.Provincia ?? provincia,
                Fecha = apiData?.Fecha ?? DateTime.UtcNow.Date,
                HoraTmax = apiData?.HoraTmax ?? string.Empty,
                HoraTmin = apiData?.HoraTmin ?? string.Empty,
                HoraHrMax = apiData?.HoraHrMax ?? string.Empty,
                HoraHrMin = apiData?.HoraHrMin ?? string.Empty,
                Tmax = apiData?.Tmax,
                Tmin = apiData?.Tmin,
                Tmed = apiData?.Tmed,
                Prec = apiData?.Prec,
                HrMax = apiData?.HrMax,
                HrMin = apiData?.HrMin,
                HrMedia = apiData?.HrMedia,
                Racha = apiData?.Racha,
                Horaracha = apiData?.Horaracha ?? string.Empty,
                Velmedia = apiData?.Velmedia,
                PresMax = apiData?.PresMax,
                PresMin = apiData?.PresMin,
                HoraPresMax = apiData?.HoraPresMax ?? string.Empty,
                HoraPresMin = apiData?.HoraPresMin ?? string.Empty,
                Altitud = apiData?.Altitud,
                Sol = apiData?.Sol,
                Dir = apiData?.Dir ?? string.Empty
            };

            var record = new WeatherRecord
            {
                Indicativo = dto.Indicativo,
                Nombre = dto.Nombre,
                Provincia = dto.Provincia,
                Fecha = dto.Fecha,
                HoraTmax = dto.HoraTmax,
                HoraTmin = dto.HoraTmin,
                HoraHrMax = dto.HoraHrMax,
                HoraHrMin = dto.HoraHrMin,
                Tmax = dto.Tmax,
                Tmin = dto.Tmin,
                Tmed = dto.Tmed,
                Prec = dto.Prec,
                HrMax = dto.HrMax,
                HrMin = dto.HrMin,
                HrMedia = dto.HrMedia,
                Racha = dto.Racha,
                Horaracha = dto.Horaracha,
                Velmedia = dto.Velmedia,
                PresMax = dto.PresMax,
                PresMin = dto.PresMin,
                HoraPresMax = dto.HoraPresMax,
                HoraPresMin = dto.HoraPresMin,
                Altitud = dto.Altitud,
                Sol = dto.Sol,
                Dir = dto.Dir
            };

            _context.WeatherRecords.Add(record);
            await _context.SaveChangesAsync();

            var groupName = string.IsNullOrWhiteSpace(provincia) ? NotificationsHub.DefaultGroup : provincia;
            await _hub.Clients.Group(groupName).SendAsync("WeatherUpdated", dto);

            return dto;
        }
    }
}
