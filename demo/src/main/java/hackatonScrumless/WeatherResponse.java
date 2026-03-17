package hackatonScrumless;

import org.springframework.web.client.RestTemplate;

public class WeatherResponse {
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
        private String indicativo;
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

    public WeatherResponse(String datos , ApiController a) {
        String[] campos = a.weather(false).split(",");

        // Verificamos que el array tenga el tamaño esperado para evitar errores
        if (campos.length >= 25) {
            this.altitud = campos[0];
            this.dir = campos[1];
            this.fecha = campos[2];
            this.horaHrMax = campos[3];
            this.horaHrMin = campos[4];
            this.horaPresMax = campos[5];
            this.horaPresMin = campos[6];
            this.horaracha = campos[7];
            this.horatmax = campos[8];
            this.horatmin = campos[9];
            this.hrMax = campos[10];
            this.hrMedia = campos[11];
            this.hrMin = campos[12];
            this.indicativo = campos[13];
            this.nombre = campos[14];
            this.prec = campos[15];
            this.presMax = campos[16];
            this.presMin = campos[17];
            this.provincia = campos[18];
            this.racha = campos[19];
            this.sol = campos[20];
            this.tmax = campos[21];
            this.tmed = campos[22];
            this.tmin = campos[23];
            this.velmedia = campos[24];
        }
    }

        // getters y setters


        public String getAltitud() {
            return altitud;
        }

        public void setAltitud(String altitud) {
            this.altitud = altitud;
        }

        public String getFecha() {
            return fecha;
        }

        public void setFecha(String fecha) {
            this.fecha = fecha;
        }

        public String getDir() {
            return dir;
        }

        public void setDir(String dir) {
            this.dir = dir;
        }

        public String getHoraHrMax() {
            return horaHrMax;
        }

        public void setHoraHrMax(String horaHrMax) {
            this.horaHrMax = horaHrMax;
        }

        public String getHoraHrMin() {
            return horaHrMin;
        }

        public void setHoraHrMin(String horaHrMin) {
            this.horaHrMin = horaHrMin;
        }

        public String getHoraPresMax() {
            return horaPresMax;
        }

        public void setHoraPresMax(String horaPresMax) {
            this.horaPresMax = horaPresMax;
        }

        public String getHoraPresMin() {
            return horaPresMin;
        }

        public void setHoraPresMin(String horaPresMin) {
            this.horaPresMin = horaPresMin;
        }

        public String getHoraracha() {
            return horaracha;
        }

        public void setHoraracha(String horaracha) {
            this.horaracha = horaracha;
        }

        public String getHoratmax() {
            return horatmax;
        }

        public void setHoratmax(String horatmax) {
            this.horatmax = horatmax;
        }

        public String getHoratmin() {
            return horatmin;
        }

        public void setHoratmin(String horatmin) {
            this.horatmin = horatmin;
        }

        public String getHrMax() {
            return hrMax;
        }

        public void setHrMax(String hrMax) {
            this.hrMax = hrMax;
        }

        public String getHrMedia() {
            return hrMedia;
        }

        public void setHrMedia(String hrMedia) {
            this.hrMedia = hrMedia;
        }

        public String getHrMin() {
            return hrMin;
        }

        public void setHrMin(String hrMin) {
            this.hrMin = hrMin;
        }

        public String getIndicativo() {
            return indicativo;
        }

        public void setIndicativo(String indicativo) {
            this.indicativo = indicativo;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getPrec() {
            return prec;
        }

        public void setPrec(String prec) {
            this.prec = prec;
        }

        public String getPresMax() {
            return presMax;
        }

        public void setPresMax(String presMax) {
            this.presMax = presMax;
        }

        public String getPresMin() {
            return presMin;
        }

        public void setPresMin(String presMin) {
            this.presMin = presMin;
        }

        public String getProvincia() {
            return provincia;
        }

        public void setProvincia(String provincia) {
            this.provincia = provincia;
        }

        public String getRacha() {
            return racha;
        }

        public void setRacha(String racha) {
            this.racha = racha;
        }

        public String getSol() {
            return sol;
        }

        public void setSol(String sol) {
            this.sol = sol;
        }

        public String getTmax() {
            return tmax;
        }

        public void setTmax(String tmax) {
            this.tmax = tmax;
        }

        public String getTmed() {
            return tmed;
        }

        public void setTmed(String tmed) {
            this.tmed = tmed;
        }

        public String getTmin() {
            return tmin;
        }

        public void setTmin(String tmin) {
            this.tmin = tmin;
        }

        public String getVelmedia() {
            return velmedia;
        }

        public void setVelmedia(String velmedia) {
            this.velmedia = velmedia;
        }

    @Override
    public String toString() {
        return super.toString();
    }
}
