package hackatonScrumless;

public class Usuario {
    private String nik;
    private String contrasena; // Evito la 'ñ' por compatibilidad de encoding, pero puedes usar contraseña
    private TipoDeVivienda vivienda;
    private NecesidadesEspeciales necesidadesEspeciales;
    private String provincia;

    // Constructor vacío (recomendado)
    public Usuario() {
    }

    // Constructor con parámetros
    public Usuario(String nic, String contrasena, TipoDeVivienda vivienda,
                   NecesidadesEspeciales necesidadesEspeciales, String provincia) {
        this.nic = nic;
        this.contrasena = contrasena;
        this.vivienda = vivienda;
        this.necesidadesEspeciales = necesidadesEspeciales;
        this.provincia = provincia;
    }

    // --- GETTERS Y SETTERS ---

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public TipoDeVivienda getVivienda() {
        return vivienda;
    }

    public void setVivienda(TipoDeVivienda vivienda) {
        this.vivienda = vivienda;
    }

    public NecesidadesEspeciales getNecesidadesEspeciales() {
        return necesidadesEspeciales;
    }

    public void setNecesidadesEspeciales(NecesidadesEspeciales necesidadesEspeciales) {
        this.necesidadesEspeciales = necesidadesEspeciales;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }
}
