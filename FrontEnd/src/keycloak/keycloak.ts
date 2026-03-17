import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
  url: 'http://localhost:8080', // Sustituye por la URL real de tu Keycloak
  realm: 'realm-hackaton-next',            // Sustituye por el nombre de tu Realm
  clientId: 'react-app'// El Client ID de Keycloak configurado como "Public"
});
export default keycloak;