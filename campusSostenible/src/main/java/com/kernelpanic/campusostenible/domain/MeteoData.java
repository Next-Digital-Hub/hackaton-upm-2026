package com.kernelpanic.campusostenible.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeteoData {

    private String altitud;
    private String dir;
    private String fecha;
    private String horaHrMax;
    private String horaHrMin;
    private String horaPresMax;
    private String horaPresMin;
    private String horaracha;
    private String horatmax;
    private String horatmin;
    private String hrMax;
    private String hrMedia;
    private String hrMin;
    private String nombre;
    private String prec;
    private String presMax;
    private String presMin;
    private String provincia;
    private String racha;
    private String sol;
    private String tmax;
    private String tmed;
    private String tmin;
    private String velmedia;
}
