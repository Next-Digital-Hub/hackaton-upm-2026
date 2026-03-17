package com.kernelpanic.campusostenible.ui.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherRecommendationDTO {
    private String htmlContent; // The full rendered markdown report
}
