package hackatonScrumless;

public class InterfazCiudadano extends Interfaz{
    public InterfazCiudadano() {
    }

    public InterfazCiudadano(String nik, String contraseña) {
        super(nik, contraseña);
    }

    public void previsionMeteorologiva() {
        super.previsionMeteorologiva();

        System.out.println();
    }

}
