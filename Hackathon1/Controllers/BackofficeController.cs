using Hackathon1.Data;
using Hackathon1.Models;
using Hackathon1.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hackathon1.Controllers
{
    [Authorize(Roles = "Backoffice")]
    public class BackofficeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BackofficeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Backoffice/Index
        public async Task<IActionResult> Index()
        {
            var vm = new BackofficeIndexViewModel
            {
                WeatherRecords = await _context.WeatherRecords
                    .OrderByDescending(w => w.Fecha)
                    .Take(50)
                    .ToListAsync(),
                Alerts = await _context.Alerts
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync()
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
                var indexVm = new BackofficeIndexViewModel
                {
                    WeatherRecords = await _context.WeatherRecords
                        .OrderByDescending(w => w.Fecha)
                        .Take(50)
                        .ToListAsync(),
                    Alerts = await _context.Alerts
                        .OrderByDescending(a => a.CreatedAt)
                        .ToListAsync(),
                    NewAlert = vm
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

            TempData["Success"] = "Alerta creada correctamente.";
            return RedirectToAction(nameof(Index));
        }
    }
}
