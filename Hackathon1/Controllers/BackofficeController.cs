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

        public BackofficeController(ApplicationDbContext context, IHubContext<NotificationsHub> hub, IAlertEmitter alertEmitter)
        {
            _context = context;
            _hub = hub;
            _alertEmitter = alertEmitter;
        }

        // GET: /Backoffice/Index
        public async Task<IActionResult> Index()
        {
            var records = await _context.WeatherRecords
                .OrderByDescending(w => w.Fecha)
                .Take(50)
                .ToListAsync();

            var alerts = await _context.Alerts
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            var today = DateTime.UtcNow.Date;

            var vm = new BackofficeIndexViewModel
            {
                WeatherRecords = records,
                Alerts = alerts,
                CanEmit = true,
                ActiveAlertsCount = alerts.Count(a => a.IsActive),
                WeatherRecordsTodayCount = records.Count(w => w.Fecha.Date == today),
                LastWeatherUpdate = records.FirstOrDefault()?.Fecha
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

                var indexVm = new BackofficeIndexViewModel
                {
                    WeatherRecords = records,
                    Alerts = alerts,
                    NewAlert = vm,
                    CanEmit = true,
                    ActiveAlertsCount = alerts.Count(a => a.IsActive),
                    WeatherRecordsTodayCount = records.Count(w => w.Fecha.Date == today),
                    LastWeatherUpdate = records.FirstOrDefault()?.Fecha
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
    }
}
