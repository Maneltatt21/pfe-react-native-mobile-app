import { login, register } from "@/src/api/auth";
import useAuthStore from "@/src/store/authStore";
import { User } from "@/src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const storedData = await AsyncStorage.getItem("auth-storage");
        if (storedData) {
          const { state } = JSON.parse(storedData);
          if (state.token && state.user) {
            setAuth(state.user, state.token);
          }
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
        logout();
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    restoreSession();
  }, [logout, setAuth]);

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { user, token } = await login(email, password);
      setAuth(user, token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: string
  ): Promise<boolean> => {
    try {
      console.log("name : ", name);
      console.log("email : ", email);
      console.log("password : ", password);
      const { user, token } = await register({
        name,
        email,
        password,
        password_confirmation,
        role,
      });
      setAuth(user, token);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuth(null, null);
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
