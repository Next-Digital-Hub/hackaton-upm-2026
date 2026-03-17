package com.kernelpanic.campusostenible.repositories;

import com.kernelpanic.campusostenible.domain.WeatherAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

}
