namespace Hackathon1.Models.ViewModels
{
    public class BackofficeIndexViewModel
    {
        public List<WeatherRecord> WeatherRecords { get; set; } = new();
        public List<Alert> Alerts { get; set; } = new();
        public CreateAlertViewModel NewAlert { get; set; } = new();
        public bool CanEmit { get; set; }
        public int ActiveAlertsCount { get; set; }
        public int WeatherRecordsTodayCount { get; set; }
        public DateTime? LastWeatherUpdate { get; set; }
    }
}
