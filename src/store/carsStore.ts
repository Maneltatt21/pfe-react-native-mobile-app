// store/carsStore.ts
import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { CreateCar, Vehicle } from "../models/car.model";

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

export const useCarsStore = create<CarsState>((set, get) => ({
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
      const res = await axiosInstance.get("/vehicles");
      const cars = res.data?.data ?? res.data?.vehicles ?? [];

      const filteredCars = cars.filter(
        (car: Vehicle) => car.status !== "archived"
      );

      const nbCars = filteredCars.length;
      const nbCarsAssigne = filteredCars.filter(
        (car: Vehicle) => car.assigned_user !== null
      ).length;
      const nbCarsDisponible = filteredCars.filter(
        (car: Vehicle) => car.assigned_user === null
      ).length;

      set({
        cars: filteredCars,
        nbCars,
        nbCarsAssigne,
        nbCarsDisponible,
      });
    } catch (err) {
      console.error("fetchCars failed:", err);
      set({
        cars: [],
        nbCars: 0,
        nbCarsAssigne: 0,
        nbCarsDisponible: 0,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createCar: async (car) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/vehicles", car);
      await get().fetchCars();
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCar: async (carId) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get(`/vehicles/${carId}`);
      return data.vehicle as Vehicle;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCar: async (carId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/vehicles/${carId}`);
      await get().fetchCars();
    } finally {
      set({ isLoading: false });
    }
  },

  editCar: async (carId, car) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/vehicles/${carId}`, car);
      await get().fetchCars();
    } finally {
      set({ isLoading: false });
    }
  },
}));
