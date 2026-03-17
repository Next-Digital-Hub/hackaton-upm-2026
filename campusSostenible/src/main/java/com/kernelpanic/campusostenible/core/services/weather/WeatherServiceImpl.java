package com.kernelpanic.campusostenible.core.services.weather;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.kernelpanic.campusostenible.core.domain.WeatherData;
import com.kernelpanic.campusostenible.core.domain.Alert;
import com.kernelpanic.campusostenible.core.providers.MeteoData;
import com.kernelpanic.campusostenible.core.services.weather.dal.WeatherRepository;
import com.kernelpanic.campusostenible.core.services.alert.dal.AlertRepository;

import java.util.stream.Collectors;

@Service
public class WeatherServiceImpl implements WeatherService {

    private final WeatherRepository weatherRepository;
    private final AlertRepository alertRepository;

    public WeatherServiceImpl(WeatherRepository weatherRepository,
            AlertRepository alertRepository) {
        this.weatherRepository = weatherRepository;
        this.alertRepository = alertRepository;
    }

    @Override
    public Optional<WeatherData> getMeteoDataByProvinceAndDate(Long provinceId, LocalDate date) {
        return weatherRepository.findByProvinceIdAndDate(provinceId, date);
    }

    @Override
    public List<WeatherData> getWeatherByProvice(Long provinceId) {
        return weatherRepository.findByProvinceId(provinceId);
    }

    @Override
    public WeatherData saveWeather(WeatherData weatherData) {
        return weatherRepository.save(weatherData);
    }

    @Override
    public List<MeteoData> getAllMeteoData(LocalDate date) {
        return weatherRepository.findByDate(date).stream()
                .map(this::toMeteoData)
                .collect(Collectors.toList());
    }

    private MeteoData toMeteoData(WeatherData data) {
        return MeteoData.builder()
                .provincia(data.getProvinceId() != null ? data.getProvinceId().toString() : "")
                .fecha(data.getDate().toString())
                .tmax(String.valueOf(data.getTemperatureMax()))
                .tmin(String.valueOf(data.getTemperatureMin()))
                .hrMedia(String.valueOf(data.getHumidity()))
                .velmedia(String.valueOf(data.getWindSpeed()))
                .dir(data.getWindDirection())
                .build();
    }

    @Override
    public String getAlertAdvice(MeteoData data) {
        StringBuilder advice = new StringBuilder();
        try {
            double tmax = data.getTmax() != null ? Double.parseDouble(data.getTmax().replace(",", ".")) : 0;
            double prec = data.getPrec() != null ? Double.parseDouble(data.getPrec().replace(",", ".")) : 0;
            double racha = data.getRacha() != null ? Double.parseDouble(data.getRacha().replace(",", ".")) : 0;

            if (tmax > 40) advice.append("⚠️ **Aviso de Calor Extremo:** Temperatura máxima superior a 40°C detectada. Se recomienda emitir alerta roja.\n");
            else if (tmax > 36) advice.append("⚠️ **Aviso de Ola de Calor:** Temperatura máxima superior a 36°C detectada. Se recomienda emitir alerta naranja/amarilla.\n");

            if (prec > 50) advice.append("🌊 **Aviso de Inundación:** Precipitación superior a 50mm detectada. Se recomienda emitir alerta roja.\n");
            else if (prec > 20) advice.append("🌧️ **Aviso de Lluvias Intensas:** Precipitación superior a 20mm detectada. Se recomienda emitir alerta naranja.\n");

            if (racha > 100) advice.append("💨 **Aviso de Viento Huracanado:** Rachas superiores a 100km/h detectadas. Se recomienda emitir alerta roja.\n");
            else if (racha > 70) advice.append("💨 **Aviso de Viento Fuerte:** Rachas superiores a 70km/h detectadas. Se recomienda emitir alerta naranja.\n");
        } catch (NumberFormatException e) {
            return "❌ Error al procesar datos para aviso automático.";
        }
        return advice.length() > 0 ? advice.toString() : "✅ No se detectan anomalías críticas para este registro.";
    }

    @Override
    public void saveWeatherAlert(Alert alert) {
        alertRepository.save(alert);
    }

}
