package com.kernelpanic.campusostenible.dto;

import com.kernelpanic.campusostenible.domain.*;

import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;

public class WeatherMapper {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Locale ES = Locale.of("es", "ES");

    private WeatherMapper() {}

    public static WeatherDataDTO toDTO(WeatherData data) {
        String bgClass = switch (data.getWeatherCondition()) {
            case SUNNY -> "bg-sunny";
            case PARTLY_CLOUDY -> "bg-partly-cloudy";
            case CLOUDY -> "bg-cloudy";
            case RAINY -> "bg-rainy";
            case STORMY -> "bg-stormy";
            case SNOWY -> "bg-snowy";
            case FOGGY -> "bg-foggy";
        };

        return MeteoDataDTO.builder()
                .date(data.getDate())
                .formattedDate(data.getDate().format(DATE_FMT))
                .dayOfWeek(data.getDate().getDayOfWeek().getDisplayName(TextStyle.FULL, ES))
                .province(data.getProvince())
                .temperatureMax(data.getTemperatureMax())
                .temperatureMin(data.getTemperatureMin())
                .humidity(data.getHumidity())
                .windSpeed(data.getWindSpeed())
                .windDirection(data.getWindDirection())
                .conditionName(data.getWeatherCondition().getDisplayName())
                .conditionEmoji(data.getWeatherCondition().getEmoji())
                .conditionIconClass(data.getWeatherCondition().getIconClass())
                .uvIndex(data.getUvIndex())
                .rainProbability(data.getRainProbability())
                .temperatureRange(String.format("%.0f° / %.0f°", data.getTemperatureMin(), data.getTemperatureMax()))
                .backgroundClass(bgClass)
                .build();
    }

    public static WeatherAlertDTO toDTO(WeatherAlert alert) {
        return WeatherAlertDTO.builder()
                .levelName(alert.getAlertLevel().getDisplayName())
                .levelColor(alert.getAlertLevel().getColor())
                .riskLabel(alert.getAlertLevel().getRiskLabel())
                .title("Alertas por clima extremos")
                .safetyRecommendation(alert.getSafetyRecommendation())
                .startDate(alert.getStartDate().format(DATE_FMT))
                .endDate(alert.getEndDate().format(DATE_FMT))
                .build();
    }
}
