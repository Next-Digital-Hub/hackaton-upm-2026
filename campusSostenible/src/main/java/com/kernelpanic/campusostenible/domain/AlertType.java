package com.kernelpanic.campusostenible.domain;

public enum AlertType {
    HEAT("Calor extremo", "🌡️"),
    COLD("Frío extremo", "🥶"),
    WIND("Viento fuerte", "💨"),
    RAIN("Lluvias intensas", "🌊"),
    SNOW("Nevadas", "❄️"),
    STORM("Tormentas", "⚡");

    private final String displayName;
    private final String emoji;

    AlertType(String displayName, String emoji) {
        this.displayName = displayName;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getEmoji() { return emoji; }
}
