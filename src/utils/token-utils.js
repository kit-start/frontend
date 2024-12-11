const TOKEN_KEY = "myproject_access_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.setItem(TOKEN_KEY, "");


// const REFRESH_TOKEN_KEY = 'myproject_refresh_token';
// export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
// export const setRefreshToken = refreshToken => localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
// const getDetailsFromToken = () => {
// 	return jwtDecode(getToken());
// };

// export const getUserRoles = () => getDetailsFromToken()?.resource_access["myproject-app"]?.roles;
// export const hasRole = role => getUserRoles()?.includes(role);
