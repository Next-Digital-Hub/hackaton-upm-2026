package hackatonScrumless;

import java.time.LocalDateTime;
public class Alerta {

    /**
     * Clase que representa una notificación de emergencia o aviso meteorológico
     * dentro del sistema.
     */
        private String id;
        private String titulo;
        private String mensaje;
        private NivelDeAlerta nivel; // Usando el Enum que definimos
        private LocalDateTime fechaEmision;
        private String emisor; // Ej: "Sistema Automático", "Protección Civil"
        private String zonaAfectada;

        // Constructor vacío
        public Alerta() {
            this.fechaEmision = LocalDateTime.now();
        }

        // Constructor completo
        public Alerta(String titulo, String mensaje, NivelDeAlerta nivel, String emisor, String zonaAfectada) {
            this.id = java.util.UUID.randomUUID().toString(); // Genera un ID único automáticamente
            this.titulo = titulo;
            this.mensaje = mensaje;
            this.nivel = nivel;
            this.emisor = emisor;
            this.zonaAfectada = zonaAfectada;
            this.fechaEmision = LocalDateTime.now();
        }

        // --- Getters y Setters ---

        public String getId() {
            return id;
        }

        public String getTitulo() {
            return titulo;
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }

        public String getMensaje() {
            return mensaje;
        }

        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }

        public NivelDeAlerta getNivel() {
            return nivel;
        }

        public void setNivel(NivelDeAlerta nivel) {
            this.nivel = nivel;
        }

        public LocalDateTime getFechaEmision() {
            return fechaEmision;
        }

        public String getEmisor() {
            return emisor;
        }

        public void setEmisor(String emisor) {
            this.emisor = emisor;
        }

        public String getZonaAfectada() {
            return zonaAfectada;
        }

        public void setZonaAfectada(String zonaAfectada) {
            this.zonaAfectada = zonaAfectada;
        }

        /**
         * Devuelve una representación textual de la alerta para el Registro Meteorológico
         */
        @Override
        public String toString() {
            return String.format("[%s] ⚠️ ALERTA %s: %s en %s (Emitido por: %s)",
                    fechaEmision, nivel, titulo, zonaAfectada, emisor);
        }
}
