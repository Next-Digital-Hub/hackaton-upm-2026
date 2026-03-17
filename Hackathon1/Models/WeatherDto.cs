namespace Hackathon1.Models
{
    public class WeatherDto
    {
        public double Temperatura { get; set; }
        public double Humedad { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
