package com.kernelpanic.campusostenible.ui.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherAlertDTO {

    private String levelName;
    private String levelColor;
    private String riskLabel;

    private String title;
    private String safetyRecommendation;

    private String startDate;
    private String endDate;
}
