//api/auth/index.ts
import axiosInstance from "../axiosInstance";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "chauffeur";
  vehicle_id: any;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/login", { email, password });
  return response.data;
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
}): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/register", userData);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/logout");
};
