package hackatonScrumless;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
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
