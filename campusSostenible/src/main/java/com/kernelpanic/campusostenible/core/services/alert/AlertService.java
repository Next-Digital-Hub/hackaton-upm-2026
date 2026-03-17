package com.kernelpanic.campusostenible.core.services.alert;

import java.time.LocalDate;
import java.util.Optional;

import com.kernelpanic.campusostenible.core.domain.Alert;
import com.kernelpanic.campusostenible.core.domain.Province;

public interface AlertService {
    public Alert createAlert(Alert alert);

    public Optional<Alert> getAlertByProvinceAndDate(Province province, LocalDate date);
}
