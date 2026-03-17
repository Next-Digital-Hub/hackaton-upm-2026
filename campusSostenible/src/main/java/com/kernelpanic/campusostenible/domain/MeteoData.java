package com.kernelpanic.campusostenible.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "meteo_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeteoData {

    @Id
    @Column(nullable = false, unique = true)
    private String indicativo;

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

    @Override
    public String toString() {
        return "MeteoData: \n" +
                "  indicativo='" + indicativo + "',\n" +
                "  nombre='" + nombre + "',\n" +
                "  provincia='" + provincia + "',\n" +
                "  fecha='" + fecha + "',\n" +
                "  tmax='" + tmax + "',\n" +
                "  tmin='" + tmin + "',\n" +
                "  tmed='" + tmed + "',\n" +
                "  prec='" + prec + "',\n" +
                "  altitud='" + altitud + "',\n" +
                "  dir='" + dir + "',\n" +
                "  horaHrMax='" + horaHrMax + "',\n" +
                "  horaHrMin='" + horaHrMin + "',\n" +
                "  horaPresMax='" + horaPresMax + "',\n" +
                "  horaPresMin='" + horaPresMin + "',\n" +
                "  horaracha='" + horaracha + "',\n" +
                "  horatmax='" + horatmax + "',\n" +
                "  horatmin='" + horatmin + "',\n" +
                "  hrMax='" + hrMax + "',\n" +
                "  hrMedia='" + hrMedia + "',\n" +
                "  hrMin='" + hrMin + "',\n" +
                "  presMax='" + presMax + "',\n" +
                "  presMin='" + presMin + "',\n" +
                "  racha='" + racha + "',\n" +
                "  sol='" + sol + "',\n" +
                "  velmedia='" + velmedia + "'\n";
    }
}
