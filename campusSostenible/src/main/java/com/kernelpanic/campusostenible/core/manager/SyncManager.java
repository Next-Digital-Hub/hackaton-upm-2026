package com.kernelpanic.campusostenible.core.manager;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.kernelpanic.campusostenible.core.providers.weather.WeatherProvider;
import com.kernelpanic.campusostenible.core.services.weather.WeatherService;
import com.kernelpanic.campusostenible.core.services.alert.SystemAlertService;
import com.kernelpanic.campusostenible.core.providers.recomendation.RecomendationProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class SyncManager {

    private final WeatherProvider weatherProvider;
    private final WeatherService weatherService;
    private final SystemAlertService systemAlertService;
    private final RecomendationProvider recomendationProvider;

    @Scheduled(cron = "0 1 0 * * *")
    public void syncWeatherData() {
        log.info("Starting daily weather data synchronization.");
        try {
            weatherProvider.getTodayWeather().forEach(weatherData -> {
                weatherService.saveWeather(weatherData);
                
                // For each data point, check if AI recommends an alert
                recomendationProvider.recomendAlert(weatherData)
                        .ifPresent(systemAlertService::saveSystemAlert);
            });

            log.info("Daily weather data synchronization completed successfully.");
        } catch (Exception e) {
            log.error("Error during daily weather data synchronization", e);
        }
    }
}
