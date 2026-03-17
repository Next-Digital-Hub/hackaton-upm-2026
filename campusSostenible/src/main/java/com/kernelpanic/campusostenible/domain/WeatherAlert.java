package com.kernelpanic.campusostenible.domain;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherAlert {

    private AlertLevel alertLevel;
    private AlertType alertType;
    private String title;
    private String description;
    private String safetyRecommendation;
    private LocalDate startDate;
    private LocalDate endDate;
}
