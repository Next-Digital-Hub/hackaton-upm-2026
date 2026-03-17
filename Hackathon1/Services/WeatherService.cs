using Hackathon1.Data;
using Hackathon1.Models;

namespace Hackathon1.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly ApplicationDbContext _context;

        public WeatherService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<WeatherDto> GetForecastAsync(string provincia)
        {
            if (string.IsNullOrWhiteSpace(provincia))
                throw new ArgumentException("La provincia no puede estar vacía.", nameof(provincia));

            var dto = new WeatherDto
            {
                Temperatura = 22,
                Humedad = 70,
                Descripcion = "lluvia moderada",
                Timestamp = DateTime.UtcNow
            };

            var record = new WeatherRecord
            {
                Timestamp = dto.Timestamp,
                TemperatureCelsius = dto.Temperatura,
                Humidity = dto.Humedad,
                Location = provincia,
                Description = dto.Descripcion
            };

            _context.WeatherRecords.Add(record);
            await _context.SaveChangesAsync();

            return dto;
        }
    }
}
