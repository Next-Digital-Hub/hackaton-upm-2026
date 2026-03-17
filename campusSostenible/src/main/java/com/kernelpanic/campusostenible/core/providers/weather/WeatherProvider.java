package com.kernelpanic.campusostenible.core.providers.weather;

import java.util.List;

import com.kernelpanic.campusostenible.core.domain.WeatherData;

public interface WeatherProvider {
    List<WeatherData> getTodayWeather();
}
