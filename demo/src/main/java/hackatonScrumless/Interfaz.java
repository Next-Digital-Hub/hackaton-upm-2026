package hackatonScrumless;

import org.springframework.web.client.RestTemplate;

public abstract class Interfaz {
    protected final WeatherService weatherServi = new WeatherService(new RestTemplate());
    public Interfaz() {
    }
    public void previsionMeteorologica(WeatherResponse w) {
        System.out.println(w.toString());
    }

    public void consultaDatos(){
    }









}
