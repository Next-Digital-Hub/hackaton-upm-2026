import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import HeaderComun from './Componentes/Comun/HeaderComun'
import LandingPage from './Componentes/Principal/LandingPage';
import Home from './Componentes/Principal/Home';
import './App.css'
import Header from './Componentes/Principal/Header';

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [currentView, setCurrentView] = useState<'main' | 'weather' | 'chat' | 'alerts'>('main');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await fetch('/backend/user-profile/init', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${keycloak.token}` },
        });
        const res = await fetch('/backend/user-profile', {
          headers: { 'Authorization': `Bearer ${keycloak.token}` },
        });
        if (res.ok) {
          const profile = await res.json();
          setUserProfile(profile);
        }
      } catch (err) {
        console.error('Error fetching profile in App:', err);
      }
    };

    if (keycloak?.authenticated && keycloak?.token) {
      fetchProfile();
    }
  }, [keycloak?.authenticated, keycloak?.token]);

  if (!initialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter', color: '#2e7d32' }}>
        <h2>Cargando EmerCLI...</h2>
      </div>
    );
  }

  if (!keycloak.authenticated) {
    return (
      <div className="app-container">
        <Header />
        <LandingPage />
      </div>
    );
  }

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

    return (
    <div className="app-main-layout">
      {/* @ts-ignore */}
      <HeaderComun 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        userProfile={userProfile}
        roles={roles}
      />
      <Home 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userProfile={userProfile}
        roles={roles}
      />
      </div>
   );
}

export default App;
