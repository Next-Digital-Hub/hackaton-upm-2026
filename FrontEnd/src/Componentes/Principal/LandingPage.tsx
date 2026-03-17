import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const { keycloak } = useKeycloak();

  const onLogin = () => {
    keycloak.login({ redirectUri: window.location.origin });
  };

  const onRegister = () => {
    keycloak.register({ redirectUri: window.location.origin });
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Cuidamos el Futuro con EmerCLI</h1>
        <p className="landing-subtitle">
          Tu asistente inteligente para una gestión de emergencias sostenible y eficiente. 
          Protegiendo comunidades y preservando el entorno.
        </p>
        <div className="auth-actions">
          <button className="login-button secondary" onClick={onRegister}>
            Registrarse
          </button>
          <button className="login-button primary" onClick={onLogin}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
