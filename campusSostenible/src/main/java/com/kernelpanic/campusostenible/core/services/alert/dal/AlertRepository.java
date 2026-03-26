package com.kernelpanic.campusostenible.core.services.alert.dal;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kernelpanic.campusostenible.core.domain.Alert;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    Optional<Alert> findByProvinceAndDate(String province, LocalDate date);

}
