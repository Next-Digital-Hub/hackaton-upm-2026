package com.kernelpanic.campusostenible.core.services.weather.dal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kernelpanic.campusostenible.core.domain.WeatherData;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherRepository extends JpaRepository<WeatherData, Long> {
    Optional<WeatherData> findByProvinceIdAndDate(Long provinceId, LocalDate date);

    List<WeatherData> findByDate(LocalDate date);

    List<WeatherData> findByProvinceId(Long provinceId);
}