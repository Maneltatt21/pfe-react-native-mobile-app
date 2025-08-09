// store/driversStore.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";
import { Driver, DriversResponse } from "../models/driver.model";

interface DriversState {
  drivers: Driver[];
  isLoading: boolean;
  fetchDrivers: () => Promise<void>;
  setDrivers: (drivers: Driver[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useDriversStore = create<DriversState>()(
  persist(
    (set) => ({
      drivers: [],
      isLoading: false,

      setDrivers: (drivers) => set({ drivers }),
      setLoading: (loading) => set({ isLoading: loading }),

      fetchDrivers: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get<DriversResponse>("/users");
          // Filter out admins here:
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
    }),
    {
      name: "drivers-storage",
      storage: createJSONStorage(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        () => require("@react-native-async-storage/async-storage").default
      ),
    }
  )
);
