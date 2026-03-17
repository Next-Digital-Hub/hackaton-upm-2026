using System.ComponentModel.DataAnnotations;

namespace Hackathon1.Models
{
    public class LlmQueryLog
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }
        public string Prompt { get; set; } = string.Empty;
        public string? Response { get; set; }
        public DateTime CreatedAt { get; set; }
        [Range(0, int.MaxValue)]
        public int TokensUsed { get; set; }
    }
}
