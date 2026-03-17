package com.kernelpanic.campusostenible.core.domain;

public enum WeatherCondition {
    SUNNY("Soleado", "☀️", "wi-day-sunny"),
    PARTLY_CLOUDY("Parcialmente nublado", "⛅", "wi-day-cloudy"),
    CLOUDY("Nublado", "☁️", "wi-cloudy"),
    RAINY("Lluvioso", "🌧️", "wi-rain"),
    STORMY("Tormenta", "⛈️", "wi-thunderstorm"),
    SNOWY("Nevado", "❄️", "wi-snow"),
    FOGGY("Niebla", "🌫️", "wi-fog");

    private final String displayName;
    private final String emoji;
    private final String iconClass;

    WeatherCondition(String displayName, String emoji, String iconClass) {
        this.displayName = displayName;
        this.emoji = emoji;
        this.iconClass = iconClass;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getEmoji() {
        return emoji;
    }

    public String getIconClass() {
        return iconClass;
    }
}
