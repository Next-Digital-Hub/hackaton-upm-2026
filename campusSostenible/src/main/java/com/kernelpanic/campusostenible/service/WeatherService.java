package com.kernelpanic.campusostenible.service;

import com.kernelpanic.campusostenible.domain.*;
import com.kernelpanic.campusostenible.dto.WeatherRecommendationDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.*;

@Service
public class WeatherService {

    private final MarkdownService markdownService;

    public WeatherService(MarkdownService markdownService) {
        this.markdownService = markdownService;
    }

    public WeatherRecommendationDTO getDailyRecommendations(MeteoData data) {
        StringBuilder markdown = new StringBuilder();
        
        markdown.append("## 📋 Informe de precauciones y recomendaciones\n\n");
        markdown.append("Este informe se ha generado automáticamente en base a las condiciones meteorológicas actuales para la provincia de **")
                .append(data.getProvince()).append("**.\n\n---\n\n");

        // Temperature-based
        if (data.getTemperatureMax() >= 35) {
            markdown.append("### 🌡️ Calor extremo previsto (Max: ").append(data.getTemperatureMax()).append("°C)\n\n");
            markdown.append("Se esperan **altas temperaturas**. Siga estas pautas:\n\n");
            markdown.append("- Beba al menos **2 litros de agua** al día\n");
            markdown.append("- Evite el ejercicio al aire libre entre las **12h y las 17h**\n");
            markdown.append("- Busque lugares frescos y con sombra\n");
            markdown.append("- Preste especial atención a *personas mayores y niños*\n\n---\n\n");
        } else if (data.getTemperatureMax() >= 28) {
            markdown.append("### 💧 Temperaturas cálidas\n\n");
            markdown.append("Temperaturas **cálidas** previstas. Recomendaciones:\n\n");
            markdown.append("- Lleve siempre una **botella de agua**\n");
            markdown.append("- Use ropa *ligera y transpirable*\n");
            markdown.append("- Tome descansos frecuentes si trabaja al aire libre\n\n---\n\n");
        } else if (data.getTemperatureMin() <= 0) {
            markdown.append("### 🧣 Temperaturas bajo cero previsto (Min: ").append(data.getTemperatureMin()).append("°C)\n\n");
            markdown.append("Se esperan **heladas**. Protéjase:\n\n");
            markdown.append("- Vista **varias capas** de ropa\n");
            markdown.append("- Proteja extremidades: *guantes, gorro y bufanda*\n");
            markdown.append("- Precaución con **placas de hielo** en aceras y carreteras\n");
            markdown.append("- Revise el estado de su vehículo (*anticongelante, neumáticos*)\n\n---\n\n");
        } else if (data.getTemperatureMin() <= 8) {
            markdown.append("### 🧥 Temperaturas frescas\n\n");
            markdown.append("Temperaturas **frescas** previstas:\n\n");
            markdown.append("- Use **abrigo, bufanda y guantes**\n");
            markdown.append("- Especial atención en las *primeras horas de la mañana* y por la noche\n");
            markdown.append("- Mantenga una temperatura estable en interiores\n\n---\n\n");
        }

        // UV-based
        if (data.getUvIndex() >= 8) {
            markdown.append("### 🧴 Índice UV muy alto\n\n");
            markdown.append("El índice UV es **muy alto**. Protección imprescindible:\n\n");
            markdown.append("- Aplique protector solar **SPF 50+** cada 2 horas\n");
            markdown.append("- Use **gafas de sol** con filtro UV y **sombrero**\n");
            markdown.append("- Evite la exposición directa al sol en las *horas centrales*\n\n---\n\n");
        } else if (data.getUvIndex() >= 5) {
            markdown.append("### 😎 Protección solar recomendada\n\n");
            markdown.append("Índice UV **moderado-alto**:\n\n");
            markdown.append("- Use **protector solar** si va a estar al aire libre\n");
            markdown.append("- Lleve **gafas de sol** para proteger sus ojos\n\n---\n\n");
        }

        // Rain-based
        if (data.getRainProbability() >= 70) {
            markdown.append("### ☂️ Alta probabilidad de lluvia\n\n");
            markdown.append("**Alta probabilidad de lluvia** (").append(data.getRainProbability()).append("%). No olvide:\n\n");
            markdown.append("- Llevar **paraguas** y calzado **impermeable**\n");
            markdown.append("- Precaución al conducir: *charcos y reducción de visibilidad*\n");
            markdown.append("- Evite zonas con riesgo de acumulación de agua\n\n---\n\n");
        }

        // Wind-based
        if (data.getWindSpeed() >= 50) {
            markdown.append("### 💨 Viento muy fuerte\n\n");
            markdown.append("Rachas de viento **intensas** previstas (").append(data.getWindSpeed()).append(" km/h):\n\n");
            markdown.append("- **Asegure objetos** en balcones y terrazas\n");
            markdown.append("- Evite zonas arboladas y estructuras inestables\n");
            markdown.append("- Precaución al conducir, especialmente en *puentes y zonas expuestas*\n");
            markdown.append("- No circule con vehículos de **perfil alto**\n\n---\n\n");
        }

        // Condition-specific
        switch (data.getWeatherCondition()) {
            case STORMY -> {
                markdown.append("### ⚡ Tormentas previstas\n\n");
                markdown.append("Evite **actividades al aire libre** en zonas abiertas:\n\n");
                markdown.append("- No se refugie bajo *árboles aislados*\n");
                markdown.append("- Manténgase alejado de **elementos metálicos**\n");
                markdown.append("- Desconecte aparatos eléctricos sensibles\n\n---\n\n");
            }
            case SNOWY -> {
                markdown.append("### ❄️ Nevadas previstas\n\n");
                markdown.append("**Precaución en carreteras**:\n\n");
                markdown.append("- Compruebe el estado de las carreteras *antes de salir*\n");
                markdown.append("- Lleve **cadenas** en el vehículo\n");
                markdown.append("- Reduzca la velocidad y use calzado con *suela antideslizante*\n\n---\n\n");
            }
            case FOGGY -> {
                markdown.append("### 🌫️ Niebla prevista\n\n");
                markdown.append("**Visibilidad reducida**. Al conducir:\n\n");
                markdown.append("- Encienda las **luces antiniebla**\n");
                markdown.append("- Mantenga *distancia de seguridad* aumentada\n");
                markdown.append("- Reduzca la velocidad, especialmente en *carreteras secundarias*\n\n---\n\n");
            }
            case SUNNY -> {
                markdown.append("### 🌳 Día soleado\n\n");
                markdown.append("¡Buen día para **actividades al aire libre**!\n\n");
                markdown.append("- Aproveche para *pasear, hacer ejercicio* o disfrutar de los parques\n");
                markdown.append("- No olvide la **protección solar**\n\n---\n\n");
            }
            default -> {}
        }

        // Always add a general sustainability tip
        markdown.append("### ♻️ Consejo sostenible del día\n\n");
        markdown.append(getSustainabilityTip(data));
        
        String renderedHtml = markdownService.toHtml(markdown.toString());

        return WeatherRecommendationDTO.builder()
                .htmlContent(renderedHtml)
                .build();
    }

