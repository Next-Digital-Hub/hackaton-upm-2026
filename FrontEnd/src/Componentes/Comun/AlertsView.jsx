import React, { useState, useEffect } from 'react';
import './AlertsView.css';

const AlertsView = ({ token }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/backend/alertas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar alertas');
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las alertas de ubicación.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getSeverityClass = (severity) => {
    switch (severity.toLowerCase()) {
      case 'rojo': return 'severity-high';
      case 'naranja': return 'severity-medium';
      case 'amarillo': return 'severity-low';
      default: return '';
    }
  };

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h2>Alertas de Ubicación</h2>
        <button className="refresh-btn" onClick={fetchAlerts} disabled={loading}>
          {loading ? 'Sincronizando...' : '🔄 Actualizar'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="alerts-list">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-card ${getSeverityClass(alert.severity)}`}>
              <div className="alert-badge">{alert.severity}</div>
              <div className="alert-main">
                <div className="alert-title-row">
                  <h3>{alert.type}</h3>
                  <span className="alert-location">📍 {alert.location}</span>
                </div>
                <p className="alert-desc">{alert.description}</p>
                <span className="alert-time">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          !loading && <div className="no-alerts">No hay alertas activas en tu zona. 🌱</div>
        )}
      </div>
    </div>
  );
};

export default AlertsView;
