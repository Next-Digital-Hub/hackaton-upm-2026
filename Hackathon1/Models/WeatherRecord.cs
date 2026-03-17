namespace Hackathon1.Models
{
    public class WeatherRecord
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public double TemperatureCelsius { get; set; }
        public double Humidity { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
    }
}
