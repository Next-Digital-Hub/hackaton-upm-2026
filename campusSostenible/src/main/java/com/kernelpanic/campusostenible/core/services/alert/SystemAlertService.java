package com.kernelpanic.campusostenible.core.services.alert;

import com.kernelpanic.campusostenible.core.domain.SystemAlert;

import java.time.LocalDate;
import java.util.List;

public interface SystemAlertService {
    void saveSystemAlert(SystemAlert alert);
    List<SystemAlert> getAlertsByDate(LocalDate date);
}
