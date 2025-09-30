// store/profileStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   vehicle_id: number;
//   vehicle: Vehicle | null;
// }
interface ProfileState {
  user: UserProfile | null;
  isLoading: boolean;
  errors: string[];

  // actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: {
    name: string;
    email: string;
    // password?: string | undefined;
  }) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      errors: [],

      fetchProfile: async () => {
        set({ isLoading: true, errors: [] });
        try {
          const res = await axiosInstance.get("/user");
          set({ user: res.data.user });
        } catch (err: any) {
          set((state) => ({
            errors: [...state.errors, err.message || "Failed to fetch profile"],
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data: {
        name: string;
        email: string;
        // password?: string | undefined;
      }) => {
        if (!get().user) return;
        set({ isLoading: true, errors: [] });
        try {
          const res = await axiosInstance.put(`/users/${get().user!.id}`, data);
          set({ user: res.data.user });
        } catch (err: any) {
          set((state) => ({
            errors: [
              ...state.errors,
              err.message || "Failed to update profile",
            ],
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      clearProfile: () => set({ user: null, errors: [] }),
    }),

    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
