import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import { AuthProvider as OidcAuthProvider } from "oidc-react";
import type { User } from "oidc-client-ts";

import App from './App';
import { store } from './store/store';
import { NotificationProvider } from './contexts/NotificationContext';
import { DemoProvider } from './contexts/DemoContext';
import { AppAuthProvider } from './contexts/AuthContext';
import { setToken, clearToken } from "./utils/token-utils";
import { cleanAuthenticationParams } from "./utils/url-utils";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";

import './styles/global.scss';

// Расширенная конфигурация OIDC с настройками для PKCE
const oidcConfig = {
	authority: "https://keycloak.ismit.ru/realms/ISM",
	clientId: "kitstart-web-app",
	redirectUri: window.location.origin + window.location.pathname,
	clientSecret: "6W9gHBemf6O0VcLbRbTj3qsX7nrpSrVS",
	responseType: "code", // Используем authorization code flow
	scope: "openid profile email", // Запрашиваем необходимые scope
	autoSignIn: false, // Отключаем автоматический вход, теперь этим управляет наш AuthProvider
	automaticSilentRenew: true,
	loadUserInfo: true,
	
	// Включаем PKCE (Proof Key for Code Exchange)
	usePkce: true,
	
	// Обработчики событий
	onSignIn: (userData: User | null) => {
		console.log("Успешный вход в систему", userData?.profile);
		setToken(userData?.access_token);
		
		// Удаляем параметры аутентификации из URL для предотвращения циклов редиректа
		cleanAuthenticationParams(window.location.pathname);
	},
	onSignInError: (error: Error) => {
		console.error("Ошибка аутентификации:", error);
		clearToken();
	},
	onSignOut: () => {
		console.log("Выход из системы выполнен успешно");
		clearToken();
	}
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ConfigProvider
          locale={ruRU}
          theme={{
            token: {
              colorPrimary: '#1677ff',
              borderRadius: 4,
            },
          }}
        >
          <BrowserRouter>
            <DemoProvider>
              <OidcAuthProvider {...oidcConfig}>
                <NotificationProvider>
                  <AppAuthProvider>
                    <App />
                  </AppAuthProvider>
                </NotificationProvider>
              </OidcAuthProvider>
            </DemoProvider>
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
); 