package hackatonScrumless;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.Scanner;

@SpringBootApplication
public class MainClass {

    private Scanner sc = new Scanner(System.in);
    private final WeatherService weatherService;
    private final CiudadanoRepository ciudadanoRepository;

    public MainClass(WeatherService weatherService, CiudadanoRepository ciudadanoRepository) {
        this.weatherService = weatherService;
        this.ciudadanoRepository = ciudadanoRepository;
    }

    public void ejecutar() {
        Ciudadano ciudadano = new Ciudadano("17hsjsJoseEsGay", null, null, null, null);
        ciudadanoRepository.save(ciudadano);
        String weather = weatherService.getWeather(
                false,
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJbWFub2wiLCJleHAiOjE3NzM4MjI5MTR9.EjooIYhMX_BGpRTEZb8KSyoLSQoCezrgqobIpJ6pLMw"
        );
        System.out.println(weather);
    }

    public void ejecutar2() {
        String weather = weatherService.getRecomendacion(

                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJbWFub2wiLCJleHAiOjE3NzM4MjI5MTR9.EjooIYhMX_BGpRTEZb8KSyoLSQoCezrgqobIpJ6pLMw"
        ,sc.next()
        );
        System.out.println(weather);
    }
    @Autowired
    CiudadanoRepository repo;
        @PostConstruct
        public void mostrarCiudadanos() {
            System.out.println(">>> Ciudadanos en la BBDD:");
            repo.findAll().forEach(System.out::println);
        }

    public static void main(String[] args) {
        // 1. Arrancar Spring Boot
        ConfigurableApplicationContext context =
                SpringApplication.run(MainClass.class, args);

        // 2. Obtener instancia de esta clase desde Spring
        MainClass app = context.getBean(MainClass.class);

        // 3. Ejecutar tu método
        app.ejecutar();
        app.ejecutar2();
        app.mostrarCiudadanos();
        Scanner sc = new Scanner(System.in);
        ArrayList<Usuario> baseDatos = new ArrayList<>();
        Usuario sesionActiva = null;

        String respuesta = "";
        while (sesionActiva==null) {
            System.out.println("\n1. Login | 2. Registro Ciudadano | 3. Registro Backoffice");
            respuesta = sc.nextLine();

            switch (respuesta) {
                case "1":
                    sesionActiva = inicioSesion(sc, baseDatos);
                    break;
                    case "2":
                        sesionActiva=registrarCiudadano(sc);
                        baseDatos.add(sesionActiva);
                        break;
                    case "3":
                        sesionActiva=registrarBackoffice(sc);
                        baseDatos.add(sesionActiva);
                        break;
                }
            }



    }
    public static Usuario inicioSesion(Scanner sc, ArrayList<Usuario> db) {
        System.out.print("Introduce NIK: ");
        String nik = sc.nextLine();
        System.out.print("Introduce Pass: ");
        String pass = sc.nextLine();

        for (Usuario u : db) {
            if (u.getNik().equals(nik) && u.getContrasena().equals(pass)) {
                System.out.println("✅ Login correcto como: ");
                return u;
            }
        }
        System.out.println("❌ Usuario o contraseña incorrectos.");
        return null;
    }

    public static Ciudadano registrarCiudadano(Scanner sc) {
        System.out.println("\n--- REGISTRO CIUDADANO ---");
        System.out.print("Introduce NIK: ");
        String nik = sc.nextLine();
        System.out.print("Introduce Contraseña: ");
        String pass = sc.nextLine();

        System.out.print("Provincia: ");
        String prov = sc.nextLine();

        // Selección de Enums
        System.out.println("Tipo de Vivienda (SOTANO, PLANTA_BAJA,PISO_ALTO, CASA_DE_CAMPO): ");
        TipoDeVivienda vivienda = TipoDeVivienda.valueOf(sc.nextLine().toUpperCase());

        System.out.println("Necesidades (NINGUNA, SILLA_DE_RUEDAS, MASCOTAS,PERSONA_DEPENDIENTE): ");
        NecesidadesEspeciales nec = NecesidadesEspeciales.valueOf(sc.nextLine().toUpperCase());

        System.out.println("✅ Ciudadano '" + nik + "' creado con éxito.");
        return new Ciudadano(nik, pass, vivienda, nec, prov);
    }
    public static Backoffice registrarBackoffice(Scanner sc) {
        System.out.println("\n--- REGISTRO PERSONAL BACKOFFICE ---");
        System.out.print("Introduce NIK: ");
        String nik = sc.nextLine();
        System.out.print("Introduce Contraseña: ");
        String pass = sc.nextLine();

        System.out.print("Código de Empleado Público: ");
        String codigo = sc.nextLine();

        System.out.println("⚠️ Administrador '" + nik + "' dado de alta en el sistema.");
        // El constructor de Backoffice solo pide lo necesario
        return new Backoffice(nik, pass, codigo);
    }
}