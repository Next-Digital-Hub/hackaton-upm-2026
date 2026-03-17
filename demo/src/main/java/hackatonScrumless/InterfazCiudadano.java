package hackatonScrumless;

public class InterfazCiudadano extends Interfaz{
    public InterfazCiudadano() {
    }

    public InterfazCiudadano(String nik, String contraseña) {
        super(nik, contraseña);
    }

    public void previsionMeteorologica() {
        super.previsionMeteorologica();

        System.out.println();
    }

}
