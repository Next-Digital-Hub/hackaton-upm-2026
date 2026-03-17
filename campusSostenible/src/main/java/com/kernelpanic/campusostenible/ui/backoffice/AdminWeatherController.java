package com.kernelpanic.campusostenible.ui.backoffice;

import com.kernelpanic.campusostenible.core.domain.*;
import com.kernelpanic.campusostenible.core.providers.MeteoData;
import com.kernelpanic.campusostenible.core.services.WeatherService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/admin/weather")
public class AdminWeatherController {

    private final WeatherService weatherService;

    public AdminWeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public String adminPanel(
            @RequestParam(required = false) String date,
            Model model) {

        LocalDate selectedDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        List<MeteoData> allData = weatherService.getAllMeteoData(selectedDate);

        // Find the "most interesting" data or just use the first one for the advice
        // demo
        MeteoData latestData = allData.isEmpty() ? null : allData.get(0);
        String advice = latestData != null ? weatherService.getAlertAdvice(latestData)
                : "No hay datos meteorológicos disponibles para esta fecha.";

        model.addAttribute("meteoDataList", allData);
        model.addAttribute("advice", advice);
        model.addAttribute("alertLevels", AlertLevel.values());
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
            @RequestParam String province,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        WeatherAlert alert = WeatherAlert.builder()
                .alertLevel(level)
                .province(province)
                .safetyRecommendation(safety)
                .startDate(LocalDate.parse(startDate))
                .endDate(LocalDate.parse(endDate))
                .build();

        weatherService.saveWeatherAlert(alert);

        return "redirect:/admin/weather?success=true";
    }
}
