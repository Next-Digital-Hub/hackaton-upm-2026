package com.kernelpanic.campusostenible.core.providers.recomendation;

import java.util.Optional;

import com.kernelpanic.campusostenible.core.domain.Alert;
import com.kernelpanic.campusostenible.core.domain.Citizen;
import com.kernelpanic.campusostenible.core.domain.WeatherData;

public interface RecomendationProvider {
    String getRecommendation(Citizen citizen, WeatherData meteoData);

    String getSimplifiedRecommendation(Citizen citizen, Alert alert);

    Optional<String> recomendAlert(WeatherData meteoData);
}
