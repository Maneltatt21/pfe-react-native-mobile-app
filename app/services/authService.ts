export const authService = {
  // Login user
  //   login: async (credentials) => {
  //     try {
  //       const response = await axiosInstance.post(
  //         API_ENDPOINTS.AUTH.LOGIN,
  //         credentials
  //       );
  //       console.log(response);
  //       if (response.status === 200) {
  //         return {
  //           success: true,
  //           data: {
  //             user: response.user,
  //             token: response.token,
  //           },
  //           message: response.message,
  //         };
  //       } else {
  //         return {
  //           success: false,
  //           message: response.data.message || "Login failed",
  //         };
  //       }
  //     } catch (error) {
  //       console.error("Auth Service - Login Error:", error);
  //       if (error.response) {
  //         // Server responded with error status
  //         return {
  //           success: false,
  //           message: error.response.data?.message || "Invalid credentials",
  //         };
  //       } else if (error.request) {
  //         // Network error
  //         return {
  //           success: false,
  //           message: "Network error. Please check your connection.",
  //         };
  //       } else {
  //         // Other error
  //         return {
  //           success: false,
  //           message: "An unexpected error occurred.",
  //         };
  //       }
  //     }
  //   },
  //   // Logout user
  //   logout: async () => {
  //     try {
  //       await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  //       return { success: true };
  //     } catch (error) {
  //       console.error("Auth Service - Logout Error:", error);
  //       // Even if logout fails on server, we should clear local data
  //       return { success: true };
  //     }
  //   },
  //   // Get user profile
  //   getProfile: async () => {
  //     try {
  //       const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
  //       if (response.data.success) {
  //         return {
  //           success: true,
  //           data: response.data.user,
  //         };
  //       } else {
  //         return {
  //           success: false,
  //           message: response.data.message || "Failed to get profile",
  //         };
  //       }
  //     } catch (error) {
  //       console.error("Auth Service - Get Profile Error:", error);
  //       if (error.response?.status === 401) {
  //         return {
  //           success: false,
  //           message: "Unauthorized",
  //           unauthorized: true,
  //         };
  //       }
  //       return {
  //         success: false,
  //         message: error.response?.data?.message || "Failed to get profile",
  //       };
  //     }
  //   },
  //   // Update user profile
  //   updateProfile: async (profileData) => {
  //     try {
  //       const response = await axiosInstance.put(
  //         API_ENDPOINTS.AUTH.PROFILE,
  //         profileData
  //       );
  //       if (response.data.success) {
  //         return {
  //           success: true,
  //           data: response.data.user,
  //           message: response.data.message,
  //         };
  //       } else {
  //         return {
  //           success: false,
  //           message: response.data.message || "Failed to update profile",
  //         };
  //       }
  //     } catch (error) {
  //       console.error("Auth Service - Update Profile Error:", error);
  //       return {
  //         success: false,
  //         message: error.response?.data?.message || "Failed to update profile",
  //         errors: error.response?.data?.errors,
  //       };
  //     }
  //   },
  //   // Change password
  //   changePassword: async (passwordData) => {
  //     try {
  //       const response = await axiosInstance.put(
  //         "/auth/change-password",
  //         passwordData
  //       );
  //       if (response.data.success) {
  //         return {
  //           success: true,
  //           message: response.data.message,
  //         };
  //       } else {
  //         return {
  //           success: false,
  //           message: response.data.message || "Failed to change password",
  //         };
  //       }
  //     } catch (error) {
  //       console.error("Auth Service - Change Password Error:", error);
  //       return {
  //         success: false,
  //         message: error.response?.data?.message || "Failed to change password",
  //         errors: error.response?.data?.errors,
  //       };
  //     }
  //   },
  //   // Refresh token (if needed)
  //   refreshToken: async () => {
  //     try {
  //       const response = await axiosInstance.post("/auth/refresh");
  //       if (response.data.success) {
  //         return {
  //           success: true,
  //           data: {
  //             token: response.data.token,
  //           },
  //         };
  //       } else {
  //         return {
  //           success: false,
  //           message: response.data.message || "Failed to refresh token",
  //         };
  //       }
  //     } catch (error) {
  //       console.error("Auth Service - Refresh Token Error:", error);
  //       return {
  //         success: false,
  //         message: error.response?.data?.message || "Failed to refresh token",
  //       };
  //     }
  //   },
};
