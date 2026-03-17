using Hackathon1.Models;

namespace Hackathon1.Services
{
    public class AlertRecommendationService : IAlertRecommendationService
    {
        // Rule-based thresholds
        private const double TmaxAlert = 38.0;
        private const double TminAlert = -5.0;
        private const double PrecAlert = 30.0;
        private const double RachaAlert = 80.0;

        public Task<AlertRecommendationResult> GetRecommendationAsync(WeatherDto forecast)
        {
            var reasons = new List<string>();

            if (TryParseDouble(forecast.Tmax, out var tmax) && tmax >= TmaxAlert)
                reasons.Add($"Temperatura máxima muy elevada ({tmax}°C ≥ {TmaxAlert}°C)");

            if (TryParseDouble(forecast.Tmin, out var tmin) && tmin <= TminAlert)
                reasons.Add($"Temperatura mínima muy baja ({tmin}°C ≤ {TminAlert}°C)");

            if (TryParseDouble(forecast.Prec, out var prec) && prec >= PrecAlert)
                reasons.Add($"Precipitación elevada ({prec} mm ≥ {PrecAlert} mm)");

            if (!string.IsNullOrWhiteSpace(forecast.Racha) &&
                TryParseDouble(forecast.Racha, out var racha) && racha >= RachaAlert)
                reasons.Add($"Racha de viento máxima elevada ({racha} km/h ≥ {RachaAlert} km/h)");

            var shouldEmit = reasons.Count > 0;
            var reason = shouldEmit
                ? string.Join("; ", reasons)
                : "Los datos meteorológicos actuales están dentro de rangos normales. No se recomienda emitir alerta.";

            return Task.FromResult(new AlertRecommendationResult
            {
                ShouldEmit = shouldEmit,
                Reason = reason
            });
        }

        private static bool TryParseDouble(string? value, out double result) =>
            double.TryParse(value,
                System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture,
                out result);
    }
}
