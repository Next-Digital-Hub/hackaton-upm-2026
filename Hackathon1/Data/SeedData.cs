using Hackathon1.Models;
using Microsoft.AspNetCore.Identity;

namespace Hackathon1.Data
{
    public static class SeedData
    {
        public const string RoleCiudadano = "Ciudadano";
        public const string RoleBackoffice = "Backoffice";

        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var logger = serviceProvider.GetRequiredService<ILogger<ApplicationUser>>();

            string[] roles = { RoleCiudadano, RoleBackoffice };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Demo admin credentials – use environment variables or secrets in production
            const string adminEmail = "admin@demo.com";
            const string adminPassword = "Admin!123?";

            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "Administrador",
                    Provincia = "Madrid",
                    TipoVivienda = "Otro",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, RoleBackoffice);
                }
                else
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    logger.LogError("Failed to create admin user: {Errors}", errors);
                }
            }
        }
    }
}
