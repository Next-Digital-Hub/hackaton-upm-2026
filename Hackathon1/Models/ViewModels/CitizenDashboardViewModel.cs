namespace Hackathon1.Models.ViewModels
{
    public class CitizenDashboardViewModel
    {
        public ApplicationUser User { get; set; } = null!;
        public WeatherDto Forecast { get; set; } = null!;
        public List<string> Recommendations { get; set; } = new();
        public List<Alert> Alerts { get; set; } = new();
    }
}
