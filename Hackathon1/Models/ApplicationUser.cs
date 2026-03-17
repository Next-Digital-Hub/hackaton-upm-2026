using Microsoft.AspNetCore.Identity;

namespace Hackathon1.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
    }
}
