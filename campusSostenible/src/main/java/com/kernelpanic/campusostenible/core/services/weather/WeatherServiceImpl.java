package com.kernelpanic.campusostenible.core.services.weather;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.kernelpanic.campusostenible.core.domain.WeatherData;
import com.kernelpanic.campusostenible.core.domain.Alert;
import com.kernelpanic.campusostenible.core.domain.Province;
import com.kernelpanic.campusostenible.core.providers.MeteoData;
import com.kernelpanic.campusostenible.core.services.weather.dal.WeatherRepository;
import com.kernelpanic.campusostenible.core.services.alert.dal.AlertRepository;

@Service
public class WeatherServiceImpl implements WeatherService {

    private final WeatherRepository weatherRepository;
    private final AlertRepository alertRepository;

    public WeatherServiceImpl(WeatherRepository weatherRepository,
            AlertRepository alertRepository) {
        this.weatherRepository = weatherRepository;
        this.alertRepository = alertRepository;
    }

    @Override
    public Optional<WeatherData> getMeteoDataByProvinceAndDate(Province province, LocalDate date) {
        return weatherRepository.findByProvinceIdAndDate(province.getId(), date);
    }

    @Override
    public List<WeatherData> getWeatherByProvice(Province province) {
        return weatherRepository.findByProvinceId(province.getId());
    }

    @Override
    public WeatherData saveWeather(WeatherData weatherData) {
        return weatherRepository.save(weatherData);
    }

    @Override
    public List<MeteoData> getAllMeteoData(LocalDate date) {
        return weatherRepository.findByDate(date).stream()
                .map(this::toMeteoData)
                .collect(Collectors.toList());
    }

    private MeteoData toMeteoData(WeatherData data) {
        Province p = Province.fromId(data.getProvinceId());
        return MeteoData.builder()
                .provincia(p != null ? p.getName() : "")
                .fecha(data.getDate().toString())
                .tmax(String.valueOf(data.getTemperatureMax()))
                .tmin(String.valueOf(data.getTemperatureMin()))
                .hrMedia(String.valueOf(data.getHumidity()))
                .velmedia(String.valueOf(data.getWindSpeed()))
                .dir(data.getWindDirection())
                .build();
    }

    @Override
    public void saveWeatherAlert(Alert alert) {
        alertRepository.save(alert);
    }

    @Override
    public List<Province> getProvinces() {
        return Arrays.asList(Province.values());
    }

    @Override
    public List<WeatherData> getWeatherHistory(Province province, LocalDate fromDate, int days) {
        // Simple implementation: return last 'days' for the province
        // In a real app, this would be a repository call with a date range
        return weatherRepository.findByProvinceId(province.getId()).stream()
                .filter(w -> !w.getDate().isAfter(fromDate))
                .limit(days)
                .collect(Collectors.toList());
    }

    @Override
    public List<Alert> getActiveAlerts(String provinceName, LocalDate date) {
        Province province = Province.fromName(provinceName);
        if (province == null) return List.of();
        
        // Use the existing repository method
        return alertRepository.findByProvinceAndDate(province.getName(), date)
                .map(List::of)
                .orElse(List.of());
    }

}
