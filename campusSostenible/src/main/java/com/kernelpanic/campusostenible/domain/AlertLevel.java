package com.kernelpanic.campusostenible.domain;

public enum AlertLevel {
    GREEN("Verde", "#22c55e", "Sin riesgo"),
    YELLOW("Amarillo", "#eab308", "Precaución"),
    ORANGE("Naranja", "#f97316", "Riesgo importante"),
    RED("Rojo", "#ef4444", "Riesgo extremo");

    private final String displayName;
    private final String color;
    private final String riskLabel;

    AlertLevel(String displayName, String color, String riskLabel) {
        this.displayName = displayName;
        this.color = color;
        this.riskLabel = riskLabel;
    }

    public String getDisplayName() { return displayName; }
    public String getColor() { return color; }
    public String getRiskLabel() { return riskLabel; }
}
