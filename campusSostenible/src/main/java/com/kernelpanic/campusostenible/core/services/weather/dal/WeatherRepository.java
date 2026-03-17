package com.kernelpanic.campusostenible.core.services.weather.dal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kernelpanic.campusostenible.core.providers.MeteoData;

import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<WeatherData, Long> {
    WeatherData findByProvinciaAndFecha(String province, LocalDate date);

    List<WeatherData> findByFecha(LocalDate date);
}