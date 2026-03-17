package hackatonScrumless;

import org.springframework.web.client.RestTemplate;

public abstract class Interfaz {
    private String nik;
    private String contraseña;
    private final WeatherService weatherServi = new WeatherService(new RestTemplate());
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


    public void previsionMeteorologica() {
        WeatherResponse w = new WeatherResponse(weatherServi);
        System.out.println(w.toString());
    }

    public void consultaDatos(){


    }







}
