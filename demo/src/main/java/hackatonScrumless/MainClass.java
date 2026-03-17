package hackatonScrumless;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class MainClass {

    private final WeatherService weatherService;

    public MainClass(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    public void ejecutar() {
        String weather = weatherService.getWeather(
                false,
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJbWFub2wiLCJleHAiOjE3NzM4MjI5MTR9.EjooIYhMX_BGpRTEZb8KSyoLSQoCezrgqobIpJ6pLMw"
        );
        System.out.println(weather);
    }

    public static void main(String[] args) {

        // 1. Arrancar Spring Boot
        ConfigurableApplicationContext context =
                SpringApplication.run(MainClass.class, args);

        // 2. Obtener instancia de esta clase desde Spring
        MainClass app = context.getBean(MainClass.class);

        // 3. Ejecutar tu método
        app.ejecutar();
    }
}