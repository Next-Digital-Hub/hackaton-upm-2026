package com.kernelpanic.campusostenible.ui.citizen;

import com.kernelpanic.campusostenible.core.domain.*;
import com.kernelpanic.campusostenible.core.services.weather.WeatherService;
import com.kernelpanic.campusostenible.ui.dto.*;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/citizen/weather")
public class CitizenWeatherController {

        private final WeatherService weatherService;

        public CitizenWeatherController(WeatherService weatherService) {
                this.weatherService = weatherService;
        }

        @GetMapping
        public String weatherDashboard(
                        @RequestParam(defaultValue = "Madrid") String province,
                        @RequestParam(required = false) String date,
                        Model model) {

                LocalDate selectedDate = (date != null && !date.isEmpty())
                                ? LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE)
                                : LocalDate.now();

                // Get weather data and convert to DTO
                WeatherData weatherData = weatherService.getMeteoDataByProvinceAndDate(province, selectedDate);
                WeatherDataDTO weatherDataDTO = WeatherMapper.toDTO(weatherData);

                // Get alerts and convert to DTOs
                List<WeatherAlert> alerts = weatherService.getActiveAlerts(province, selectedDate);
                List<WeatherAlertDTO> alertDTOs = alerts.stream()
                                .map(WeatherMapper::toDTO)
                                .collect(Collectors.toList());

                // Get daily recommendations based on weather conditions
                WeatherRecommendationDTO recommendations = weatherService.getDailyRecommendations(meteoData);

                // Get 7-day history for mini timeline
                List<WeatherData> historyRaw = weatherService.getWeatherHistory(province, selectedDate, 7);
                List<MeteoDataDTO> historyDTOs = historyRaw.stream()
                                .map(WeatherMapper::toDTO)
                                .collect(Collectors.toList());

                // Navigation dates
                String prevDate = selectedDate.minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
                String nextDate = selectedDate.plusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
                boolean isToday = selectedDate.equals(LocalDate.now());

                model.addAttribute("meteo", meteoDTO);
                model.addAttribute("alerts", alertDTOs);
                model.addAttribute("hasAlerts", !alertDTOs.isEmpty());
                model.addAttribute("recommendations", recommendations);
                model.addAttribute("history", historyDTOs);
                model.addAttribute("provinces", weatherService.getProvinces());
                model.addAttribute("selectedProvince", province);
                model.addAttribute("selectedDate", selectedDate.format(DateTimeFormatter.ISO_LOCAL_DATE));
                model.addAttribute("prevDate", prevDate);
                model.addAttribute("nextDate", nextDate);
                model.addAttribute("isToday", isToday);

                return "citizen-weather";
        }

        @GetMapping("/history")
        public String weatherHistory(
                        @RequestParam(defaultValue = "Madrid") String province,
                        @RequestParam(defaultValue = "30") int days,
                        Model model) {

                LocalDate today = LocalDate.now();

                List<WeatherData> historyRaw = weatherService.getWeatherHistory(province, today, days);
                List<MeteoDataDTO> historyDTOs = historyRaw.stream()
                                .map(WeatherMapper::toDTO)
                                .collect(Collectors.toList());

                // Collect alerts for each day
                List<List<WeatherAlertDTO>> allAlerts = historyRaw.stream()
                                .map(m -> weatherService.getActiveAlerts(province, m.getDate()).stream()
                                                .map(WeatherMapper::toDTO)
                                                .collect(Collectors.toList()))
                                .collect(Collectors.toList());

                model.addAttribute("history", historyDTOs);
                model.addAttribute("allAlerts", allAlerts);
                model.addAttribute("provinces", weatherService.getProvinces());
                model.addAttribute("selectedProvince", province);
                model.addAttribute("days", days);

                return "citizen-weather-history";
        }
}
