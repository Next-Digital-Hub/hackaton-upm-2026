package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public record PrevisionDTO(
        @JsonProperty("indicativo") String indicativoEstacion,
        @JsonProperty("nombre") String nombreEstacion,
        @JsonProperty("provincia") String provincia,
        @JsonProperty("altitud") String altitudMetros,
        @JsonProperty("fecha") String fecha,

        // Temperaturas
        @JsonProperty("tmax") String temperaturaMaxima,
        @JsonProperty("horatmax") String horaTemperaturaMaxima,
        @JsonProperty("tmin") String temperaturaMinima,
        @JsonProperty("horatmin") String horaTemperaturaMinima,
        @JsonProperty("tmed") String temperaturaMedia,

        // Humedad Relativa (HR)
        @JsonProperty("hrMax") String humedadRelativaMaxima,
        @JsonProperty("horaHrMax") String horaHumedadRelativaMaxima,
        @JsonProperty("hrMin") String humedadRelativaMinima,
        @JsonProperty("horaHrMin") String horaHumedadRelativaMinima,
        @JsonProperty("hrMedia") String humedadRelativaMedia,

        // Presión
        @JsonProperty("presMax") String presionMaxima,
        @JsonProperty("horaPresMax") String horaPresionMaxima,
        @JsonProperty("presMin") String presionMinima,
        @JsonProperty("horaPresMin") String horaPresionMinima,

        // Viento y otros fenómenos
        @JsonProperty("dir") String direccionViento,
        @JsonProperty("velmedia") String velocidadMediaViento,
        @JsonProperty("racha") String rachaVientoMaxima,
        @JsonProperty("horaracha") String horaRachaVientoMaxima,
        @JsonProperty("prec") String precipitacion,
        @JsonProperty("sol") String horasSol
) {

    @Override
    public String toString() {
        return """
                ### Datos Meteorológicos (%s)
                - **Estación**: %s (%s) en %s
                - **Altitud**: %s m
                
                #### Temperaturas
                - **Máxima**: %s°C (a las %s)
                - **Mínima**: %s°C (a las %s)
                - **Media**: %s°C
                
                #### Humedad y Precipitación
                - **Humedad Media**: %s%%
                - **Humedad Máx/Mín**: %s%% / %s%%
                - **Precipitación acumulada**: %s mm
                
                #### Viento y Presión
                - **Velocidad media**: %s km/h
                - **Racha máxima**: %s km/h (Dirección: %s)
                - **Presión Máx/Mín**: %s / %s hPa
                """.formatted(
                fecha,
                nombreEstacion, indicativoEstacion, provincia,
                altitudMetros,
                temperaturaMaxima, horaTemperaturaMaxima,
                temperaturaMinima, horaTemperaturaMinima,
                temperaturaMedia,
                humedadRelativaMedia,
                humedadRelativaMaxima, humedadRelativaMinima,
                precipitacion,
                velocidadMediaViento,
                rachaVientoMaxima, direccionViento,
                presionMaxima, presionMinima
        );
    }

}
