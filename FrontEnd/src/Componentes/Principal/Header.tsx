import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import './Header.css';

const Header: React.FC = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak.login({ redirectUri: window.location.origin });
  };

  const handleRegister = () => {
    keycloak.register({ redirectUri: window.location.origin });
  };

  return (
    <header className="landing-header">
      <div className="logo-text">
        EmerCLI
      </div>
      
      <div className="auth-buttons">
        <button className="btn-landing btn-register" onClick={handleRegister}>
          Registrarse
        </button>
        <button className="btn-landing btn-login" onClick={handleLogin}>
          Iniciar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;