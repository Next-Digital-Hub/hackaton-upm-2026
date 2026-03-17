using Hackathon1.Hubs;
using Hackathon1.Models;
using Microsoft.AspNetCore.SignalR;

namespace Hackathon1.Services
{
    public class AlertEmitter : IAlertEmitter
    {
        private readonly IHubContext<NotificationsHub> _hub;

        public AlertEmitter(IHubContext<NotificationsHub> hub)
        {
            _hub = hub;
        }

        public async Task EmitAsync(Alert alert)
        {
            var payload = new
            {
                id = alert.Id,
                title = alert.Title,
                message = alert.Message,
                createdAt = alert.CreatedAt,
                isActive = alert.IsActive
            };

            await _hub.Clients.Group(NotificationsHub.DefaultGroup).SendAsync("AlertEmitted", payload);
            await _hub.Clients.Group(NotificationsHub.CiudadanoGroup).SendAsync("AlertEmitted", payload);
            await _hub.Clients.Group(NotificationsHub.BackofficeGroup).SendAsync("AlertEmitted", payload);
        }
    }
}
