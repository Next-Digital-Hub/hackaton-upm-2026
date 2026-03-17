using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Hackathon1.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Provincia { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string TipoVivienda { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? NecesidadesEspeciales { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}
