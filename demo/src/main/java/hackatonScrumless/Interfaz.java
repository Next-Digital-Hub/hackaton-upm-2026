package hackatonScrumless;

public abstract class Interfaz {
    private String nik;
    private String contraseña;
    public Interfaz() {
    }

    public Interfaz(String nik,String contraseña) {
        this.nik = nik;
        this.contraseña = contraseña;
    }

    public String getNik() {
        return nik;
    }

    public void setNik(String nik) {
        this.nik = nik;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }


    public void previsionMeteorologiva() {
        double tempActual = servicioClima.consultarTemperatura(miCiudadano.getProvincia());
        String estadoActual = servicioClima.consultarEstadoAtmosferico(miCiudadano.getProvincia());
        System.out.println("la temperatura actual es: "+tempActual+",el clima esta: "+estadoActual);
    }

    public void consultaDatos(){


    }







}
