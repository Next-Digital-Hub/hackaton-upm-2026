import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import './HeaderComun.css';

interface HeaderComunProps {
  currentView: string;
  onNavigate: (view: 'main' | 'weather' | 'chat' | 'alerts') => void;
  userProfile?: any;
  roles?: string[];
}

const HeaderComun: React.FC<HeaderComunProps> = ({ currentView, onNavigate, userProfile, roles = [] }) => {
  const { keycloak } = useKeycloak();
  const userName = keycloak.tokenParsed?.preferred_username || 'Usuario';
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileConfig, setShowProfileConfig] = useState(false);
  const isAdmin = roles.includes('admin');

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <header className="header-comun">
      <div className="header-logo" onClick={() => onNavigate('main')} style={{ cursor: 'pointer' }}>
        EmerCLI
      </div>

      <nav className="header-nav">
        <div
          className={`nav-item ${currentView === 'alerts' ? 'active' : ''}`}
          onClick={() => onNavigate('alerts')}
        >
          Alertas
        </div>
        <div
          className={`nav-item ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => onNavigate('chat')}
        >
          Consultas
        </div>
        <div
          className={`nav-item ${currentView === 'weather' ? 'active' : ''}`}
          onClick={() => onNavigate('weather')}
        >
          Datos Meteorológicos
        </div>
      </nav>

      <div className="header-profile">
        {userProfile?.province && (
          <span className="header-location-badge">📍 {userProfile.province}</span>
        )}
        <span className="user-greeting">
          {userName}
          {isAdmin && <span className="admin-status-badge">Admin</span>}
        </span>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* Profile Config Modal moved to Header for global access */}
      {showProfileConfig && (
        <div className="profile-config-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Configurar Perfil de Seguridad</h2>
              <button className="close-modal" onClick={() => setShowProfileConfig(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="info-text">
                Tu perfil se usa para personalizar las alertas de emergencias climáticas basadas en tu vivienda y movilidad.
              </p>
              {userProfile && (
                <div className="profile-summary">
                  <div className="summary-item">
                    <span>📍 Provincia:</span>
                    <span>{userProfile.province || 'No especificada'}</span>
                  </div>
                  <div className="summary-item">
                    <span>🏠 Vivienda:</span>
                    <span>{userProfile.housingType || 'No especificada'}</span>
                  </div>
                  <div className="summary-item">
                    <span>👨‍👩‍👧‍👦 Dependientes:</span>
                    <span>{userProfile.dependentsCount || 0}</span>
                  </div>
                  <div className="summary-item">
                    <span>🐾 Mascotas:</span>
                    <span>{userProfile.hasPets ? 'Sí' : 'No'}</span>
                  </div>
                </div>
              )}
              <a
                href="#"
                className="edit-profile-link"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/user-profile-complete', '_blank');
                }}
              >
                → Editar perfil completo
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderComun;