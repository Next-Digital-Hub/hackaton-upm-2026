package com.kernelpanic.campusostenible.repositories;

import com.kernelpanic.campusostenible.domain.MeteoData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    WeatherData findByProvinciaAndFecha(String province, LocalDate date);
    List<WeatherData> findByFecha(LocalDate date);
}