import React, { useEffect, useState } from "react";

import { http } from "@services/http";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Auth {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  authenticated: boolean;
  loading: boolean;
  user: User | null;
  logout: any;
  login: any;
}

export const AuthContext = React.createContext<Auth>({
  token: "",
  setToken: () => "",
  authenticated: false,
  loading: true,
  user: null,
  logout: null,
  login: null,
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loadingAuthenticationState, setLoadingAuthenticationState] =
    useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const clearAuthData = () => {
    setAuthenticated(() => false);
    setToken(() => "");
    setLoadingAuthenticationState(() => false);
    setUser(() => null);
  };

  const login = async (email: string, password: string) => {
    const res = await http.post("/auth/login", { email, password });
    if (res.status === 200) {
      const data: { access_token: string; refresh_token: string } = res.data;
      setToken(() => data.access_token);
      setAuthenticated(() => true);
    }

    return res;
  };

  const refreshAuthStatus = async () => {
    try {
      const res = await http.post("/auth/token").catch();
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

  const logout = async () => {
    await http.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    clearAuthData();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAuthStatus().catch(console.log);
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    refreshAuthStatus().catch(console.error);
  }, [authenticated]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        authenticated,
        loading: loadingAuthenticationState,
        user,
        logout,
        login,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
