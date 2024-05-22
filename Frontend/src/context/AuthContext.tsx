import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { APIURL } from "../api/client";
import apiClient from "../api/client";
import axios from "axios";
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

interface AuthProps {
  authState?: { accessToken: string | null; authenticated: boolean | null };
  onRegister?: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profileImage: string,
    carType?: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  onGoogleLogin?: () => Promise<any>;
}

const REFRESH_KEY = "REFRESH_KEY";
const ACCESS_KEY = "ACCESS_KEY";
const API_URL = APIURL;
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
    isGoogleSignin: boolean | null;
  }>({
    accessToken: null,
    authenticated: null,
    isGoogleSignin: null,
  });
  // Setup Axios Interceptors
  useEffect(() => {
    console.log("Setting up Axios Interceptors");
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("start Axios Interceptor Error:", error);
        const originalRequest = error.config;
        if (
          (error.response?.status === 403 && !originalRequest._retry) ||
          (error.response?.status === 401 && !originalRequest._retry)
        ) {
          originalRequest._retry = true;
          try {
            const accessToken = await refreshToken();
            if (accessToken == null) {
              console.log("Failed to refresh token. deleting tokens");
              await SecureStore.deleteItemAsync(REFRESH_KEY);
              await SecureStore.deleteItemAsync(ACCESS_KEY);
              return Promise.reject(error);
            }
            console.log(
              "Retrying original request with new token, accessToken: ",
              accessToken
            );

            originalRequest.headers["authorization"] = `JWT ${accessToken}`; // Set the header for the retried request
            /*const refreshkey = await SecureStore.getItemAsync(REFRESH_KEY);
              originalRequest.data = { refreshToken: refreshkey };*/
            return apiClient(originalRequest); // Retry the original request with the new token
          } catch (refreshError) {
            console.error("Unable to refresh token:", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, []);

  const configGoogleSignIn = () => {
GoogleSignin.configure({forceCodeForRefreshToken: true, webClientId:"905433083586-nm0fito9p8on4ceho6ocdtsbedpho00h.apps.googleusercontent.com", offlineAccess: true,});
};

useEffect(() => {
    configGoogleSignIn(); // will execute everytime the component mounts
}, []);


  useEffect(() => {
    const loadToken = async () => {
       const accessToken = await SecureStore.getItemAsync(ACCESS_KEY);

      if (accessToken!=null) {

        setAuthState({
          accessToken,
          authenticated: true,
          isGoogleSignin: false,
        });
        apiClient.defaults.headers.common[
          "authorization"
        ] = `JWT ${accessToken}`;
      } else {
        console.log("No token found. Logging out.");
        setAuthState({
          accessToken: null,
          authenticated: false,
          isGoogleSignin: null,
        });
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        await SecureStore.deleteItemAsync(ACCESS_KEY);
      }
      /*  await SecureStore.deleteItemAsync(REFRESH_KEY);
        await SecureStore.deleteItemAsync(ACCESS_KEY);*/
    };
    loadToken();
  }, []);

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profilePicture: string = "../../assets/default_avatar.png",
    carType: string = "Unknown"
  ) => {
    try {
      console.log("Registering, profile image:", profilePicture);
      const { data } = await apiClient.post(`${API_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        profilePicture,
        carType,
      });

      console.log(data);
      if (data.error) {
        return { error: true, message: data.message };
      }
      return data;
    } catch (error) {
      console.log(error);
      return { error: true, message: (error as any).response.data.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Logging in");
      const { data } = await apiClient.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log(data);
      if (data.error) {
        if (data.message === "User not found") {
          return { error: true, message: "User not found. Register first!" };
        }
        if (data.message === "Invalid credentials") {
          return { error: true, message: "invalid password" };
        }
        return { error: true, message: data.message };
      }
      setAuthState({
        accessToken: data.accessToken,
        authenticated: true,
        isGoogleSignin: false,
      });
      if (data.refreshToken && data.accessToken) {
        await SecureStore.setItemAsync(REFRESH_KEY, data.refreshToken);
        await SecureStore.setItemAsync(ACCESS_KEY, data.accessToken);
      } else console.log("No refresh token found");

      apiClient.defaults.headers.common[
        "authorization"
      ] = `JWT ${data.accessToken}`;
      console.log("Logged in: " + authState.accessToken);
      return data;
    } catch (error) {
      console.log(error);
      return { error: true, message: (error as any).response.data.message };
    }
  };

  const logout = async () => {
    try {
      if(authState.isGoogleSignin){
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      const refreshkey = await SecureStore.getItemAsync(REFRESH_KEY);
      console.log("Logging out: " + authState.accessToken);
      console.log("Logging out: " + refreshkey);
      const { data } = await apiClient.post(`${API_URL}/auth/logout`, {
        refreshToken: refreshkey,
      });
      console.log(data);
      if (data.error) {
        return { error: true, message: data.message };
      } else {
        console.log("Logged out: " + authState.accessToken);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        await SecureStore.deleteItemAsync(ACCESS_KEY);

        setAuthState({
          accessToken: null,
          authenticated: false,
          isGoogleSignin: null,
        });

        delete apiClient.defaults.headers.common["authorization"];
      }
    } catch (error) {
      console.log(error);
      return { error: true, message: (error as any).response.data.message };
    }
  };

  const refreshToken = async () => {
    console.log("Refreshing token");
    const refreshKey = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!refreshKey) {
      console.log("No refresh token found");
      return null; // You might want to handle this more gracefully
    }

    try {
      let accessT = authState.accessToken;
      if (accessT == null) {
        accessT = await SecureStore.getItemAsync(ACCESS_KEY);
        if (accessT == null) {
          console.log("No access token found");
          return null;
        }
      }
      apiClient.defaults.headers.common["authorization"] = `JWT ${refreshKey}`;
      console.log("Refresh token:", refreshKey);
      console.log("access token:", accessT);

      const response = await apiClient.post(`${API_URL}/auth/refreshToken`, {
        refreshKey,
      });
      console.log("Refresh token response:", response.data);
      const { accessToken, refreshToken } = response.data;
      if (!accessToken || !refreshToken) {
    
        console.error("Failed to refresh token:", response.data);
        return null;
      }
      await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
      apiClient.defaults.headers.common["authorization"] = `JWT ${accessToken}`;
      const google=authState.isGoogleSignin;
      setAuthState({
        accessToken,
        authenticated: true,
        isGoogleSignin: google,
      });
      return accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  const onGoogleLogin = async () => {
try {
  console.log("Google login");
    await GoogleSignin.hasPlayServices();
    const result = await GoogleSignin.signIn();
    console.log("Result:", result);
    const { idToken,user } = result;
    console.log("IdToken:", idToken);
    const response = await axios.post(`${API_URL}/auth/googleLogin`, {
      idToken,user
    });
    if(response){
      console.log("Response:", response.data);
    }else{
      console.log("No response");
    }
    if (response.data.error) {
      console.log("Error:", response.data.message);
      return { error: true, message: response.data.message };
    }
    setAuthState({
      accessToken: response.data.accessToken,
      authenticated: true,
      isGoogleSignin: true,
    });
    if (response.data.refreshToken && response.data.accessToken) {
      await SecureStore.setItemAsync(REFRESH_KEY, response.data.refreshToken);
      await SecureStore.setItemAsync(ACCESS_KEY, response.data.accessToken);
    } else console.log("No refresh token found");


    return result;
  } catch (error:any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      alert('User cancelled the login flow!');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      alert('Signin in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      alert('Google Play services not available or outdated!');
    } else {
      console.error(error);
    }
  }
  }

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onGoogleLogin,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
