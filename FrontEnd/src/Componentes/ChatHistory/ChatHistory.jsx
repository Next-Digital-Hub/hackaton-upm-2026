import React, { useState, useEffect } from 'react';
import './ChatHistory.css';

const ChatHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de tu API local de NestJS
  const HISTORY_API_URL = 'http://localhost:3000/weather/chat/history';

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(HISTORY_API_URL);
      if (!response.ok) {
        throw new Error('No se pudo cargar el historial.');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Hubo un problema al conectar con el servidor para obtener los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-container">
      <header className="history-header">
        <div className="header-left">
          <h1 className="brand-logo">EmerCLI</h1>
          <span className="badge">Historial de Consultas</span>
        </div>
        <button className="refresh-btn" onClick={fetchHistory} disabled={loading}>
          {loading ? 'Cargando...' : '🔄 Actualizar'}
        </button>
      </header>

      <main className="history-content">
        {error && <div className="error-box">{error}</div>}

        {!loading && history.length === 0 && !error && (
          <div className="empty-state">
            <p>No hay consultas guardadas todavía. ¡Prueba el Asistente IA!</p>
          </div>
        )}

        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-card-header">
                <span className="timestamp">{formatDate(item.createdAt)}</span>
                <span className="system-tag">Prompt: {item.systemPrompt ? 'Específico' : 'Default'}</span>
              </div>
              
              <div className="history-row">
                <div className="row-label">👤 Usuario:</div>
                <div className="row-content user-text">{item.userPrompt}</div>
              </div>

              <div className="history-row assistant-row">
                <div className="row-label">🤖 EmerCLI:</div>
                <div className="row-content assistant-text">{item.assistantResponse}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Shapes decorativas */}
      <div className="bg-shape shape-h-1"></div>
      <div className="bg-shape shape-h-2"></div>
    </div>
  );
};

export default ChatHistory;
