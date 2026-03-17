using Hackathon1.Data;
using Hackathon1.Hubs;
using Hackathon1.Models;
using Hackathon1.Models.ViewModels;
using Hackathon1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Hackathon1.Controllers
{
    [Authorize(Roles = "Backoffice")]
    public class BackofficeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationsHub> _hub;
        private readonly IAlertEmitter _alertEmitter;
        private readonly IWeatherService _weatherService;
        private readonly IAlertRecommendationService _alertRecommendationService;

        public BackofficeController(
            ApplicationDbContext context,
            IHubContext<NotificationsHub> hub,
            IAlertEmitter alertEmitter,
            IWeatherService weatherService,
            IAlertRecommendationService alertRecommendationService)
        {
            _context = context;
            _hub = hub;
            _alertEmitter = alertEmitter;
            _weatherService = weatherService;
            _alertRecommendationService = alertRecommendationService;
        }

        // GET: /Backoffice/Index
        public async Task<IActionResult> Index(int logsPage = 1)
        {
            if (logsPage < 1) logsPage = 1;
            const int logsPageSize = 20;

            var records = await _context.WeatherRecords
                .OrderByDescending(w => w.Fecha)
                .Take(50)
                .ToListAsync();

            var alerts = await _context.Alerts
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            var today = DateTime.UtcNow.Date;

            var (forecast, recommendation) = await GetForecastAndRecommendationAsync(records);

            // LLM logs section
            var logsQuery = _context.LlmQueryLogs
                .Include(l => l.User)
                .OrderByDescending(l => l.CreatedAt);

            var logsTotal = await logsQuery.CountAsync();
            var llmLogs = await logsQuery
                .Skip((logsPage - 1) * logsPageSize)
                .Take(logsPageSize)
                .ToListAsync();

            var vm = new BackofficeIndexViewModel
            {
                WeatherRecords = records,
                Alerts = alerts,
                CanEmit = true,
                ActiveAlertsCount = alerts.Count(a => a.IsActive),
                WeatherRecordsTodayCount = records.Count(w => w.Fecha.Date == today),
                LastWeatherUpdate = records.FirstOrDefault()?.Fecha,
                CurrentForecast = forecast,
                AlertRecommendation = recommendation,
                LlmLogs = llmLogs,
                LlmLogsPage = logsPage,
                LlmLogsTotalPages = (int)Math.Ceiling(logsTotal / (double)logsPageSize)
            };

            return View(vm);
        }

        // POST: /Backoffice/CreateAlert
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateAlert(CreateAlertViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                var records = await _context.WeatherRecords
                    .OrderByDescending(w => w.Fecha)
                    .Take(50)
                    .ToListAsync();

                var alerts = await _context.Alerts
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();

                var today = DateTime.UtcNow.Date;

                var (forecast, recommendation) = await GetForecastAndRecommendationAsync(records);

                var indexVm = new BackofficeIndexViewModel
                {
                    WeatherRecords = records,
                    Alerts = alerts,
                    NewAlert = vm,
                    CanEmit = true,
                    ActiveAlertsCount = alerts.Count(a => a.IsActive),
                    WeatherRecordsTodayCount = records.Count(w => w.Fecha.Date == today),
                    LastWeatherUpdate = records.FirstOrDefault()?.Fecha,
                    CurrentForecast = forecast,
                    AlertRecommendation = recommendation
                };
                return View("Index", indexVm);
            }

            var alert = new Alert
            {
                Title = vm.Title,
                Message = vm.Message,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                IsRead = false
            };

            _context.Alerts.Add(alert);
            await _context.SaveChangesAsync();

            await _alertEmitter.EmitAsync(alert);

            TempData["Success"] = "Alerta creada y emitida correctamente.";
            return RedirectToAction(nameof(Index));
        }

        // POST: /Backoffice/ToggleActive
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var alert = await _context.Alerts.FindAsync(id);
            if (alert == null) return NotFound();

            alert.IsActive = !alert.IsActive;
            await _context.SaveChangesAsync();

            await _alertEmitter.EmitAsync(alert);

            TempData["Success"] = alert.IsActive ? "Alerta activada." : "Alerta desactivada.";
            return RedirectToAction(nameof(Index));
        }

        // GET: /Backoffice/Logs
        public async Task<IActionResult> Logs(int page = 1)
        {
            if (page < 1) page = 1;
            const int pageSize = 20;
            var query = _context.LlmQueryLogs
                .Include(l => l.User)
                .OrderByDescending(l => l.CreatedAt);

            var total = await query.CountAsync();
            var logs = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewBag.Page = page;
            ViewBag.TotalPages = (int)Math.Ceiling(total / (double)pageSize);
            return View(logs);
        }

        // Fetches forecast from the API, or builds a WeatherDto from the most recent stored record.
        // Returns the forecast and the alert recommendation derived from it.
        private async Task<(WeatherDto? forecast, AlertRecommendationResult? recommendation)> GetForecastAndRecommendationAsync(
            List<WeatherRecord> records)
        {
            WeatherDto? forecast = null;
            AlertRecommendationResult? recommendation = null;
            try
            {
                var latestRecord = records.FirstOrDefault();
                var provincia = latestRecord?.Provincia ?? "Madrid";
                forecast = await _weatherService.GetForecastAsync(provincia);
                recommendation = await _alertRecommendationService.GetRecommendationAsync(forecast);
            }
            catch
            {
                // Non-critical: dashboard still works without forecast/recommendation
            }
            return (forecast, recommendation);
        }
    }
}
