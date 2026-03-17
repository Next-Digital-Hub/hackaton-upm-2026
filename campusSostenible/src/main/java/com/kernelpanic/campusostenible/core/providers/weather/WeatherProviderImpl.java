package com.kernelpanic.campusostenible.core.providers.weather;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.kernelpanic.campusostenible.core.domain.WeatherCondition;
import com.kernelpanic.campusostenible.core.providers.MeteoData;
import com.kernelpanic.campusostenible.core.domain.WeatherData;

public class WeatherProviderImpl implements WeatherProvider{

    public List<WeatherData> getTodayWeather() {
        getWeatherAPI weatherAPI = new getWeatherAPI();
        List<MeteoData> rawDataList = weatherAPI.fetchWeather();

        return rawDataList.stream()
                .map(this::convertToDomain)
                .collect(Collectors.toList());
    }

    private WeatherData convertToDomain(MeteoData meteo) {
        return WeatherData.builder()
                .date((meteo.getFecha() != null) ? LocalDate.parse(meteo.getFecha()) : LocalDate.now())
                .provinceId(mapProvinceToId(meteo.getProvincia()))
                .temperatureMax(Double.parseDouble(meteo.getTmax()))
                .temperatureMin(Double.parseDouble(meteo.getTmin()))
                .humidity(Integer.parseInt(meteo.getHrMedia()))
                .windSpeed(Double.parseDouble(meteo.getVelmedia()))
                .windDirection(meteo.getDir())
                .rainProbability(Integer.parseInt(meteo.getPrec()))
                .weatherCondition(calculateCondition(meteo))
                .build();
    }

    private Long mapProvinceToId(String provinceName) {
        if (provinceName == null) return 0L;
        return switch (provinceName.toUpperCase()) {
            case "VALENCIA" -> 46L;
            case "MADRID" -> 28L;
            case "BARCELONA" -> 8L;
            default -> 0L;
        };
    }

    private WeatherCondition calculateCondition(MeteoData meteo) {
        double lluvia = Double.parseDouble(meteo.getPrec());
        if (lluvia > 5) return WeatherCondition.RAINY;
        if (Integer.parseInt(meteo.getVelmedia()) > 40) return WeatherCondition.STORMY;

        return WeatherCondition.SUNNY;
    }
}
