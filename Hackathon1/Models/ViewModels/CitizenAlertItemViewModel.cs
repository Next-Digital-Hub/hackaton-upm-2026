namespace Hackathon1.Models.ViewModels
{
    public class CitizenAlertItemViewModel
    {
        public Alert Alert { get; set; } = null!;
        public List<string> Guidance { get; set; } = new();
    }
}
