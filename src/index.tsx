import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import ErrorBoundary from "antd/es/alert/ErrorBoundary";

import App from './App';
import { store } from './store/store';
import { NotificationProvider } from './contexts/NotificationContext';
import { DemoProvider } from './contexts/DemoContext';
import { AuthProvider } from './contexts/AuthContext';

import './styles/global.scss';

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
							<NotificationProvider>
								<AuthProvider>
									<App />
								</AuthProvider>
							</NotificationProvider>
						</DemoProvider>
					</BrowserRouter>
				</ConfigProvider>
			</Provider>
		</ErrorBoundary>
	</React.StrictMode>
); 