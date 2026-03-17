package com.kernelpanic.campusostenible.ui.backoffice;

import com.kernelpanic.campusostenible.core.domain.*;
import com.kernelpanic.campusostenible.core.providers.MeteoData;
import com.kernelpanic.campusostenible.core.providers.recomendation.RecomendationProvider;
import com.kernelpanic.campusostenible.core.services.alert.AlertService;
import com.kernelpanic.campusostenible.core.services.weather.WeatherService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/admin/weather")
public class AdminWeatherController {

    private final WeatherService weatherService;
    private final RecomendationProvider recomendationProvider;

    public AdminWeatherController(WeatherService weatherService, RecomendationProvider recomendationProvider) {
        this.weatherService = weatherService;
        this.recomendationProvider = recomendationProvider;
    }

    @GetMapping
    public String adminPanel(
            @RequestParam(required = false) String date,
            Model model) {

        LocalDate selectedDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        List<MeteoData> allData = weatherService.getAllMeteoData(selectedDate);

        Optional<SystemAlert> systemAlert = recomendationProvider.recomendAlert(null);

        // Advice logic moved to frontend; providing a simple message here
        String advice = allData.isEmpty() ? "No hay datos meteorológicos disponibles para esta fecha." 
                : "Revise los niveles de alerta según los parámetros detectados.";

        model.addAttribute("meteoDataList", allData);
        model.addAttribute("advice", advice);
        model.addAttribute("alertLevels", AlertLevel.values());
        model.addAttribute("provinces", Province.values());
        model.addAttribute("selectedDate", selectedDate);
        model.addAttribute("prevDate", selectedDate.minusDays(1));
        model.addAttribute("nextDate", selectedDate.plusDays(1));
        model.addAttribute("isPast", selectedDate.isBefore(LocalDate.now()));
        model.addAttribute("isToday", selectedDate.isEqual(LocalDate.now()));

        return "admin-weather";
    }

    @PostMapping("/alert")
    public String createAlert(
            @RequestParam AlertLevel level,
            @RequestParam String safety,
            @RequestParam Long provinceId,
            @RequestParam String date) {

        Province province = Province.fromId(provinceId);
        
        Alert alert = Alert.builder()
                .alertLevel(level)
                .province(province != null ? province.getName() : "Unknown")
                .safetyRecommendation(safety)
                .date(LocalDate.parse(date))
                .build();

        weatherService.saveWeatherAlert(alert);

        return "redirect:/admin/weather?success=true";
    }
}
