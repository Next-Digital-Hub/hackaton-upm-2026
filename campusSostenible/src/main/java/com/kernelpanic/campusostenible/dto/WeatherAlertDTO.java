package com.kernelpanic.campusostenible.dto;

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

    private String typeName;
    private String typeEmoji;

    private String title;
    private String description;
    private String safetyRecommendation;

    private String startDate;
    private String endDate;
}
