// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useCallback, useEffect, useState } from "react";

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const clearAuthData = useCallback(async () => {
//     try {
//       await AsyncStorage.removeItem("authToken");
//       await AsyncStorage.removeItem("user");
//       setUser(null);
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error("Error clearing auth data:", error);
//     }
//   }, []);

//   const checkAuthStatus = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const token = await AsyncStorage.getItem("authToken");
//       const userData = await AsyncStorage.getItem("user");

//       if (token && userData) {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       console.error("Error checking auth status:", error);
//       await clearAuthData();
//     } finally {
//       setIsLoading(false);
//     }
//   }, [clearAuthData]);
//   // Check if user is logged in on app start
//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   const login = async (credentials) => {
//     try {
//       setIsLoading(true);
//       const response = await authService.login(credentials);

//       if (response.success) {
//         const { user: userData, token } = response.data;

//         // Store auth data
//         await AsyncStorage.setItem("authToken", token);
//         await AsyncStorage.setItem("user", JSON.stringify(userData));

//         setUser(userData);
//         setIsAuthenticated(true);

//         return { success: true, user: userData };
//       } else {
//         return { success: false, error: response.message };
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       return {
//         success: false,
//         error: error.response?.data?.message || "Login failed",
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setIsLoading(true);
//       await authService.logout();
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       await clearAuthData();
//       setIsLoading(false);
//     }
//   };

//   const updateUser = async (userData) => {
//     try {
//       await AsyncStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
//     } catch (error) {
//       console.error("Error updating user data:", error);
//     }
//   };

//   return {
//     user,
//     isLoading,
//     isAuthenticated,
//     login,
//     logout,
//     updateUser,
//     checkAuthStatus,
//   };
//};
