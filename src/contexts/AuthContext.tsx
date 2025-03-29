import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { useAuth as useOidcAuth } from 'oidc-react';
import { useDemoMode } from './DemoContext';
import { useNotificationContext } from './NotificationContext';
import useAuthManager from '../hooks/useAuthManager';

// Определение типа для контекста авторизации
interface AuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isLoading: boolean;
  userData: any; // Типизацию можно уточнить позже
  signIn: () => void;
  signOut: () => void;
  cleanAuthParams: () => void;
}

// Создание контекста с undefined по умолчанию (строгий подход)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Безопасный хук для использования контекста авторизации в компонентах
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
export const AppAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const oidcAuth = useOidcAuth();
  const { isDemoMode } = useDemoMode();
  const notifications = useNotificationContext();
  
  // Используем хук авторизации, передавая ему экземпляр auth из oidc-react
  const authManager = useAuthManager(oidcAuth);

  // Очищаем URL от параметров аутентификации при успешной авторизации
  useEffect(() => {
    if (authManager.isAuthenticating && authManager.userData) {
      console.log('Обнаружен параметр code и userData, очищаем URL');
      authManager.cleanAuthParams();
      
      // Показываем уведомление об успешном входе
      const username = authManager.userData.profile.preferred_username || 'пользователь';
      notifications.showSuccess(`Добро пожаловать, ${username}!`);
    }
  }, [authManager.isAuthenticating, authManager.userData, authManager.cleanAuthParams, notifications]);

  // При запуске проверяем наличие параметра code в URL
  useEffect(() => {
    if (authManager.isAuthenticating) {
      console.log('Обнаружен параметр code в URL при запуске');
    }
  }, [authManager.isAuthenticating]);

  // Оборачиваем метод выхода, чтобы показать уведомление
  const handleSignOut = useCallback(() => {
    notifications.showInfo('Вы вышли из системы');
    authManager.signOut();
  }, [notifications, authManager]);

  // В демо-режиме считаем пользователя авторизованным всегда
  const authMethods = useMemo(() => ({
    isAuthenticated: isDemoMode || authManager.isAuthenticated,
    isAuthenticating: authManager.isAuthenticating,
    isLoading: authManager.isLoading,
    userData: authManager.userData,
    signIn: authManager.signIn,
    signOut: handleSignOut,
    cleanAuthParams: authManager.cleanAuthParams,
  }), [
    isDemoMode, 
    authManager.isAuthenticated, 
    authManager.isAuthenticating, 
    authManager.isLoading, 
    authManager.userData, 
    authManager.signIn, 
    handleSignOut, 
    authManager.cleanAuthParams
  ]);

  return (
    <AuthContext.Provider value={authMethods}>
      {children}
    </AuthContext.Provider>
  );
};

export default AppAuthProvider; 