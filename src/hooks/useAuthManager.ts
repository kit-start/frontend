import { AuthContextProps } from 'oidc-react';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { setToken, clearToken } from '../utils/token-utils';
import { 
  isAuthenticationCallback, 
  cleanAuthenticationParams,
  getAuthenticationParams,
  getLogoutRedirectUrl 
} from '../utils/url-utils';

/**
 * Хук для управления авторизацией в приложении
 * Централизует всю логику, связанную с авторизацией
 */
export const useAuthManager = (auth: AuthContextProps) => {
  const location = useLocation();

  // Проверка, содержит ли URL параметр code (что указывает на процесс аутентификации)
  const isAuthenticating = useMemo(() => {
    const hasCode = isAuthenticationCallback(location.search);
    console.log('isAuthenticating check:', { hasCode, search: location.search });
    return hasCode;
  }, [location.search]);

  // Получаем параметры для аутентификации из утилиты
  const authParams = useMemo(() => getAuthenticationParams(), []);

  // Выполнить вход с PKCE
  const signIn = useCallback(() => {
    console.log('Запрос на аутентификацию с параметрами:', authParams);
    auth.signIn(authParams);
  }, [auth, authParams]);

  // Выполнить выход
  const signOut = useCallback(() => {
    console.log('Выполняется выход из системы');
    clearToken();
    
    try {
      auth.signOutRedirect({
        post_logout_redirect_uri: getLogoutRedirectUrl(),
      });
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
      window.location.href = getLogoutRedirectUrl();
    }
  }, [auth]);

  // Очистить URL от параметров аутентификации
  const doCleanAuthParams = useCallback(() => {
    cleanAuthenticationParams(location.pathname);
  }, [location.pathname]);

  // Проверка авторизации пользователя с учетом процесса аутентификации
  const isAuthenticated = useMemo(() => {
    // Если идет процесс аутентификации или у нас есть информация о пользователе - считаем авторизованным
    const result = isAuthenticating || !!auth.userData;
    console.log('isAuthenticated check:', { 
      result, 
      isAuthenticating, 
      hasUserData: !!auth.userData,
      userInfo: auth.userData?.profile
    });
    return result;
  }, [isAuthenticating, auth.userData]);

  return {
    // Базовое состояние
    isAuthenticated,
    isAuthenticating,
    isLoading: auth.isLoading,
    userData: auth.userData,
    
    // Методы
    signIn,
    signOut,
    cleanAuthParams: doCleanAuthParams,
  };
};

export default useAuthManager; 