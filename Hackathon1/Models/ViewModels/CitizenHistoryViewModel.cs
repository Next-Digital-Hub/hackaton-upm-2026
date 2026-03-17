namespace Hackathon1.Models.ViewModels
{
    public class CitizenHistoryViewModel
    {
        public List<WeatherRecord> WeatherRecords { get; set; } = new();
        public int WeatherPage { get; set; } = 1;
        public int WeatherTotalPages { get; set; } = 1;

        public List<Alert> Alerts { get; set; } = new();
        public int AlertsPage { get; set; } = 1;
        public int AlertsTotalPages { get; set; } = 1;

        public string ActiveTab { get; set; } = "weather";
    }
}
