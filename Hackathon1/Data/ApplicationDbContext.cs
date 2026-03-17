using Hackathon1.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Hackathon1.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<WeatherRecord> WeatherRecords { get; set; } = null!;
        public DbSet<Alert> Alerts { get; set; } = null!;
        public DbSet<LlmQueryLog> LlmQueryLogs { get; set; } = null!;
    }
}
