import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak/keycloak.ts'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* initOptions: 'check-sso' permite mostrar la landing antes de login.
        Solo redirige cuando el usuario pulsa el botón. */}
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: 'check-sso', checkLoginIframe: false }}
      onEvent={(event, error) => console.log('Keycloak event', event, error)}
      onTokens={(tokens) => console.log('Keycloak tokens', tokens)}
    >
      <App/>
    </ReactKeycloakProvider>
  </StrictMode>,
)

