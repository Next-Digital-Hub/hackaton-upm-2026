package com.kernelpanic.campusostenible.core.services.weather;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.kernelpanic.campusostenible.core.domain.WeatherData;
import com.kernelpanic.campusostenible.core.domain.Alert;
import com.kernelpanic.campusostenible.core.domain.Province;
import com.kernelpanic.campusostenible.core.providers.MeteoData;

public interface WeatherService {
    public Optional<WeatherData> getMeteoDataByProvinceAndDate(Province province, LocalDate date);

    public List<WeatherData> getWeatherByProvice(Province province);

    WeatherData saveWeather(WeatherData weatherData);

    List<MeteoData> getAllMeteoData(LocalDate date);

    void saveWeatherAlert(Alert alert);

    List<Province> getProvinces();

    List<WeatherData> getWeatherHistory(Province province, LocalDate fromDate, int days);

    List<Alert> getActiveAlerts(String provinceName, LocalDate date);
}
