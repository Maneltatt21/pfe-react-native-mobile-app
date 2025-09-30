import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";
import {
  EditCar,
  ErrorEntry,
  Maintenance,
  Vehicle,
  VehicleDocument,
} from "../types";

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
  editCar: (carId: number, car: EditCar) => Promise<void>;
  deleteCar: (carId: number) => Promise<void>;
  createCarDocument: (carId: number, document: FormData) => Promise<void>;
  createCarMaintenance: (carId: number, maintenance: FormData) => Promise<void>;
  updateDocument: (
    carId: number,
    documentId: number,
    document: Partial<VehicleDocument>
  ) => Promise<void>;
  deleteDocument: (carId: number, documentId: number) => Promise<void>;
  updateMaintenance: (
    carId: number,
    maintenanceId: number,
    maintenance: Partial<Maintenance>
  ) => Promise<void>;
  deleteMaintenance: (carId: number, maintenanceId: number) => Promise<void>;
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
        set((state) => ({
          errors: [...state.errors.slice(-9), error],
        })),
      clearErrors: () => set({ errors: [] }),

      fetchCar: async (carId: number) => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.get(`/vehicles/${carId}`);
          set({ car: data.vehicle });
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de la récupération du véhicule";

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
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      editCar: async (carId: number, carData: EditCar) => {
        set({ isLoading: true });
        const previousCar = get().car;

        try {
          // Optimistic update
          if (previousCar) {
            set({
              car: {
                ...previousCar,
                ...carData,
                updated_at: new Date().toISOString(),
              },
            });
          }

          const { data } = await axiosInstance.put(
            `/vehicles/${carId}`,
            carData
          );
          set({ car: data.vehicle });
        } catch (err: any) {
          if (previousCar) {
            set({ car: previousCar });
          }

          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de la modification du véhicule";

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
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteCar: async (carId: number) => {
        set({ isLoading: true });
        try {
          await axiosInstance.delete(`/vehicles/${carId}`);
          set({ car: null, errors: [] });
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de la suppression du véhicule";

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
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      createCarDocument: async (carId: number, formData: FormData) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post(
            `/vehicles/${carId}/documents`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Optimistically add the new document to the current car
          const currentCar = get().car;
          if (currentCar && currentCar.id === carId) {
            set({
              car: {
                ...currentCar,
                documents: [...currentCar.documents, response.data.document],
                updated_at: new Date().toISOString(),
              },
            });
          }
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de l'ajout du document";

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
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      createCarMaintenance: async (carId: number, formData: FormData) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post(
            `/vehicles/${carId}/maintenances`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Optimistically add the new maintenance to the current car
          const currentCar = get().car;
          if (currentCar && currentCar.id === carId) {
            set({
              car: {
                ...currentCar,
                maintenances: [
                  ...currentCar.maintenances,
                  response.data.maintenance,
                ],
                updated_at: new Date().toISOString(),
              },
            });
          }
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de l'ajout de la maintenance";

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
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      updateDocument: async (
        carId: number,
        documentId: number,
        documentData: Partial<VehicleDocument>
      ) => {
        set({ isLoading: true });
        const previousCar = get().car;

        try {
          // Optimistic update
          if (previousCar) {
            const updatedDocuments = previousCar.documents.map((doc) =>
              doc.id === documentId ? { ...doc, ...documentData } : doc
            );
            set({
              car: {
                ...previousCar,
                documents: updatedDocuments,
                updated_at: new Date().toISOString(),
              },
            });
          }

          const { data } = await axiosInstance.put(
            `/vehicles/${carId}/documents/${documentId}`,
            documentData
          );

          // Update with server response
          if (previousCar) {
            const updatedDocuments = previousCar.documents.map((doc) =>
              doc.id === documentId ? data.document : doc
            );
            set({
              car: {
                ...previousCar,
                documents: updatedDocuments,
              },
            });
          }
        } catch (err: any) {
          // Revert optimistic update on error
          if (previousCar) {
            set({ car: previousCar });
          }

          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de la modification du document";

          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "updateDocument",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteDocument: async (carId: number, documentId: number) => {
        set({ isLoading: true });
        const previousCar = get().car;

        try {
          // Optimistic update
          if (previousCar) {
            const updatedDocuments = previousCar.documents.filter(
              (doc) => doc.id !== documentId
            );
            set({
              car: {
                ...previousCar,
                documents: updatedDocuments,
                updated_at: new Date().toISOString(),
              },
            });
          }

          await axiosInstance.delete(
            `/vehicles/${carId}/documents/${documentId}`
          );
        } catch (err: any) {
          // Revert optimistic update on error
          if (previousCar) {
            set({ car: previousCar });
          }

          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de la suppression du document";

          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "deleteDocument",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      updateMaintenance: async (
        carId: number,
        maintenanceId: number,
        maintenanceData: Partial<Maintenance>
      ) => {
        set({ isLoading: true });
        const previousCar = get().car;

        try {
          // Optimistic update
          if (previousCar) {
            const updatedMaintenances = previousCar.maintenances.map((maint) =>
              maint.id === maintenanceId
                ? { ...maint, ...maintenanceData }
                : maint
            );
            set({
              car: {
                ...previousCar,
                maintenances: updatedMaintenances,
                updated_at: new Date().toISOString(),
              },
            });
          }

          const { data } = await axiosInstance.put(
            `/vehicles/${carId}/maintenances/${maintenanceId}`,
            maintenanceData
          );

          // Update with server response
          if (previousCar) {
            const updatedMaintenances = previousCar.maintenances.map((maint) =>
              maint.id === maintenanceId ? data.maintenance : maint
            );
            set({
              car: {
                ...previousCar,
                maintenances: updatedMaintenances,
              },
            });
          }
        } catch (err: any) {
          // Revert optimistic update on error
          if (previousCar) {
            set({ car: previousCar });
          }

          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de la modification de la maintenance";

          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "updateMaintenance",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteMaintenance: async (carId: number, maintenanceId: number) => {
        set({ isLoading: true });
        const previousCar = get().car;

        try {
          // Optimistic update
          if (previousCar) {
            const updatedMaintenances = previousCar.maintenances.filter(
              (maint) => maint.id !== maintenanceId
            );
            set({
              car: {
                ...previousCar,
                maintenances: updatedMaintenances,
                updated_at: new Date().toISOString(),
              },
            });
          }

          await axiosInstance.delete(
            `/vehicles/${carId}/maintenances/${maintenanceId}`
          );
        } catch (err: any) {
          // Revert optimistic update on error
          if (previousCar) {
            set({ car: previousCar });
          }

          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Erreur inconnue lors de la suppression de la maintenance";

          set((state) => ({
            errors: [
              ...state.errors,
              {
                message: errorMessage,
                operation: "deleteMaintenance",
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "car-storage",
      partialize: (state) => ({
        car: state.car,
      }),
      storage: createJSONStorage(
        () => require("@react-native-async-storage/async-storage").default
      ),
    }
  )
);
