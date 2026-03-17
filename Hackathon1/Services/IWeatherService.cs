using Hackathon1.Models;

namespace Hackathon1.Services
{
    public interface IWeatherService
    {
        Task<WeatherDto> GetForecastAsync(string provincia);
    }
}
