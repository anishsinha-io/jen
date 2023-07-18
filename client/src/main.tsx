import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthContextProvider } from "./context/Auth";
import { SettingsContextProvider } from "./context/Settings";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import Navbar from "./components/Navbar/Navbar";
import ErrorPage from "./pages/Error/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthContextProvider>
            <SettingsContextProvider>
                <Navbar />
                <RouterProvider router={router} />
            </SettingsContextProvider>
        </AuthContextProvider>
    </React.StrictMode>,
);
