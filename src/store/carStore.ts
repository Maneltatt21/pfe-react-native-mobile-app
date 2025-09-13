import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";
import { CreateCar, CreateCarMaintenance, ErrorEntry, Vehicle } from "../types";

// Interface for CarState
interface CarState {
  car: Vehicle | null;
  errors: ErrorEntry[];
  isLoading: boolean;
  setCar: (car: Vehicle) => void;
  setLoading: (isLoading: boolean) => void;
  addError: (error: ErrorEntry) => void;
  clearErrors: () => void;
  fetchCar: (carId: number) => Promise<void>;
  editCar: (carId: string, car: CreateCar) => Promise<void>;
  deleteCar: (carId: string) => Promise<void>;
  createCarDocument: (carId: number, document: FormData) => Promise<void>;
  createCarMaintenance: (
    carId: number,
    maintenance: CreateCarMaintenance
  ) => Promise<void>;
}

export const useCarStore = create<CarState>()(
  persist(
    (set, get) => ({
      car: null,
      errors: [],
      isLoading: false,

      setCar: (car) => set({ car }),
      setLoading: (isLoading) => set({ isLoading }),
      addError: (error) =>
        set((state) => ({ errors: [...state.errors, error] })),
      clearErrors: () => set({ errors: [] }),

      fetchCar: async (carId: number) => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.get<{ vehicle: Vehicle }>(
            `/vehicles/${carId}`
          );
          console.log("data:", JSON.stringify(data, null, 2));
          set({ car: data.vehicle });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erreur inconnue";
          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "fetchCar",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      editCar: async (carId: string, car: CreateCar) => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.put<{ vehicle: Vehicle }>(
            `/vehicles/${carId}`,
            car
          );
          set({ car: data.vehicle });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erreur inconnue";
          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "editCar",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      deleteCar: async (carId: string) => {
        set({ isLoading: true });
        try {
          await axiosInstance.delete(`/vehicles/${carId}`);
          set({ car: null, errors: [] });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erreur inconnue";
          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "deleteCar",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      createCarDocument: async (carId: number, document: FormData) => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.post(
            `/vehicles/${carId}/documents`,
            document
          );
          console.log("res : ", res);
          // now refresh the full vehicle
          const { data } = await axiosInstance.get<{ vehicle: Vehicle }>(
            `/vehicles/${carId}`
          );
          set({ car: data.vehicle });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erreur inconnue";
          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "createCarDocument",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          console.error("createCarDocument failed:", err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      createCarMaintenance: async (
        vehicle_id: number,
        maintenance: CreateCarMaintenance
      ) => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.post<{ vehicle: Vehicle }>(
            `/vehicles/${vehicle_id}/maintenances`,
            maintenance
          );
          console.log("data:", JSON.stringify(data, null, 2));
          set({ car: data.vehicle });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erreur inconnue";
          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "createCarMaintenance",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          console.error("createCarMaintenance failed:", err);
          throw err; // For UI error handling
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "car-storage",
      storage: createJSONStorage(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        () => require("@react-native-async-storage/async-storage").default
      ),
    }
  )
);
