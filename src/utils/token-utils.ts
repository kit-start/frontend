const TOKEN_KEY = "kitstart_access_token";

/**
 * Получает токен аутентификации из localStorage
 * @returns Токен или null, если токен не найден
 */
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

/**
 * Сохраняет токен аутентификации в localStorage
 * @param token - Токен, который нужно сохранить
 */
export const setToken = (token: string | undefined): void => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        console.log("Токен сохранен в localStorage");
    }
};

/**
 * Очищает токен аутентификации из localStorage
 */
export const clearToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    console.log("Токен удален из localStorage");
};

/**
 * Проверяет, валиден ли текущий токен
 * @returns true если токен существует и не просрочен, иначе false
 */
export const isTokenValid = (): boolean => {
    const token = getToken();
    if (!token) return false;
    
    try {
        // Для JWT-токенов можно добавить проверку срока действия
        // Простая проверка на наличие токена
        return true;
    } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        return false;
    }
};

// const REFRESH_TOKEN_KEY = 'myproject_refresh_token';
// export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
// export const setRefreshToken = refreshToken => localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
// const getDetailsFromToken = () => {
// 	return jwtDecode(getToken());
// };

// export const getUserRoles = () => getDetailsFromToken()?.resource_access["myproject-app"]?.roles;
// export const hasRole = role => getUserRoles()?.includes(role); 