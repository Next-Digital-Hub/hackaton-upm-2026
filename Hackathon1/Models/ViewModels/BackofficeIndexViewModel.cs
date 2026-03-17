namespace Hackathon1.Models.ViewModels
{
    public class BackofficeIndexViewModel
    {
        public List<WeatherRecord> WeatherRecords { get; set; } = new();
        public List<Alert> Alerts { get; set; } = new();
        public CreateAlertViewModel NewAlert { get; set; } = new();
    }
}
