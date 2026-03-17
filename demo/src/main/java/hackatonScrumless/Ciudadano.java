package hackatonScrumless;

import jakarta.persistence.*;
@Entity
@Table(name = "ciudadano")
public class Ciudadano extends Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private TipoDeVivienda vivienda;

    private NecesidadesEspeciales necesidadesEspeciales;

    private String provincia;

    public Ciudadano() {
    }

    // Constructor completo usando super para el nik y pass
    public Ciudadano(String nik, String pass, TipoDeVivienda v, NecesidadesEspeciales n, String p) {
        super(nik, pass);
        this.vivienda = v;
        this.necesidadesEspeciales = n;
        this.provincia = p;
    }

    public NecesidadesEspeciales getNecesidadesEspeciales() {
        return necesidadesEspeciales;
    }

    public void setNecesidadesEspeciales(NecesidadesEspeciales necesidadesEspeciales) {
        this.necesidadesEspeciales = necesidadesEspeciales;
    }

    public TipoDeVivienda getVivienda() {
        return vivienda;
    }

    public void setVivienda(TipoDeVivienda vivienda) {
        this.vivienda = vivienda;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    @Override
    public String toString() {
        return "Ciudadano{" +
                "id=" + id +
                ", nik='" + super.getNik() + '\'' +
                ", contrasena='" + super.getContrasena() + '\'' +
                ", vivienda=" + vivienda +
                ", necesidadesEspeciales=" + necesidadesEspeciales +
                ", provincia='" + provincia + '\'' +
                '}';
    }
}
