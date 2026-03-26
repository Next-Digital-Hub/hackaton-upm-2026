package com.kernelpanic.campusostenible.ui.citizen;

import com.kernelpanic.campusostenible.core.domain.*;
import com.kernelpanic.campusostenible.core.services.weather.WeatherService;
import com.kernelpanic.campusostenible.core.providers.recomendation.RecomendationProvider;
import com.kernelpanic.campusostenible.ui.MarkdownService;
import com.kernelpanic.campusostenible.ui.dto.*;

import java.util.Map;
import java.time.format.TextStyle;
import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/citizen/weather")
public class CitizenWeatherController {

    private final WeatherService weatherService;
    private final MarkdownService markdownService;
    private final RecomendationProvider recomendationProvider;

    private static final Locale ES = Locale.of("es", "ES");

    public CitizenWeatherController(WeatherService weatherService,
                                     MarkdownService markdownService,
                                     RecomendationProvider recomendationProvider) {
        this.weatherService = weatherService;
        this.markdownService = markdownService;
        this.recomendationProvider = recomendationProvider;
    }

    @GetMapping
    public String weatherDashboard(
            @RequestParam(defaultValue = "Madrid") String provinceName,
            @RequestParam(required = false) String date,
            Model model) {

        Province province = Province.fromName(provinceName);
        if (province == null) {
            province = Province.MADRID;
        }

        LocalDate selectedDate = (date != null && !date.isEmpty())
                ? LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE)
                : LocalDate.now();

        // Get weather data and convert to DTO
        Optional<WeatherData> weatherDataOpt = weatherService.getMeteoDataByProvinceAndDate(province, selectedDate);
        WeatherDataDTO weatherDataDTO = weatherDataOpt.map(WeatherMapper::toDTO).orElse(null);

        if (weatherDataDTO == null) {
            weatherDataDTO = createDefaultDTO(province, selectedDate);
        }

        // Recommendations
        String recommendationMarkdown = "";
        if (weatherDataOpt.isPresent()) {
            Citizen dummyCitizen = Citizen.builder()
                    .province(province.getName())
                    .villageType("Urbana")
                    .specialNeeds("Ninguna")
                    .build();
            recommendationMarkdown = recomendationProvider.getRecommendation(dummyCitizen, weatherDataOpt.get());
        } else {
            recommendationMarkdown = "_No hay datos meteorológicos disponibles para generar recomendaciones para este día._";
        }
        String recommendationHtml = markdownService.toHtml(recommendationMarkdown);

        // Get alerts and convert to DTOs
        List<Alert> alerts = weatherService.getActiveAlerts(province.getName(), selectedDate);
        List<WeatherAlertDTO> alertDTOs = alerts.stream()
                .map(WeatherMapper::toDTO)
                .collect(Collectors.toList());

        // Get history (recent days)
        List<WeatherData> historyRaw = weatherService.getWeatherByProvice(province);
        List<WeatherDataDTO> historyDTOs = historyRaw.stream()
                .map(WeatherMapper::toDTO)
                .collect(Collectors.toList());

        // Navigation dates
        String prevDate = selectedDate.minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
        String nextDate = selectedDate.plusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);

        model.addAttribute("meteo", weatherDataDTO);
        model.addAttribute("alerts", alertDTOs);
        model.addAttribute("hasAlerts", !alertDTOs.isEmpty());
        model.addAttribute("recommendations", Map.of("htmlContent", recommendationHtml));
        model.addAttribute("history", historyDTOs);
        model.addAttribute("provinces", weatherService.getProvinces().stream().map(Province::getName).collect(Collectors.toList()));
        model.addAttribute("selectedProvince", province.getName());
        model.addAttribute("selectedDate", selectedDate.format(DateTimeFormatter.ISO_LOCAL_DATE));
        model.addAttribute("prevDate", prevDate);
        model.addAttribute("nextDate", nextDate);
        model.addAttribute("isToday", selectedDate.equals(LocalDate.now()));

        return "citizen-weather";
    }

    private WeatherDataDTO createDefaultDTO(Province province, LocalDate date) {
        return WeatherDataDTO.builder()
                .date(date)
                .formattedDate(date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .dayOfWeek(date.getDayOfWeek().getDisplayName(TextStyle.FULL, ES))
                .province(province.getName())
                .temperatureMax(0)
                .temperatureMin(0)
                .humidity(0)
                .windSpeed(0)
                .windDirection("N/A")
                .conditionName("Sin datos")
                .conditionEmoji("❓")
                .conditionIconClass("wi-na")
                .uvIndex(0)
                .rainProbability(0)
                .temperatureRange("0° / 0°")
                .backgroundClass("bg-sunny")
                .build();
    }

    @GetMapping("/history")
    public String weatherHistory(
            @RequestParam(defaultValue = "Madrid") String provinceName,
            @RequestParam(defaultValue = "30") int days,
            Model model) {

        Province province = Province.fromName(provinceName);
        if (province == null) {
            province = Province.MADRID;
        }

        LocalDate today = LocalDate.now();

        List<WeatherData> historyRaw = weatherService.getWeatherHistory(province, today, days);
        List<WeatherDataDTO> historyDTOs = historyRaw.stream()
                .map(WeatherMapper::toDTO)
                .collect(Collectors.toList());

        final Province finalProvince = province;
        // Collect alerts for each day
        List<List<WeatherAlertDTO>> allAlerts = historyRaw.stream()
                .map(m -> weatherService.getActiveAlerts(finalProvince.getName(), m.getDate()).stream()
                        .map(WeatherMapper::toDTO)
                        .collect(Collectors.toList()))
                .collect(Collectors.toList());

        model.addAttribute("history", historyDTOs);
        model.addAttribute("allAlerts", allAlerts);
        model.addAttribute("provinces", weatherService.getProvinces().stream().map(Province::getName).collect(Collectors.toList()));
        model.addAttribute("selectedProvince", province.getName());
        model.addAttribute("days", days);

        return "citizen-weather-history";
    }
}
