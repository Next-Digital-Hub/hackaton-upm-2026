import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
// @ts-ignore
import WeatherDashboard from '../Comun/WeatherDashboard';
// @ts-ignore
import ChatAssistant from '../ChatAssistant/ChatAssistant';
// @ts-ignore
import AlertsView from '../Comun/AlertsView';
import './Home.css';

interface HomeProps {
  currentView: 'main' | 'weather' | 'chat' | 'alerts';
  setCurrentView: (view: 'main' | 'weather' | 'chat' | 'alerts') => void;
  userProfile?: any;
  roles?: string[];
}

const Home: React.FC<HomeProps> = ({ currentView, setCurrentView, userProfile, roles = [] }) => {
  const { keycloak } = useKeycloak();

  const userName = keycloak.tokenParsed?.preferred_username || 'Usuario';
  const fullName = keycloak.tokenParsed?.name || userName;

  if (currentView === 'weather') {
    return (
      <div className="home-subview">
        <button className="back-button" onClick={() => setCurrentView('main')}>
          ← Volver al Inicio
        </button>
        <WeatherDashboard token={keycloak.token} />
      </div>
    );
  }

  if (currentView === 'chat') {
    return (
      <div className="home-subview">
        <button className="back-button" onClick={() => setCurrentView('main')}>
          ← Volver al Inicio
        </button>
        {/* @ts-ignore */}
        <ChatAssistant 
          token={keycloak.token} 
          userName={fullName} 
          roles={roles} 
          userProfile={userProfile}
        />
      </div>
    );
  }

  if (currentView === 'alerts') {
    return (
      <div className="home-subview">
        <button className="back-button" onClick={() => setCurrentView('main')}>
          ← Volver al Inicio
        </button>
        <AlertsView token={keycloak.token} />
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="welcome-section">
          <div className="user-profile-row">
            <h1 className="welcome-text">¡Bienvenido de nuevo, <span className="highlight-text">{fullName}</span>!</h1>
          </div>
          <p className="subtitle">Explora tus aplicaciones y servicios personalizados.</p>
        </div>
      </header>

      <main className="home-grid">
        <div className="card-item animate-up">
          <div className="card-icon">🌤️</div>
          <h3>Tiempo</h3>
          <p>Predicciones del tiempo en tu zona.</p>
          <button className="card-button" onClick={() => setCurrentView('weather')}>Acceder</button>
        </div>

        <div className="card-item animate-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-icon">🤖</div>
          <h3>Chat</h3>
          <p>Habla con tu asistente.</p>
          <button className="card-button" onClick={() => setCurrentView('chat')}>Chatear</button>
        </div>

        <div className="card-item animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-icon">🚩</div>
          <h3>Alertas</h3>
          <p>Consulta las alertas de emergencia de tu ubicación.</p>
          <button className="card-button" onClick={() => setCurrentView('alerts')}>Ver Alertas</button>
        </div>

      </main>

      <footer className="home-footer">
        <p>© 2026 EmerCLI</p>
      </footer>
    </div>
  );
};

export default Home;
