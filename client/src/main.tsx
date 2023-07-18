import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthContextProvider } from "./context/Auth";
import { SettingsContextProvider } from "./context/Settings";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthContextProvider>
            <SettingsContextProvider>
                <App />
            </SettingsContextProvider>
        </AuthContextProvider>
    </React.StrictMode>,
);
