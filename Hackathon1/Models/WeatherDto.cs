namespace Hackathon1.Models
{
    public class WeatherDto
    {
        public string Indicativo { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Provincia { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public string HoraTmax { get; set; } = string.Empty;
        public string HoraTmin { get; set; } = string.Empty;
        public string HoraHrMax { get; set; } = string.Empty;
        public string HoraHrMin { get; set; } = string.Empty;
        public string Tmax { get; set; }
        public string Tmin { get; set; }
        public string Tmed { get; set; }
        public string Prec { get; set; }
        public int? HrMax { get; set; }
        public int? HrMin { get; set; }
        public int? HrMedia { get; set; }
        public string? Racha { get; set; }
        public string Horaracha { get; set; } = string.Empty;
        public string? Velmedia { get; set; }
        public string? PresMax { get; set; }
        public string? PresMin { get; set; }
        public string HoraPresMax { get; set; } = string.Empty;
        public string HoraPresMin { get; set; } = string.Empty;
        public int? Altitud { get; set; }
        public string? Sol { get; set; }
        public string Dir { get; set; } = string.Empty;
    }
}
