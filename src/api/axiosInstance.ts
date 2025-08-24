// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Constants from "expo-constants";

// // Base URL for your Laravel API

// const BASE_URL = `http://${Constants.expoConfig?.extra?.APP_IP_EMULATOR_DEVICE}:8000/api/v1`;

// // Create axios instance
// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request interceptor to add auth token
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     try {
//       const stored = await AsyncStorage.getItem("auth-storage");
//       if (stored) {
//         const { state } = JSON.parse(stored);
//         const token = state?.token;
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//       }
//     } catch (error) {
//       console.error("Error getting auth token:", error);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle errors
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       await AsyncStorage.removeItem("authToken");
//       await AsyncStorage.removeItem("user");
//       // Navigate to login screen
//       // You can use navigation service here
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
// axiosInstance.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";

const BASE_URL = `http://${Constants.expoConfig?.extra?.APP_IP_EMULATOR_DEVICE}:8000/api/v1`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    // NEVER set a default Content-Type here – we’ll decide per request
  },
});

/* ------------------------------------------------------------------ */
/*  Request interceptor                                                 */
/* ------------------------------------------------------------------ */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    /* 1. Token */
    try {
      const stored = await AsyncStorage.getItem("auth-storage");
      console.log("auth-storage", stored);
      if (stored) {
        const { state } = JSON.parse(stored);
        const token = state?.token;
        if (token) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error("Auth token error:", e);
    }

    /* 2. Content-Type */
    // If body is FormData → let browser set multipart header
    if (config.data instanceof FormData) {
      // Axios on React-Native sets the correct boundary automatically
      delete config.headers["Content-Type"];
    } else if (typeof config.data === "object") {
      // Default to JSON for all other objects
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------------------------------------------ */
/*  Response interceptor (unchanged)                                    */
/* ------------------------------------------------------------------ */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      // e.g. RootNavigation.navigate("Login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
