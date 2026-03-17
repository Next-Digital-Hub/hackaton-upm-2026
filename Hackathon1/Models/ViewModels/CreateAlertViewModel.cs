using System.ComponentModel.DataAnnotations;

namespace Hackathon1.Models.ViewModels
{
    public class CreateAlertViewModel
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Message { get; set; }
    }
}
