using Hackathon1.Models;

namespace Hackathon1.Services
{
    public class AlertRecommendationResult
    {
        public bool ShouldEmit { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public interface IAlertRecommendationService
    {
        Task<AlertRecommendationResult> GetRecommendationAsync(WeatherDto forecast);
    }
}
