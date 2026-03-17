package hackatonScrumless;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.ArrayList;
import java.util.Scanner;

@SpringBootApplication
public class MainClass {

    private Scanner sc = new Scanner(System.in);
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

    public void ejecutar2() {
        String weather = weatherService.getRecomendacion(

                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJbWFub2wiLCJleHAiOjE3NzM4MjI5MTR9.EjooIYhMX_BGpRTEZb8KSyoLSQoCezrgqobIpJ6pLMw"
        ,sc.next()
        );
        System.out.println(weather);
    }

    public static void main(String[] args) {
       /* SessionFactory sessionFactory = new Configuration().configure().buildSessionFactory();
        Session session = sessionFactory.openSession();

        session.beginTransaction();

        Usuario u = new Usuario();
        u.setNik("Sergio");

        session.persist(u);

        session.getTransaction().commit();
        session.close();
        sessionFactory.close();*/

        // 1. Arrancar Spring Boot
        ConfigurableApplicationContext context =
                SpringApplication.run(MainClass.class, args);

        // 2. Obtener instancia de esta clase desde Spring
        MainClass app = context.getBean(MainClass.class);

        // 3. Ejecutar tu método
        //app.ejecutar();
        //app.ejecutar2();
        Scanner sc = new Scanner(System.in);
        ArrayList<Usuario> baseDatos = new ArrayList<>();
        Usuario sesionActiva = null;

        String respuesta = "";
        while (!respuesta.equalsIgnoreCase("exit")) {
            System.out.println("\n1. Login | 2. Registro Ciudadano | 3. Registro Backoffice");
            respuesta = sc.nextLine();

            switch (respuesta) {
                case "1":
                    sesionActiva = inicioSesion(sc, baseDatos);
                    break;
                    case "2":
                        sesionActiva:registrarCiudadano(sc);
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
        System.out.println("Tipo de Vivienda (SOTANO, ATICO, NORMAL): ");
        TipoDeVivienda vivienda = TipoDeVivienda.valueOf(sc.nextLine().toUpperCase());

        System.out.println("Necesidades (NINGUNA, SILLA_DE_RUEDAS, ANCIANO): ");
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