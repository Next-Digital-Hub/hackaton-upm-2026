package hackatonScrumless;

public class Backoffice extends Usuario {
    private String codigoEmpleado;
    public Backoffice(String nik, String pass, String codigo) {
        super(nik,pass);
        this.codigoEmpleado = codigo;
    }

    public String getCodigoEmpleado() {
        return codigoEmpleado;
    }

    public void setCodigoEmpleado(String codigoEmpleado) {
        this.codigoEmpleado = codigoEmpleado;
    }
}
