namespace Hackathon1.Services
{
    public class AlertGuidanceService : IAlertGuidanceService
    {
        public List<string> GetGuidance(string? title, string? message)
        {
            var text = $"{title} {message}".ToLowerInvariant();
            var guidance = new List<string>();

            if (ContainsAny(text, "lluvia", "torrencial", "inund", "precipit"))
            {
                guidance.Add("Evita desplazamientos innecesarios y no cruces zonas inundadas.");
                guidance.Add("Revisa desagües y mantén una linterna y batería externa cargada.");
            }

            if (ContainsAny(text, "viento", "racha", "temporal"))
            {
                guidance.Add("Asegura objetos en balcones/terrazas y aléjate de cornisas y árboles.");
            }

            if (ContainsAny(text, "calor", "temperatura", "ola de calor"))
            {
                guidance.Add("Hidrátate con frecuencia, evita el sol en horas centrales y busca lugares frescos.");
            }

            if (ContainsAny(text, "frío", "frio", "helada", "nieve"))
            {
                guidance.Add("Abrígate por capas y extrema precaución en desplazamientos por hielo o nieve.");
            }

            if (ContainsAny(text, "incendio", "humo", "forestal"))
            {
                guidance.Add("Sigue instrucciones oficiales, cierra ventanas si hay humo y prepara documentación esencial.");
            }

            if (guidance.Count == 0)
            {
                guidance.Add("Sigue los canales oficiales de Protección Civil y limita desplazamientos innecesarios.");
            }

            return guidance.Distinct().ToList();
        }

        private static bool ContainsAny(string text, params string[] terms)
        {
            foreach (var term in terms)
            {
                if (text.Contains(term))
                    return true;
            }

            return false;
        }
    }
}
