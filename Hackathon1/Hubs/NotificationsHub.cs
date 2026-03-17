using Hackathon1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Hackathon1.Hubs
{
    [Authorize]
    public class NotificationsHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            if (Context.User?.IsInRole("Ciudadano") == true)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Ciudadano");
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

            await Clients.Group("Ciudadano").SendAsync("SendWeather", weather);
        }
    }
}
