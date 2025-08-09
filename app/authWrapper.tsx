import { ROUTES } from "@/src/config/routes";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./components/authProvider";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  role?: "admin" | "chauffeur";
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  requireAuth = true,
  role,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (requireAuth && !isAuthenticated) {
    router.replace("/");
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    const redirectRoute =
      user?.role === "admin" ? ROUTES.ADMIN.DASHBOARD : ROUTES.CHAUFFEUR.HOME;
    router.replace(redirectRoute);
    return null;
  }

  if (role && user?.role !== role) {
    router.replace("/");
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
