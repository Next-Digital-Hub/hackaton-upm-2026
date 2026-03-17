package hackatonScrumless;
import jakarta.persistence.*;


public abstract class Usuario {
    private String nik;
    private String contrasena;

    // Constructor vacío (recomendado)
    public Usuario() {
    }

    // Constructor con parámetros
    public Usuario(String nik, String contrasena) {
        this.nik = nik;
        this.contrasena = contrasena;

    }

    // --- GETTERS Y SETTERS ---

    public String getNik() {
        return nik;
    }

    public void setNik(String nik) {
        this.nik = nik;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}
