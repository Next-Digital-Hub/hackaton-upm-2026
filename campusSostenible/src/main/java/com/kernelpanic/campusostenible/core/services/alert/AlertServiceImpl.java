package com.kernelpanic.campusostenible.core.services.alert;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.kernelpanic.campusostenible.core.domain.Alert;
import com.kernelpanic.campusostenible.core.domain.Province;
import com.kernelpanic.campusostenible.core.services.alert.dal.AlertRepository;

@Service
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;

    public AlertServiceImpl(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @Override
    public Alert createAlert(Alert alert) {
        return alertRepository.save(alert);
    }

    @Override
    public Optional<Alert> getAlertByProvinceAndDate(Province province, LocalDate date) {
        return alertRepository.findByProvinciaAndFecha(province.getId(), date);
    }

}
