// store/carsStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";
import { CreateCar, Vehicle, VehiclesResponse } from "../models/car.model";

interface CarsState {
  cars: Vehicle[];
  isLoading: boolean;
  setCars: (cars: Vehicle[]) => void;
  setLoading: (loading: boolean) => void;
  fetchCars: () => Promise<void>;
  createCar: (car: CreateCar) => Promise<void>;
  fetchCar: (carId: string) => Promise<Vehicle | undefined>;
  deleteCar: (carId: string) => Promise<void>;
}

export const useCarsStore = create<CarsState>()(
  persist(
    (set, get) => ({
      cars: [],
      isLoading: false,

      setCars: (cars) => set({ cars }),
      setLoading: (isLoading) => set({ isLoading }),

      fetchCars: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get<VehiclesResponse>("/vehicles");
          set({ cars: res.data.data });
        } catch (err) {
          console.error("fetchCars failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      createCar: async (car: CreateCar) => {
        set({ isLoading: true });
        try {
          await axiosInstance.post<{ vehicle: Vehicle }>("/vehicles", car);
          await get().fetchCars();
        } catch (err) {
          console.error("createCar failed:", err);
          throw err; // optional: so you can catch in UI
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCar: async (carId: string) => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.get<{ vehicle: Vehicle }>(
            `/vehicles/${carId}`
          );
          return data.vehicle;
        } catch (err) {
          console.error("fetchCar failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      deleteCar: async (carId: string) => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.delete<{ vehicle: Vehicle }>(
            `/vehicles/${carId}`
          );
          console.log("delete response :", data);
          await get().fetchCars();
        } catch (err) {
          console.error("fetchCar failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "cars-storage",
      storage: createJSONStorage(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        () => require("@react-native-async-storage/async-storage").default
      ),
    }
  )
);
