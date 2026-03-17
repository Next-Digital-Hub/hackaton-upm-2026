using Hackathon1.Models;

namespace Hackathon1.Services
{
    public interface IAlertEmitter
    {
        Task EmitAsync(Alert alert);
    }
}
