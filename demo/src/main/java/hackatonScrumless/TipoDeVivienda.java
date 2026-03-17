package hackatonScrumless;

public enum TipoDeVivienda {
    SOTANO("Vivienda en nivel subterráneo"),
    PLANTA_BAJA("Vivienda a nivel de calle"),
    PISO_ALTO("Vivienda en niveles superiores"),
    CASA_DE_CAMPO("Vivienda en entorno rural");

    private final String descripcion;

    TipoDeVivienda(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
