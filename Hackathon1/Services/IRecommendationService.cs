using Hackathon1.Models;

namespace Hackathon1.Services
{
    public interface IRecommendationService
    {
        Task<List<string>> GetRecommendationsAsync(WeatherDto forecast, string? userId = null);
    }
}
