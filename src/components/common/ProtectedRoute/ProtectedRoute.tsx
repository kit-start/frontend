import { ReactNode } from 'react';
import { Spin } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import { useDemoMode } from '../../../contexts/DemoContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Компонент для защиты маршрутов, требующих аутентификации
 * Если пользователь не авторизован и не в демо-режиме, происходит перенаправление на страницу входа
 * В демо-режиме авторизация не требуется
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isAuthenticating, login } = useAuth();
  const { isDemoMode } = useDemoMode();

  // Если проверка аутентификации еще выполняется, показываем спиннер загрузки
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Проверка авторизации..." />
      </div>
    );
  }

  // В демо-режиме пропускаем проверку авторизации
  if (isDemoMode) {
    return <>{children}</>;
  }

  // Если пользователь не аутентифицирован и не находится в процессе аутентификации,
  // пытаемся выполнить вход
  if (!isAuthenticated && !isAuthenticating) {
    // Запускаем вход в систему
    login();
    
    // Пока редирект происходит, показываем спиннер загрузки
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Перенаправление на страницу входа..." />
      </div>
    );
  }

  // Если пользователь аутентифицирован или находится в процессе аутентификации, 
  // показываем защищенное содержимое
  return <>{children}</>;
};

export default ProtectedRoute; 