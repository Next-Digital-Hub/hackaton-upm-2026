package com.kernelpanic.campusostenible.core.domain;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class SystemAlert {
    LocalDate date;
    Province province;
    String alert;

}
