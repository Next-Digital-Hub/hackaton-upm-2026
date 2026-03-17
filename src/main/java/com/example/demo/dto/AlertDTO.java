package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties
public record AlertDTO(
        String indicativo,
        String nombre,
        String provincia,
        String fecha,
        String tmax, // Temperatura máxima (viene como "26,0")
        String tmin, // Temperatura mínima
        String prec, // Precipitación
        String hrMedia // Humedad relativa media
) {}
