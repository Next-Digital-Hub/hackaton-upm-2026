using Hackathon1.Data;
using Hackathon1.Models;
using Hackathon1.Models.ViewModels;
using Hackathon1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hackathon1.Controllers
{
    [Authorize(Roles = "Ciudadano")]
    public class CitizenController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWeatherService _weatherService;
        private readonly IRecommendationService _recommendationService;
        private readonly ApplicationDbContext _context;

        public CitizenController(
            UserManager<ApplicationUser> userManager,
            IWeatherService weatherService,
            IRecommendationService recommendationService,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _weatherService = weatherService;
            _recommendationService = recommendationService;
            _context = context;
        }

        // GET: /Citizen/Dashboard
        public async Task<IActionResult> Dashboard()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var forecast = await _weatherService.GetForecastAsync(
                string.IsNullOrWhiteSpace(user.Provincia) ? "Madrid" : user.Provincia);

            var recommendations = await _recommendationService.GetRecommendationsAsync(forecast, user.Id);

            var alerts = await _context.Alerts
                .Where(a => a.IsActive)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            var vm = new CitizenDashboardViewModel
            {
                User = user,
                Forecast = forecast,
                Recommendations = recommendations,
                Alerts = alerts
            };

            return View(vm);
        }

        // GET: /Citizen/Profile
        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var vm = new CitizenProfileViewModel
            {
                Provincia = user.Provincia,
                TipoVivienda = user.TipoVivienda,
                NecesidadesEspeciales = user.NecesidadesEspeciales
            };

            return View(vm);
        }

        // POST: /Citizen/Profile
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Profile(CitizenProfileViewModel vm)
        {
            if (!ModelState.IsValid)
                return View(vm);

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            user.Provincia = vm.Provincia;
            user.TipoVivienda = vm.TipoVivienda;
            user.NecesidadesEspeciales = vm.NecesidadesEspeciales;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                    ModelState.AddModelError(string.Empty, error.Description);
                return View(vm);
            }

            TempData["Success"] = "Perfil actualizado correctamente.";
            return RedirectToAction(nameof(Profile));
        }

        // GET: /Citizen/Logs
        public async Task<IActionResult> Logs(int page = 1)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            if (page < 1) page = 1;
            const int pageSize = 20;
            var query = _context.LlmQueryLogs
                .Where(l => l.UserId == user.Id)
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
    }
}
