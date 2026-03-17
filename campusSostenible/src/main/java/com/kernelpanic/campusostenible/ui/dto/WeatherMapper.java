package com.kernelpanic.campusostenible.ui.dto;

import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;

import com.kernelpanic.campusostenible.core.domain.WeatherData;
import com.kernelpanic.campusostenible.core.domain.Alert;
import com.kernelpanic.campusostenible.core.domain.WeatherCondition;

import com.kernelpanic.campusostenible.ui.dto.WeatherDataDTO;
import com.kernelpanic.campusostenible.ui.dto.WeatherAlertDTO;

public class WeatherMapper {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Locale ES = Locale.of("es", "ES");

    private WeatherMapper() {
    }

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

        return WeatherDataDTO.builder()
                .date(data.getDate())
                .formattedDate(data.getDate().format(DATE_FMT))
                .dayOfWeek(data.getDate().getDayOfWeek().getDisplayName(TextStyle.FULL, ES))
                .province(data.getProvinceId() != null ? data.getProvinceId().toString() : "")
                .temperatureMax(data.getTemperatureMax())
                .temperatureMin(data.getTemperatureMin())
                .humidity(data.getHumidity())
                .windSpeed(data.getWindSpeed())
                .windDirection(data.getWindDirection())
                .conditionName(data.getWeatherCondition().getDisplayName())
                .conditionEmoji(data.getWeatherCondition().getEmoji())
                .conditionIconClass(data.getWeatherCondition().getIconClass())
                // .uvIndex(data.getUvIndex()) // WeatherData doesn't seem to have uvIndex in Step 55
                .rainProbability(data.getRainProbability())
                .temperatureRange(String.format("%.0f° / %.0f°", data.getTemperatureMin(), data.getTemperatureMax()))
                .backgroundClass(bgClass)
                .build();
    }

    public static WeatherAlertDTO toDTO(Alert alert) {
        return WeatherAlertDTO.builder()
                .levelName(alert.getAlertLevel().getDisplayName())
                .levelColor(alert.getAlertLevel().getColor())
                .riskLabel(alert.getAlertLevel().getRiskLabel())
                .title("Alertas por clima extremos")
                .safetyRecommendation(alert.getSafetyRecommendation())
                .date(alert.getDate().format(DATE_FMT))
                .build();
    }
}