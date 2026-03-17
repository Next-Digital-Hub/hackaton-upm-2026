package com.kernelpanic.campusostenible;

import com.kernelpanic.campusostenible.domain.MeteoData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final getWeatherAPI weatherApiService;

    public WeatherController(getWeatherAPI weatherApiService) {
        this.weatherApiService = weatherApiService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<MeteoData>> getAllMeteoData() {
        List<MeteoData> data = weatherApiService.fetchWeather();
        return ResponseEntity.ok(data);
    }
}
