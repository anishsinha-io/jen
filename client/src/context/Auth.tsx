import axios from 'axios';
import React, { useEffect, useState } from 'react';

export interface User {
    id: string
    firstName: string
    lastName: string
    username: string,
    email: string,
    created_at: string,
    updated_at: string
}

export interface Auth {
    token: string,
    setToken: React.Dispatch<React.SetStateAction<string>>
    authenticated: boolean,
    loading: boolean
    user: User | null
}

export const AuthContext = React.createContext<Auth>({
    token: "",
    setToken: () => "",
    authenticated: false,
    loading: true,
    user: null
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState<string>("");
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loadingAuthenticationState, setLoadingAuthenticationState] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    const clearAuthData = () => {
        setAuthenticated(() => false);
        setToken(() => "");
        setLoadingAuthenticationState(() => false);
        setUser(() => null);
    };

    const refreshAuthStatus = async () => {
        const url = "http://localhost:8888/api";
        const http = axios.create({
            withCredentials: true,
            baseURL: url
        });
        try {
            const res = await http.post('/auth/token').catch();
            if (res.status !== 200) {
                clearAuthData();
                return;
            }
            const token = res.data.token;
            const user = res.data.user;

            setToken(() => token);
            setAuthenticated(() => true);
            setLoadingAuthenticationState(() => false);
            setUser(() => user);
        } catch {
            clearAuthData();
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refreshAuthStatus().catch(console.log);
        }, 100000);
        return () => clearInterval(interval);
    }, [authenticated]);

    useEffect(() => {
        refreshAuthStatus().catch(console.log);
    }, []);

    return <AuthContext.Provider
        value={{ token, setToken, authenticated, loading: loadingAuthenticationState, user }}>
        {props.children}
    </AuthContext.Provider>;
};