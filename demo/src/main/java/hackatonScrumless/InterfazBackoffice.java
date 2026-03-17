package hackatonScrumless;

public class InterfazBackoffice extends Interfaz{

    public void previsionMeteorologica(){
        WeatherResponse w = new WeatherResponse(weatherServi);
        super.previsionMeteorologica(w);
        String prompt = String.format(
                "Analiza: Lluvia %s, Viento %s, Presion %s. ¿Enviar alerta? Responde con: DECISION | NIVEL | RAZON",
                w.getPrec(), w.getRacha(), w.getPresMin()
        );
        System.out.println( weatherServi.getRecomendacion("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJbWFub2wiLCJleHAiOjE3NzM4MjI5MTR9.EjooIYhMX_BGpRTEZb8KSyoLSQoCezrgqobIpJ6pLMw",
                "Eres un experto en riesgos naturales."+ prompt));


    }
    public Alerta crearAlerta(String titulo, String mensaje, NivelDeAlerta nivel, String zona){
        Alerta nuevaAlerta = new Alerta(
                titulo,
                mensaje,
                nivel,
                "Centro de Control Meteorológico", // Emisor por defecto
                zona
        );

        // 2. Aquí podrías añadir lógica extra antes de devolverla
        // Ejemplo: Si es DESASTRE, forzar que el mensaje esté en mayúsculas
        if (nivel == NivelDeAlerta.DESASTRE) {
            nuevaAlerta.setMensaje("\u001B[31m" + nuevaAlerta.getMensaje().toUpperCase() + "\u001B[0m");
        }

        return nuevaAlerta;
    }
    }
