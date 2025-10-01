// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios, { InternalAxiosRequestConfig } from "axios";
// import Constants from "expo-constants";

// const BASE_URL = `${Constants.expoConfig?.extra?.BASE_URL}`;

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 30000,
// });

// /* ------------------------------------------------------------------ */
// /*  Request interceptor                                                 */
// /* ------------------------------------------------------------------ */
// axiosInstance.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     /* 1. Token */
//     try {
//       const stored = await AsyncStorage.getItem("auth-storage");
//       console.log("auth-storage", stored);
//       if (stored) {
//         const { state } = JSON.parse(stored);
//         const token = state?.token;
//         if (token) {
//           config.headers = config.headers ?? {};
//           config.headers["Authorization"] = `Bearer ${token}`;
//         }
//       }
//     } catch (e) {
//       console.error("Auth token error:", e);
//     }

//     /* 2. Content-Type */
//     // If body is FormData → let browser set multipart header
//     if (config.data instanceof FormData) {
//       // Axios on React-Native sets the correct boundary automatically
//       delete config.headers["Content-Type"];
//     } else if (typeof config.data === "object") {
//       // Default to JSON for all other objects
//       config.headers["Content-Type"] = "application/json";
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ------------------------------------------------------------------ */
// /*  Response interceptor (unchanged)                                    */
// /* ------------------------------------------------------------------ */
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       await AsyncStorage.removeItem("authToken");
//       await AsyncStorage.removeItem("user");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
// api/axiosInstance.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";

const BASE_URL = `${Constants.expoConfig?.extra?.BASE_URL}`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Increased timeout for file uploads
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const stored = await AsyncStorage.getItem("auth-storage");
      if (stored) {
        const { state } = JSON.parse(stored);
        const token = state?.token;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error("Auth token error:", e);
    }

    // // Detailed request logging
    // console.log("🚀 AXIOS REQUEST:", {
    //   url: `${config.baseURL}${config.url}`,
    //   method: config.method?.toUpperCase(),
    //   headers: config.headers,
    //   dataType:
    //     config.data instanceof FormData ? "FormData" : typeof config.data,
    //   hasData: !!config.data,
    //   timeout: config.timeout,
    // });

    // Log FormData content in detail
    if (config.data instanceof FormData) {
      console.log("📁 FORM_DATA_CONTENTS:");
      const entries: any[] = [];
      config.data.forEach((value, key) => {
        entries.push({ key, value });
        console.log(`  ${key}:`, value);
      });
      console.log("📁 FORM_DATA_ENTRIES:", entries);
    }

    return config;
  },
  (error) => {
    // console.error("❌ REQUEST INTERCEPTOR ERROR:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ AXIOS RESPONSE SUCCESS:", {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    // console.error("❌ AXIOS RESPONSE ERROR:", {
    //   name: error.name,
    //   message: error.message,
    //   code: error.code,
    //   stack: error.stack,
    //   config: {
    //     url: error.config?.url,
    //     method: error.config?.method,
    //     baseURL: error.config?.baseURL,
    //     headers: error.config?.headers,
    //   },
    //   response: error.response
    //     ? {
    //         status: error.response.status,
    //         statusText: error.response.statusText,
    //         data: error.response.data,
    //         headers: error.response.headers,
    //       }
    //     : "NO_RESPONSE",
    //   request: error.request
    //     ? {
    //         status: error.request.status,
    //         responseURL: error.request.responseURL,
    //         readyState: error.request.readyState,
    //       }
    //     : "NO_REQUEST",
    // });

    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["auth-storage", "authToken", "user"]);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
