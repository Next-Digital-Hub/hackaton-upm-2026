package etsisi.albertoynico.backend.config;

import etsisi.albertoynico.backend.model.NivelAlerta;
import etsisi.albertoynico.backend.model.TipoAlerta;

import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;

public class UmbralesAlertaConfig {

    /**
     * Define los umbrales máximos para cada Nivel de Alerta, agrupados por Tipo de Alerta.
     * 
     * Reglas de interpretación:
     * - Si el valor está por debajo de VERDE -> NO_APLICA
     * - Si el valor es mayor a NARANJA -> ROJO (ya que ROJO no tiene un valor máximo)
     * 
     * Nota: En lugar de definir NO_APLICA y ROJO aquí como límites numéricos absolutos, 
     * definimos únicamente los "techos" de los niveles intermedios.
     */
    private static final Map<TipoAlerta, Map<NivelAlerta, Double>> UMBRALES_MAXIMOS = new EnumMap<>(TipoAlerta.class);

    static {
        // --- TEMPERATURA ---
        Map<NivelAlerta, Double> temperatura = new EnumMap<>(NivelAlerta.class);
        temperatura.put(NivelAlerta.VERDE, 30.0);    // Hasta 30 -> VERDE. Menos de algo específico se puede ajustar para NO_APLICA si es para frío
        temperatura.put(NivelAlerta.AMARILLO, 35.0); // Hasta 35 -> AMARILLO
        temperatura.put(NivelAlerta.NARANJA, 40.0);  // Hasta 40 -> NARANJA. Más de 40 -> ROJO
        UMBRALES_MAXIMOS.put(TipoAlerta.TEMPERATURA, temperatura);

        // --- LLUVIA ---
        Map<NivelAlerta, Double> lluvia = new EnumMap<>(NivelAlerta.class);
        lluvia.put(NivelAlerta.VERDE, 15.0);
        lluvia.put(NivelAlerta.AMARILLO, 30.0);
        lluvia.put(NivelAlerta.NARANJA, 60.0);
        UMBRALES_MAXIMOS.put(TipoAlerta.LLUVIA, lluvia);

        // --- VIENTO ---
        Map<NivelAlerta, Double> viento = new EnumMap<>(NivelAlerta.class);
        viento.put(NivelAlerta.VERDE, 40.0);
        viento.put(NivelAlerta.AMARILLO, 70.0);
        viento.put(NivelAlerta.NARANJA, 90.0);
        UMBRALES_MAXIMOS.put(TipoAlerta.VIENTO, viento);

        // --- HUMEDAD ---
        Map<NivelAlerta, Double> humedad = new EnumMap<>(NivelAlerta.class);
        humedad.put(NivelAlerta.VERDE, 40.0);
        humedad.put(NivelAlerta.AMARILLO, 60.0);
        humedad.put(NivelAlerta.NARANJA, 80.0);
        UMBRALES_MAXIMOS.put(TipoAlerta.HUMEDAD, humedad);

        // --- PRESION ---
        Map<NivelAlerta, Double> presion = new EnumMap<>(NivelAlerta.class);
        presion.put(NivelAlerta.VERDE, 1000.0);
        presion.put(NivelAlerta.AMARILLO, 1015.0);
        presion.put(NivelAlerta.NARANJA, 1030.0);
        UMBRALES_MAXIMOS.put(TipoAlerta.PRESION, presion);
    }

    /**
     * Evalúa el nivel de alerta correspondiente para un valor dado, basándose en los umbrales máximos.
     * 
     * @param tipo El tipo de alerta (TEMPERATURA, LLUVIA, etc.)
     * @param valor El valor numérico registrado a evaluar (ej: grados, mm/h, km/h)
     * @param limiteNoAplica Valor por debajo del cual se considera NO_APLICA.
     * @return El NivelAlerta correspondiente (NO_APLICA, VERDE, AMARILLO, NARANJA, o ROJO)
     */
    public static NivelAlerta evaluarNivel(TipoAlerta tipo, double valor, double limiteNoAplica) {
        if (valor < limiteNoAplica) {
            return NivelAlerta.NO_APLICA;
        }

        Map<NivelAlerta, Double> umbrales = UMBRALES_MAXIMOS.get(tipo);
        if (umbrales == null) {
            return NivelAlerta.NO_APLICA; // O un valor por defecto si no hay configuración
        }

        if (valor <= umbrales.get(NivelAlerta.VERDE)) {
            return NivelAlerta.VERDE;
        } else if (valor <= umbrales.get(NivelAlerta.AMARILLO)) {
            return NivelAlerta.AMARILLO;
        } else if (valor <= umbrales.get(NivelAlerta.NARANJA)) {
            return NivelAlerta.NARANJA;
        } else {
            // Si supera el límite de NARANJA, entonces es ROJO (no tiene límite superior definido aquí)
            return NivelAlerta.ROJO;
        }
    }

    /**
     * Obtiene el umbral máximo registrado para un Tipo de Alerta y un Nivel en específico.
     */
    public static Optional<Double> getUmbralMaximo(TipoAlerta tipo, NivelAlerta nivel) {
        if (nivel == NivelAlerta.ROJO || nivel == NivelAlerta.NO_APLICA) {
            return Optional.empty(); // ROJO y NO_APLICA no tienen límite superior explícito en este mapa.
        }
        
        Map<NivelAlerta, Double> umbrales = UMBRALES_MAXIMOS.get(tipo);
        if (umbrales != null && umbrales.containsKey(nivel)) {
            return Optional.of(umbrales.get(nivel));
        }
        return Optional.empty();
    }

    public static Map<TipoAlerta, Map<NivelAlerta, Double>> getUmbralesMap() {
        return UMBRALES_MAXIMOS;
    }
}
