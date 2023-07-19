import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthContextProvider } from "./context/Auth";
import { SettingsContextProvider } from "./context/Settings";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import Navbar from "./components/Navbar/Navbar";
import ErrorPage from "./pages/Error/ErrorPage";
import AuthPage from "./pages/Auth/AuthPage";
import { TabContextProvider } from "./context/Tab";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />
    },
    {
        path: "/login",
        element: <AuthPage />
    }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthContextProvider>
            <SettingsContextProvider>
                <TabContextProvider>
                    <Navbar />
                    <RouterProvider router={router} />
                </TabContextProvider>
            </SettingsContextProvider>
        </AuthContextProvider>
    </React.StrictMode>,
);
