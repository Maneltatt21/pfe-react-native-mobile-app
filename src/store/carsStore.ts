// store/carsStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";
import { CreateCar, Vehicle, VehiclesResponse } from "../models/car.model";

interface CarsState {
  cars: Vehicle[];
  nbCars: number;
  nbCarsAssigne: number;
  nbCarsDisponible: number;
  isLoading: boolean;
  setCars: (cars: Vehicle[]) => void;
  setLoading: (loading: boolean) => void;
  fetchCars: () => Promise<void>;
  createCar: (car: CreateCar) => Promise<void>;
  fetchCar: (carId: string) => Promise<Vehicle | undefined>;
  deleteCar: (carId: string) => Promise<void>;
  editCar: (carId: string, car: CreateCar) => Promise<void>;
}

export const useCarsStore = create<CarsState>()(
  persist(
    (set, get) => ({
      cars: [],
      nbCars: 0,
      nbCarsAssigne: 0,
      nbCarsDisponible: 0,
      isLoading: false,
      setCars: (cars) => set({ cars }),
      setLoading: (isLoading) => set({ isLoading }),
      fetchCars: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get<VehiclesResponse>("/vehicles");
          const cars = res.data?.data ?? []; // fallback to empty array
          const filteredCars = cars.filter((car) => car.status !== "archived");
          const nbCars = cars.length;
          const nbCarsAssigne = cars.filter(
            (car) => car.assigned_user !== null
          ).length;
          const nbCarsDisponible = cars.filter(
            (car) => car.assigned_user === null
          ).length;

          set({
            cars: filteredCars,
            nbCars,
            nbCarsAssigne,
            nbCarsDisponible,
          });
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
          await axiosInstance.delete<{ vehicle: Vehicle }>(
            `/vehicles/${carId}`
          );
          await get().fetchCars();
        } catch (err) {
          console.error("fetchCar failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      editCar: async (carId: string, car: CreateCar) => {
        set({ isLoading: true });
        try {
          await axiosInstance.put(`/vehicles/${carId}`, car);
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
