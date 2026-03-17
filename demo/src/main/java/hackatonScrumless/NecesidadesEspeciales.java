package hackatonScrumless;

public enum NecesidadesEspeciales {
    SILLA_DE_RUEDAS("Requiere acceso sin barreras y rampas"),
    PERSONA_DEPENDIENTE("Requiere asistencia constante o supervisión"),
    MASCOTAS("Requiere espacios aptos para animales"),
    NINGUNA("Sin necesidades especiales registradas");

    private final String detalle;

    NecesidadesEspeciales(String detalle) {
        this.detalle = detalle;
    }

    public String getDetalle() {
        return detalle;
    }
}
