using Hackathon1.Data;
using Hackathon1.Hubs;
using Hackathon1.Models;
using Hackathon1.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddHttpClient();
builder.Services.AddSignalR();
builder.Services.AddScoped<IWeatherService, WeatherService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();
app.MapHub<NotificationsHub>("/hubs/notifications");

using (var scope = app.Services.CreateScope())
{
    await SeedData.SeedRolesAndAdminAsync(scope.ServiceProvider);
}

app.Run();
