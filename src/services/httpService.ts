import keycloak from '../utils/keycloak';
import { setToken } from '../utils/token-utils';

export interface Middleware {
  onRequest?: (config: { request: Request }) => Promise<Request>;
  onResponse?: (config: { response: Response }) => Promise<Response>;
}

const myMiddleware: Middleware = {
  async onRequest({ request }) {
    if (keycloak.isTokenExpired()) {
      try {
        await keycloak.updateToken(70);
        setToken(keycloak.token!);
      } catch (error) {
        console.error('Ошибка обновления токена:', error);
        keycloak.login();
        return request;
      }
    }

    const token = keycloak.token;
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }

    return request;
  },
  async onResponse({ response }) {
    if (response.status === 401) {
      keycloak.login();
    }
    return response;
  }
};

export const httpService = {
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    let request = new Request(url, options);
    
    if (myMiddleware.onRequest) {
      request = await myMiddleware.onRequest({ request });
    }
    
    let response = await fetch(request);
    
    if (myMiddleware.onResponse) {
      response = await myMiddleware.onResponse({ response });
    }
    
    return response;
  }
}; 