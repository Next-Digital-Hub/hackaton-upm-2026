using System.ComponentModel.DataAnnotations;

namespace Hackathon1.Models
{
    public class WeatherRecord
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string Indicativo { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Provincia { get; set; } = string.Empty;

        [Required]
        public DateTime Fecha { get; set; }

        [MaxLength(10)]
        public string HoraTmax { get; set; } = string.Empty;

        [MaxLength(10)]
        public string HoraTmin { get; set; } = string.Empty;

        [MaxLength(10)]
        public string HoraHrMax { get; set; } = string.Empty;

        [MaxLength(10)]
        public string HoraHrMin { get; set; } = string.Empty;

        public string Tmax { get; set; }
        public string Tmin { get; set; }
        public string Tmed { get; set; }
        public string Prec { get; set; }

        public int? HrMax { get; set; }
        public int? HrMin { get; set; }
        public int? HrMedia { get; set; }

        public string? Racha { get; set; }

        [MaxLength(10)]
        public string Horaracha { get; set; } = string.Empty;

        public string? Velmedia { get; set; }
        public string? PresMax { get; set; }
        public string? PresMin { get; set; }

        [MaxLength(10)]
        public string HoraPresMax { get; set; } = string.Empty;

        [MaxLength(10)]
        public string HoraPresMin { get; set; } = string.Empty;

        public int? Altitud { get; set; }
        public string? Sol { get; set; }

        [MaxLength(10)]
        public string Dir { get; set; } = string.Empty;
    }
}
