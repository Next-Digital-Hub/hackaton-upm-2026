import React, { useState, useEffect } from 'react';
import './WeatherDashboard.css';

const WeatherDashboard = ({ onLogout, token }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Endpoints: uno para el clima (externo) y otro para guardar (nuestro backend)
  const FETCH_URL = '/weather-api/weather?disaster=false';
  const SAVE_URL = '/backend/weather/save';

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Llamada real al endpoint
      const response = await fetch(FETCH_URL, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaXRTaXN0ZXJzIiwiZXhwIjoxNzczODIzMTY1fQ.iNdUJ883uC-YTheu0wP5RS9QFlnfzQLmY-qO2NQHgYA', // Asegúrate de reemplazar <TU_TOKEN> en el código final
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const rawData = await response.json();
      
      // Como el endpoint devuelve un array y nosotros mostramos 1 solo objeto en el dashboard,
      // tomamos el primer elemento (el clima más actual)
      const data = Array.isArray(rawData) ? rawData[0] : rawData;
      
      setWeatherData(data);

      // 2. Enviar los datos recibidos a tu backend NestJS para guardarlos en PostgreSQL
      await saveToDatabase(data);

    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("No se pudieron obtener los datos meteorológicos.");
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async (data) => {
    try {
      // Llamada POST a tu backend NestJS
      const response = await fetch(SAVE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Fallo al guardar en la base de datos');
      }
      console.log('Datos guardados en PostgreSQL exitosamente.');
    } catch (err) {
      console.error('Error guardando en BD:', err);
    }
  };

  useEffect(() => {
    // Cargar datos inicialmente
    fetchWeatherData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Main Content Area */}
      <main className="dashboard-content">
        <div className="dashboard-top-bar">
          <div>
            <h2>Estado Actual</h2>
            <p className="subtitle">Última actualización de AEMET</p>
          </div>
          <button 
            className={`update-btn ${loading ? 'loading' : ''}`} 
            onClick={fetchWeatherData}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar Datos'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {weatherData ? (
          <div className="weather-grid">
            {/* Ubicación Card */}
            <div className="weather-card location-card">
              <div className="card-icon">📍</div>
              <div className="card-info">
                <h3>{weatherData.nombre}</h3>
                <p>{weatherData.provincia} • {weatherData.altitud}m altitud</p>
                <span className="date-tag">{weatherData.fecha}</span>
              </div>
            </div>

            {/* Temperaturas Card */}
            <div className="weather-card temp-card">
              <div className="card-header">
                <h3>Temperaturas</h3>
                <div className="card-icon">🌡️</div>
              </div>
              <div className="temp-main">
                <span className="temp-large">{weatherData.tmed}</span>
                <span className="temp-unit">°C</span>
              </div>
              <div className="temp-details">
                <div className="temp-minmax">
                  <span className="label">Mín ({weatherData.horatmin})</span>
                  <span className="value text-blue">{weatherData.tmin}°C</span>
                </div>
                <div className="temp-minmax">
                  <span className="label">Máx ({weatherData.horatmax})</span>
                  <span className="value text-red">{weatherData.tmax}°C</span>
                </div>
              </div>
              {/* Barra de progreso visual para la temperatura */}
              <div className="progress-bar-container">
                <div 
                  className="progress-bar temp-gradient" 
                  style={{ width: `${(parseFloat(weatherData.tmed.replace(',','.')) / 40) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Humedad Card */}
            <div className="weather-card humidity-card">
              <div className="card-header">
                <h3>Humedad Relativa</h3>
                <div className="card-icon">💧</div>
              </div>
              <div className="humidity-main">
                <span className="humidity-large">{weatherData.hrMedia}</span>
                <span className="humidity-unit">%</span>
              </div>
              <div className="humidity-details">
                <div className="hum-minmax">
                  <span className="label">Mín ({weatherData.horaHrMin})</span>
                  <span className="value">{weatherData.hrMin}%</span>
                </div>
                <div className="hum-minmax">
                  <span className="label">Máx ({weatherData.horaHrMax})</span>
                  <span className="value">{weatherData.hrMax}%</span>
                </div>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar humidity-gradient" 
                  style={{ width: `${weatherData.hrMedia}%` }}
                ></div>
              </div>
            </div>

            {/* Precipitación Card */}
            <div className="weather-card prec-card">
              <div className="card-header">
                <h3>Precipitación</h3>
                <div className="card-icon">🌧️</div>
              </div>
              <div className="prec-main">
                <span className="prec-large">{weatherData.prec}</span>
                <span className="prec-unit">mm</span>
              </div>
              <p className="prec-desc">Lluvia acumulada en el día.</p>
            </div>
            
            {/* Detalles Técnicos Card */}
            <div className="weather-card specs-card">
              <div className="card-header">
                <h3>Datos Técnicos</h3>
                <div className="card-icon">⚙️</div>
              </div>
              <ul className="specs-list">
                <li>
                  <span className="spec-label">Indicativo AEMET:</span>
                  <span className="spec-value">{weatherData.indicativo}</span>
                </li>
                <li>
                  <span className="spec-label">Viento Max:</span>
                  <span className="spec-value">{weatherData.racha || 'No desp.'} {weatherData.horaracha && `(${weatherData.horaracha})`}</span>
                </li>
                <li>
                  <span className="spec-label">Presión:</span>
                  <span className="spec-value">{weatherData.presMax || '-'} / {weatherData.presMin || '-'}</span>
                </li>
              </ul>
            </div>

          </div>
        ) : (
          !loading && <div className="no-data">Cargando información meteorológica...</div>
        )}
      </main>

      {/* Decorative Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
    </div>
  );
};

export default WeatherDashboard;