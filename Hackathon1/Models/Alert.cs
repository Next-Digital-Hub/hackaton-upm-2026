namespace Hackathon1.Models
{
    public class Alert
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
