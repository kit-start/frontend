import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://keycloak.ismit.ru',
  realm: 'ISM',
  clientId: 'kitstart-web-app-dev'
});

export default keycloak; 