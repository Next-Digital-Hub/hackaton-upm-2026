package hackatonScrumless;

public class InterfazCiudadano extends Interfaz{

    public InterfazCiudadano() {
        super();
    }

    public void previsionMeteorologica(Ciudadano c) {
        WeatherResponse w = new WeatherResponse(weatherServi);
        super.previsionMeteorologica(w);
        String prompt = weatherServi.getRecomendacion("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJbWFub2wiLCJleHAiOjE3NzM4MjI5MTR9.EjooIYhMX_BGpRTEZb8KSyoLSQoCezrgqobIpJ6pLMw",String.format(
                "Usuario: %s. Vivienda: %s. Necesidades: %s. " +
                        "Clima actual: Temp %s°C, Viento %s km/h, Lluvia %s mm. " +
                        "Genera un consejo de seguridad .",
                c.getNik(), c.getVivienda(), c.getNecesidadesEspeciales(),
                w.getTmed(), w.getRacha(), w.getPrec()
        ));
        System.out.println(prompt);
    }

}
