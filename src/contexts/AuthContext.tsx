import React, { createContext, useContext, useEffect, useCallback, useMemo, useState } from 'react';
import { useDemoMode } from './DemoContext';
import { useNotificationContext } from './NotificationContext';
import { KeycloakInstance } from 'keycloak-js';
import Keycloak from 'keycloak-js';

interface UserData {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

// Определение типа для контекста авторизации
interface AuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isLoading: boolean;
  userData: UserData | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  keycloak: KeycloakInstance | null;
}

// Создание контекста с undefined по умолчанию
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Безопасный хук для использования контекста авторизации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('AppAuthProvider context is undefined, please verify you are calling useAuth() as child of a <AppAuthProvider> component.');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Провайдер контекста авторизации
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        setIsAuthenticating(true);
        const keycloakInstance = new Keycloak({
          url: process.env.REACT_APP_KEYCLOAK_URL || '',
          realm: process.env.REACT_APP_KEYCLOAK_REALM || '',
          clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ''
        });

        const authenticated = await keycloakInstance.init({
          onLoad: 'check-sso',
          checkLoginIframe: false
        });

        setKeycloak(keycloakInstance);
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const userInfo = await keycloakInstance.loadUserInfo();
          setUserData(userInfo as UserData);
        }
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    initKeycloak();
  }, []);

  const login = useCallback(async () => {
    if (keycloak) {
      try {
        await keycloak.login();
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  }, [keycloak]);

  const logout = useCallback(async () => {
    if (keycloak) {
      try {
        await keycloak.logout();
        setIsAuthenticated(false);
        setUserData(null);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }, [keycloak]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        userData,
        login,
        logout,
        isLoading: isAuthenticating,
        keycloak: null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 