package com.kernelpanic.campusostenible.core.services.alert;

import java.time.LocalDate;
import java.util.Optional;

import com.kernelpanic.campusostenible.core.domain.Alert;

public interface AlertService {
    public Alert createAlert(Alert alert);

    public Optional<Alert> getAlertByProvinceAndDate(Long provinceId, LocalDate date);
}
