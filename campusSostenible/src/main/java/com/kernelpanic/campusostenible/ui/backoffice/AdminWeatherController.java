package com.kernelpanic.campusostenible.ui.backoffice;

import com.kernelpanic.campusostenible.core.domain.*;
import com.kernelpanic.campusostenible.core.providers.MeteoData;
import com.kernelpanic.campusostenible.core.providers.recomendation.RecomendationProvider;
import com.kernelpanic.campusostenible.core.services.alert.AlertService;
import com.kernelpanic.campusostenible.core.services.weather.WeatherService;

import lombok.RequiredArgsConstructor;

import com.kernelpanic.campusostenible.core.services.alert.SystemAlertService;
import com.kernelpanic.campusostenible.core.providers.recomendation.RecomendationProvider;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/admin/weather")
@RequiredArgsConstructor
public class AdminWeatherController {

    private final WeatherService weatherService;
    private final SystemAlertService systemAlertService;
    private final RecomendationProvider recomendationProvider;

    @GetMapping
    public String adminPanel(
            @RequestParam(required = false) String date,
            Model model) {

        LocalDate selectedDate = (date != null && !date.isEmpty()) ? LocalDate.parse(date) : LocalDate.now();
        List<MeteoData> allData = weatherService.getAllMeteoData(selectedDate);
        List<SystemAlert> systemAlerts = systemAlertService.getAlertsByDate(selectedDate);

        Optional<SystemAlert> systemAlert = recomendationProvider.recomendAlert(null);

        // Advice logic moved to frontend; providing a simple message here
        String advice = allData.isEmpty() ? "No hay datos meteorológicos disponibles para esta fecha."
                : "Revise los niveles de alerta según los parámetros detectados.";

        model.addAttribute("meteoDataList", allData);
        model.addAttribute("systemAlerts", systemAlerts);
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

    @GetMapping("/generate-recommendation")
    @ResponseBody
    public ResponseEntity<Map<String, String>> generateRecommendation(
            @RequestParam AlertLevel level,
            @RequestParam Long provinceId,
            @RequestParam String date) {

        Province province = Province.fromId(provinceId);
        if (province == null)
            return ResponseEntity.badRequest().build();

        String recommendation = recomendationProvider.generateSafetyRecommendation(level, province,
                LocalDate.parse(date));
        return ResponseEntity.ok(Map.of("recommendation", recommendation));
    }
}
