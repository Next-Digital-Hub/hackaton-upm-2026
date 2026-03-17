namespace Hackathon1.Services
{
    public interface IAlertGuidanceService
    {
        List<string> GetGuidance(string? title, string? message);
    }
}
