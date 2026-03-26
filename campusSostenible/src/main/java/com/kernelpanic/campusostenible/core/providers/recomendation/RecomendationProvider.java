package com.kernelpanic.campusostenible.core.providers.recomendation;

import java.util.Optional;

import com.kernelpanic.campusostenible.core.domain.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public interface RecomendationProvider {
    String getRecommendation(Citizen citizen, WeatherData meteoData);

    String getSimplifiedRecommendation(Citizen citizen, Alert alert);

    Optional<SystemAlert> recomendAlert(WeatherData meteoData);

    String generateSafetyRecommendation(AlertLevel level, Province province, LocalDate date);
}
