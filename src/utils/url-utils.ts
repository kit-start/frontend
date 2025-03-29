/**
 * Утилиты для работы с URL и параметрами авторизации
 */

/**
 * Проверяет, содержит ли текущий URL параметр code, что указывает на процесс аутентификации
 * @param search - строка поиска URL, например window.location.search
 * @returns true если URL содержит параметр code
 */
export const isAuthenticationCallback = (search: string): boolean => {
  const params = new URLSearchParams(search);
  const hasCode = params.has('code');
  return hasCode;
};

/**
 * Очищает URL от параметров аутентификации OIDC
 * Рекомендуется вызывать после успешной авторизации для предотвращения циклов редиректа
 * @param pathname - текущий путь страницы
 */
export const cleanAuthenticationParams = (pathname: string): void => {
  if (window.history && window.location.search && window.location.search.includes('code=')) {
    console.log('Очистка URL от параметров аутентификации');
    window.history.replaceState({}, document.title, pathname);
  }
};

/**
 * Возвращает базовые параметры для аутентификации OIDC
 * @returns объект с параметрами для авторизации
 */
export const getAuthenticationParams = () => ({
  redirect_uri: window.location.origin + window.location.pathname,
  extraQueryParams: {
    client_id: 'kitstart-web-app',
    response_type: 'code',
    scope: 'openid profile email',
    response_mode: 'query'
  }
});

/**
 * Формирует URL для редиректа после выхода из системы
 * @returns URL куда должен быть перенаправлен пользователь после выхода
 */
export const getLogoutRedirectUrl = (): string => {
  return `${window.location.origin}/home`;
}; 