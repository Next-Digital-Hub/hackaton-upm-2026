using System.ComponentModel.DataAnnotations;

namespace Hackathon1.Models.ViewModels
{
    public class CitizenProfileViewModel
    {
        [Required]
        [MaxLength(100)]
        [Display(Name = "Provincia")]
        public string Provincia { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Display(Name = "Tipo de vivienda")]
        public string TipoVivienda { get; set; } = string.Empty;

        [MaxLength(300)]
        [Display(Name = "Necesidades especiales")]
        public string? NecesidadesEspeciales { get; set; }
    }
}