    private String getSustainabilityTip(MeteoData data) {
        return switch (data.getWeatherCondition()) {
            case SUNNY -> "Hoy es un gran día para **secar la ropa al sol** en lugar de usar la secadora. ¡Ahorrarás energía y tu ropa lo agradecerá! ☀️";
            case RAINY -> "Aprovecha el **agua de lluvia** con un sistema de recogida para regar tus plantas. *Cada gota cuenta* para un campus más sostenible. 💧";
            case CLOUDY, PARTLY_CLOUDY -> "Con temperaturas moderadas, considera ir **andando o en bici**. Reducirás tu *huella de carbono* y mejorarás tu salud. 🚲";
            case STORMY -> "Desconecta los aparatos electrónicos que no uses. Además de seguridad, **ahorrarás energía** en modo *standby*. 🔌";
            case SNOWY -> "Mantén tu calefacción entre **19-21°C**. Cada grado de más supone un *7% extra* de consumo energético. 🌡️";
            case FOGGY -> "Con poca visibilidad, usa **transporte público** si es posible. Es más *seguro* y más *sostenible* que el coche particular. 🚌";
        };
    }

    private static final List<String> PROVINCES = List.of(
            "A Coruña", "Álava", "Albacete", "Alicante", "Almería",
            "Asturias", "Ávila", "Badajoz", "Barcelona", "Burgos",
            "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real",
            "Córdoba", "Cuenca", "Girona", "Granada", "Guadalajara",
            "Guipúzcoa", "Huelva", "Huesca", "Illes Balears", "Jaén",
            "Las Palmas", "León", "Lleida", "Lugo", "Madrid",
            "Málaga", "Murcia", "Navarra", "Ourense", "Palencia",
            "Pontevedra", "La Rioja", "Salamanca", "Santa Cruz de Tenerife",
            "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel",
            "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
    );

    private static final String[] WIND_DIRECTIONS = {"N", "NE", "E", "SE", "S", "SO", "O", "NO"};

    public List<String> getProvinces() {
        return PROVINCES;
    }

    public MeteoData getWeatherForDate(String province, LocalDate date) {
        Random rng = seededRandom(province, date);

        WeatherCondition condition = WeatherCondition.values()[rng.nextInt(WeatherCondition.values().length)];

        double baseTemp = getBaseTemperature(province, date);
        double tempMax = baseTemp + rng.nextDouble() * 8;
        double tempMin = baseTemp - rng.nextDouble() * 6;

        return MeteoData.builder()
                .date(date)
                .province(province)
                .temperatureMax(Math.round(tempMax * 10.0) / 10.0)
                .temperatureMin(Math.round(tempMin * 10.0) / 10.0)
                .humidity(30 + rng.nextInt(50))
                .windSpeed(Math.round((5 + rng.nextDouble() * 60) * 10.0) / 10.0)
                .windDirection(WIND_DIRECTIONS[rng.nextInt(WIND_DIRECTIONS.length)])
                .weatherCondition(condition)
                .uvIndex(1 + rng.nextInt(10))
                .rainProbability(rng.nextInt(101))
                .build();
    }

