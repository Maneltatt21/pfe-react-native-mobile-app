// store/driversStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";
import { Driver, DriversResponse } from "../models/driver.model";

interface DriversState {
  drivers: Driver[];
  isLoading: boolean;
  setDrivers: (drivers: Driver[]) => void;
  setLoading: (loading: boolean) => void;
  fetchDrivers: () => Promise<void>;
  createDriver: () => Promise<void>;
  deleteDriver: (driverId: number) => Promise<void>;
  updateDriver: (driverId: number, data: Partial<Driver>) => Promise<void>;
  assigneDriver: (driverId: number, vehicleId: number) => Promise<void>;
}

export const useDriversStore = create<DriversState>()(
  persist(
    (set, get) => ({
      drivers: [],
      isLoading: false,

      setDrivers: (drivers) => set({ drivers }),
      setLoading: (loading) => set({ isLoading: loading }),
      fetchDrivers: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get<DriversResponse>("/users");
          const filteredDrivers = res.data.data.filter(
            (driver) => driver.role !== "admin"
          );
          set({ drivers: filteredDrivers });
        } catch (err) {
          console.error("fetchDrivers failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      createDriver: async () => {
        set({ isLoading: true });
        try {
          // await axiosInstance.delete(`/users/${driverId}`);
          await get().fetchDrivers();
        } catch (err) {
          console.error("deleteDriver failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      deleteDriver: async (driverId: number) => {
        set({ isLoading: true });
        try {
          await axiosInstance.delete(`/users/${driverId}`);
          await get().fetchDrivers();
        } catch (err) {
          console.error("deleteDriver failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      updateDriver: async (driverId: number, data: Partial<Driver>) => {
        set({ isLoading: true });
        try {
          await axiosInstance.put(`/users/${driverId}`, data);
          await get().fetchDrivers(); // Refresh the list after update
        } catch (err) {
          console.error("updateDriver failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      assigneDriver: async (driverId: number, vehicle_id: number) => {
        set({ isLoading: true });
        try {
          await axiosInstance.post(`/users/${driverId}/assign-vehicle`, {
            vehicle_id: vehicle_id,
          });
          await get().fetchDrivers();
        } catch (err) {
          console.error("assign Driver failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "drivers-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
