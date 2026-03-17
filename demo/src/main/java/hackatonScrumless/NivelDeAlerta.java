package hackatonScrumless;

public enum NivelDeAlerta {
    RIESGO_BAJO("Informativo", "Sin peligro aparente."),
    PRECAUCION("Atención", "Riesgo moderado, manténgase informado."),
    RIESGO_ALTO("Peligro", "Riesgo elevado, tome medidas de seguridad."),
    DESASTRE("Emergencia", "Situación crítica, siga protocolos de evacuación.");

    private final String etiqueta;
    private final String descripcion;

    NivelDeAlerta(String etiqueta, String descripcion) {
        this.etiqueta = etiqueta;
        this.descripcion = descripcion;
    }

    public String getEtiqueta() {
        return etiqueta;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
