// store/driverCarStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";

export interface Document {
  id: number;
  type: string; // e.g., "license", "insurance"
  url: string;
  expiryDate: string;
}

export interface Maintenance {
  id: number;
  type: string; // e.g., "oil change", "inspection"
  date: string;
  notes?: string;
}

export interface Vehicle {
  id: number;
  registration_number: string;
  model: string;
  year: number;
  status: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  vehicle_id: number;
  vehicle: Vehicle | null;
}

interface DriverState {
  driver: User | null;
  documents: Document[];
  maintenance: Maintenance[];
  isLoading: boolean;
  errors: string[];

  // actions
  fetchDriverProfile: () => Promise<void>;
}

export const useDriverStore = create<DriverState>()(
  persist(
    (set, get) => ({
      driver: null,
      documents: [],
      maintenance: [],
      isLoading: false,
      errors: [],

      fetchDriverProfile: async () => {
        set({ isLoading: true, errors: [] });
        try {
          const res = await axiosInstance.get(`/user`);
          const vehicleRes = await axiosInstance.get(`/my-vehicle`);

          const vehicleData = vehicleRes.data?.vehicle;

          console.log("vehicle:", JSON.stringify(vehicleData, null, 2));

          set({
            driver: res.data.user,
            documents:
              vehicleData?.documents?.map((doc: any) => ({
                id: doc.id,
                type: doc.type,
                url: doc.file_path,
                expiryDate: doc.expiration_date,
              })) ?? [],
            maintenance:
              vehicleData?.maintenances?.map((m: any) => ({
                id: m.id,
                type: m.type,
                date: m.date,
                notes: m.notes,
              })) ?? [],
          });

          console.log("store driver:", get().driver);
        } catch (err: any) {
          set((state) => ({
            errors: [
              ...state.errors,
              err.message || "Failed to fetch driver profile",
            ],
          }));
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "driver-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
