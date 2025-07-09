import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Base URL for your Laravel API
const ip = "10.0.2.2";
const BASE_URL = `http://${ip}:8000/api/v1`;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      // Navigate to login screen
      // You can use navigation service here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
