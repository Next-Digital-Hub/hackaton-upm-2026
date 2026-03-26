package com.kernelpanic.campusostenible.core.services.alert.dal;

import com.kernelpanic.campusostenible.core.domain.SystemAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, Long> {
    List<SystemAlert> findByDate(LocalDate date);
}
