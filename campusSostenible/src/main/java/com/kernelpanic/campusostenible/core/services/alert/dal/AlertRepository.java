package com.kernelpanic.campusostenible.core.services.alert.dal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kernelpanic.campusostenible.core.domain.WeatherAlert;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

}
