using Hackathon1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace Hackathon1.Hubs
{
    [Authorize(Roles = "Ciudadano,Backoffice")]
    public class NotificationsHub : Hub
    {
        public const string DefaultGroup = "default";

        private readonly UserManager<ApplicationUser> _userManager;

        public NotificationsHub(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public override async Task OnConnectedAsync()
        {
            if (Context.User?.IsInRole("Ciudadano") == true)
            {
                var user = await _userManager.GetUserAsync(Context.User);
                if (user != null)
                {
                    var provincia = string.IsNullOrWhiteSpace(user.Provincia) ? DefaultGroup : user.Provincia;
                    await Groups.AddToGroupAsync(Context.ConnectionId, provincia);
                }
            }
            else if (Context.User?.IsInRole("Backoffice") == true)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Backoffice");
            }

            await base.OnConnectedAsync();
        }

        public async Task SendAlert(Alert alert)
        {
            if (Context.User?.IsInRole("Backoffice") != true)
                throw new HubException("No autorizado.");

            await Clients.Group("Backoffice").SendAsync("SendAlert", alert);
        }

        public async Task SendWeather(WeatherDto weather)
        {
            if (Context.User?.IsInRole("Backoffice") != true)
                throw new HubException("No autorizado.");

            var provincia = string.IsNullOrWhiteSpace(weather.Provincia) ? DefaultGroup : weather.Provincia;
            await Clients.Group(provincia).SendAsync("WeatherUpdated", weather);
        }
    }
}
