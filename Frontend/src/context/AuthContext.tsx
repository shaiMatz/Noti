import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { accessToken: string | null; authenticated: boolean | null };
  onRegister?: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const REFRESH_KEY = "REFRESH_KEY";
const ACCESS_KEY = "ACCESS_KEY";
export const API_URL = "http://192.168.136.1:3000";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    accessToken: string | null;
    authenticated: boolean | null;
  }>({
    accessToken: null,
    authenticated: null,
  });
  // Setup Axios Interceptors
  useEffect(() => {
    console.log("Setting up Axios Interceptors");
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("Axios Interceptor Error:", error);
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const accessToken = await refreshToken();
            if (accessToken) {
              console.log("Retrying original request with new token, accessToken: ", accessToken);
              originalRequest.headers['authorization'] = `JWT ${accessToken}`; // Set the header for the retried request
              const refreshkey = await SecureStore.getItemAsync(REFRESH_KEY);
              originalRequest.data = {refreshToken: refreshkey };
              return axios(originalRequest); // Retry the original request with the new token
            } else {
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error("Unable to refresh token:", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
  useEffect(() => {
    const loadToken = async () => {
      const accessToken = await SecureStore.getItemAsync(ACCESS_KEY);

      if (accessToken) {
        setAuthState({
          accessToken,
          authenticated: true,
        });
        axios.defaults.headers.common["authorization"] = `JWT ${accessToken}`;
      } else
        setAuthState({
          accessToken: null,
          authenticated: false,
        });
    };
    loadToken();
  }, []);

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return { error: true, msg: (error as any).response.data.msg };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log(data);

      setAuthState({
        accessToken: data.accessToken,
        authenticated: true,
      });
      await SecureStore.setItemAsync(REFRESH_KEY, data.refreshToken);
      await SecureStore.setItemAsync(ACCESS_KEY, data.accessToken);

      axios.defaults.headers.common[
        "authorization"
      ] = `JWT ${data.accessToken}`;

      return data;
    } catch (error) {
      console.log(error);
      return { error: true, msg: (error as any).response.data.msg };
    }
  };

  const logout = async () => {
    try {
      const refreshkey = await SecureStore.getItemAsync(REFRESH_KEY);
      console.log("Logging out: " + authState.accessToken);
      console.log("Logging out: " + refreshkey);
      const { data } = await axios.post(`${API_URL}/auth/logout`, {
        refreshToken: refreshkey,
      });
      console.log(data);
      if (data.error) {
        return { error: true, msg: data.msg };
      } else {
        console.log("Logged out: " + authState.accessToken);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        await SecureStore.deleteItemAsync(ACCESS_KEY);

        setAuthState({
          accessToken: null,
          authenticated: false,
        });

        delete axios.defaults.headers.common["authorization"];
      }
    } catch (error) {
      console.log(error);
      return { error: true, msg: (error as any).response.data.msg };
    }
  };

  const refreshToken = async () => {
    try {
      console.log("Refreshing token");
      const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
      axios.defaults.headers.common["authorization"] = `JWT ${refresh}`;
      console.log("Refresh token:", refresh);
      console.log("access token:", authState.accessToken)
      if (!refresh) {
        console.log("No refresh token found");
        return null;
      }
      const response = await axios.post(`${API_URL}/auth/refreshToken`, {
        refresh,
      });
      console.log("Refresh token response:", response.data);
      const { accessToken, refreshToken } = response.data;

      await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
      axios.defaults.headers.common["authorization"] = `JWT ${accessToken}`;
      setAuthState({
        accessToken,
        authenticated: true,
      });
      return accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };
  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
