// login.ts
import keycloak from './keycloak';

export const handleLogin = () => {
  keycloak
    .init({ onLoad: 'check-sso', checkLoginIframe: false })
    .then((authenticated) => {
      if (authenticated) {
        // Ya logueado por sesión previa
        window.location.replace(window.location.origin);
      } else {
        keycloak.login({
          redirectUri: window.location.origin,
          prompt: 'login',
        });
      }
    })
    .catch((err) => {
      console.error('Error al inicializar Keycloak:', err);
      keycloak.login({
        redirectUri: window.location.origin,
        prompt: 'login',
      });
    });
};

export const handleRegister = () => {
  keycloak
    .init({ onLoad: 'check-sso', checkLoginIframe: false })
    .then(() => {
      keycloak.register({ redirectUri: window.location.origin });
    })
    .catch((err) => {
      console.error('Error al inicializar Keycloak para registro:', err);
      keycloak.register({ redirectUri: window.location.origin });
    });
};

export const handleLogout = () => {
  keycloak.logout({ redirectUri: window.location.origin });
};