    public List<MeteoData> getWeatherHistory(String province, LocalDate fromDate, int days) {
        return IntStream.range(0, days)
                .mapToObj(i -> getWeatherForDate(province, fromDate.minusDays(i)))
                .collect(Collectors.toList());
    }

    public List<WeatherAlert> getActiveAlerts(String province, LocalDate date) {
        Random rng = seededRandom(province, date);
        List<WeatherAlert> alerts = new ArrayList<>();

        // ~30% chance of having an alert on any given day
        if (rng.nextInt(100) < 30) {
            AlertLevel level = pickAlertLevel(rng);
            AlertType type = AlertType.values()[rng.nextInt(AlertType.values().length)];

            alerts.add(WeatherAlert.builder()
                    .alertLevel(level)
                    .alertType(type)
                    .title(buildAlertTitle(level, type))
                    .description(buildAlertDescription(type, province))
                    .safetyRecommendation(buildSafetyRecommendation(type, level))
                    .startDate(date)
                    .endDate(date.plusDays(1 + rng.nextInt(2)))
                    .build());
        }

        // ~10% chance of a second alert
        if (rng.nextInt(100) < 10) {
            AlertType type = AlertType.values()[rng.nextInt(AlertType.values().length)];
            AlertLevel level = pickAlertLevel(rng);

            alerts.add(WeatherAlert.builder()
                    .alertLevel(level)
                    .alertType(type)
                    .title(buildAlertTitle(level, type))
                    .description(buildAlertDescription(type, province))
                    .safetyRecommendation(buildSafetyRecommendation(type, level))
                    .startDate(date)
                    .endDate(date.plusDays(1))
                    .build());
        }

        return alerts;
    }

    // --- Private helpers ---

    private Random seededRandom(String province, LocalDate date) {
        long seed = (province + date.toString()).hashCode();
        return new Random(seed);
    }

    private double getBaseTemperature(String province, LocalDate date) {
        int month = date.getMonthValue();
        // Simplified seasonal temp curve
        double seasonal = 15 + 12 * Math.sin((month - 4) * Math.PI / 6.0);
        // Provincial modifier (southern provinces warmer)
        int idx = PROVINCES.indexOf(province);
        double modifier = (idx >= 0) ? (idx % 10) * 0.5 - 2 : 0;
        return seasonal + modifier;
    }

    private AlertLevel pickAlertLevel(Random rng) {
        int r = rng.nextInt(100);
        if (r < 50) return AlertLevel.YELLOW;
        if (r < 80) return AlertLevel.ORANGE;
        return AlertLevel.RED;
    }

    private String buildAlertTitle(AlertLevel level, AlertType type) {
        return String.format("Alerta %s por %s", level.getDisplayName(), type.getDisplayName().toLowerCase());
    }

    private String buildAlertDescription(AlertType type, String province) {
        return switch (type) {
            case HEAT -> "Se esperan temperaturas extremadamente altas en la provincia de " + province + ". Las temperaturas podrían superar los 40°C.";
            case COLD -> "Se prevé un descenso brusco de temperaturas en " + province + ". Las temperaturas podrían descender por debajo de -5°C.";
            case WIND -> "Se esperan rachas de viento muy fuertes en " + province + " que podrían superar los 100 km/h.";
            case RAIN -> "Se prevén lluvias intensas y persistentes en " + province + ". Posibilidad de inundaciones en zonas bajas.";
            case SNOW -> "Se esperan nevadas copiosas en " + province + ". Acumulaciones significativas en zonas elevadas.";
            case STORM -> "Se prevén tormentas intensas con aparato eléctrico en " + province + ". Posibilidad de granizo.";
        };
    }

    private String buildSafetyRecommendation(AlertType type, AlertLevel level) {
        String base = switch (type) {
            case HEAT -> "Manténgase hidratado, evite la exposición al sol entre las 12h y las 17h. Use protección solar y ropa ligera. Preste especial atención a personas mayores y niños.";
            case COLD -> "Protéjase del frío con ropa adecuada por capas. Evite desplazamientos innecesarios. Mantenga la calefacción a temperatura estable.";
            case WIND -> "Asegure objetos en terrazas y balcones. Evite pasear por zonas arboladas o con estructuras inestables. No circule con vehículos de perfil alto.";
            case RAIN -> "Aléjese de cauces de ríos y barrancos. Evite circular por zonas inundables. No cruce vados ni zonas con acumulación de agua.";
            case SNOW -> "Equipe su vehículo con cadenas si es necesario. Precaución en carreteras de montaña. Evite desplazamientos si no son imprescindibles.";
            case STORM -> "Refúgiese en edificios sólidos. No se resguarde bajo árboles aislados. Desconecte aparatos eléctricos si hay tormenta eléctrica cercana.";
        };

        if (level == AlertLevel.RED) {
            base += " ⚠️ RIESGO EXTREMO: Siga las instrucciones de Protección Civil y manténgase informado por los canales oficiales.";
        }

        return base;
    }
}
