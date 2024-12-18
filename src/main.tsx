import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "oidc-react";

import { store } from "./store/store";
import App from "./App";
import { setToken } from "./utils/token-utils";

import "./index.scss";

import type { User } from "oidc-client-ts";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";

const oidcConfig = {
	authority: "https://keycloak.ismit.ru/realms/ISM",
	clientId: "kitstart-web-app",
	redirectUri: `${window.location.origin}${window.location.pathname}`,
	clientSecret: "6W9gHBemf6O0VcLbRbTj3qsX7nrpSrVS",
	autoSignIn: true,
	automaticSilentRenew: true,
	onSignIn: (userData: User | null) => {
		setToken(userData?.access_token);
		window.location.reload();
	},
	onSignInError: (error: Error) => {
		// eslint-disable-next-line no-undef
		console.log(error);
	},
};
// eslint-disable-next-line no-undef
const container = document.getElementById("root");

if (container) {
	const root = createRoot(container);

	root.render(
		<StrictMode>
			<ErrorBoundary>
				<Provider store={store}>
					<BrowserRouter>
						<AuthProvider {...oidcConfig}>
							<App />
						</AuthProvider>
					</BrowserRouter>
				</Provider>
			</ErrorBoundary>
		</StrictMode>,
	);
} else {
	throw new Error(
		"Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
	);
}
