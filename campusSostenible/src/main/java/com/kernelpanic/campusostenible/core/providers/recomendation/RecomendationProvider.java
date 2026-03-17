package com.kernelpanic.campusostenible.core.providers.recomendation;

import java.util.Optional;

import com.kernelpanic.campusostenible.core.domain.Alert;
import com.kernelpanic.campusostenible.core.domain.Citizen;
import com.kernelpanic.campusostenible.core.domain.SystemAlert;
import com.kernelpanic.campusostenible.core.domain.WeatherData;
import org.springframework.stereotype.Component;

@Component
public interface RecomendationProvider {
    String getRecommendation(Citizen citizen, WeatherData meteoData);

    String getSimplifiedRecommendation(Citizen citizen, Alert alert);

    Optional<SystemAlert> recomendAlert(WeatherData meteoData);
}
