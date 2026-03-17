package com.kernelpanic.campusostenible.ui.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeteoDataDTO {

    private LocalDate date;
    private String formattedDate;
    private String dayOfWeek;
    private String province;

    private double temperatureMax;
    private double temperatureMin;
    private int humidity;
    private double windSpeed;
    private String windDirection;

    // Weather condition display fields
    private String conditionName;
    private String conditionEmoji;
    private String conditionIconClass;

    private int uvIndex;
    private int rainProbability;

    // Computed display helpers
    private String temperatureRange;
    private String backgroundClass;
}
