import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";
import { Exchange, ExchangesResponse } from "../models/exchange.model";

// Define type for creating/editing an exchange
export interface CreateExchange {
  from_driver_id: number;
  to_driver_id: number;
  vehicle_id: number;
  note?: string;
  before_photo: File;
}

// Interface for ExchangesState
interface ExchangesState {
  exchanges: Exchange[];
  nbExchanges: number;
  nbExchangesPending: number;
  nbExchangesApproved: number;
  nbExchangesRejected: number;
  isLoading: boolean;
  setExchanges: (exchanges: Exchange[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchDriverExchanges: () => Promise<void>;
  createExchange: (exchange: FormData) => Promise<void>;
  fetchExchange: (exchangeId: string) => Promise<Exchange | undefined>;
  deleteExchange: (exchangeId: string) => Promise<void>;
  editExchange: (exchangeId: string, exchange: CreateExchange) => Promise<void>;
}

export const useDriverExchangesStore = create<ExchangesState>()(
  persist(
    (set, get) => ({
      exchanges: [],
      nbExchanges: 0,
      nbExchangesPending: 0,
      nbExchangesApproved: 0,
      nbExchangesRejected: 0,
      isLoading: false,

      setExchanges: (exchanges) => set({ exchanges }),
      setLoading: (isLoading) => set({ isLoading }),

      fetchDriverExchanges: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get<ExchangesResponse>(
            "/my-exchanges"
          );
          const exchanges = res.data.data;
          const nbExchanges = exchanges.length;
          const nbExchangesPending = exchanges.filter(
            (exchange) => exchange.status === "pending"
          ).length;
          const nbExchangesApproved = exchanges.filter(
            (exchange) => exchange.status === "approved"
          ).length;
          const nbExchangesRejected = exchanges.filter(
            (exchange) => exchange.status === "rejected"
          ).length;

          set({
            exchanges,
            nbExchanges,
            nbExchangesPending,
            nbExchangesApproved,
            nbExchangesRejected,
          });
        } catch (err) {
          console.error("fetchExchanges failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      createExchange: async (exchange: FormData) => {
        set({ isLoading: true });
        try {
          await axiosInstance.post<{ exchange: Exchange }>(
            "/exchanges",
            exchange,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                // Don't manually set other headers - let axios handle it
              },
            }
          );
          await get().fetchDriverExchanges();
        } catch (err) {
          console.error("createExchange failed:", err);
          throw err; // Optional: so you can catch in UI
        } finally {
          set({ isLoading: false });
        }
      },
      fetchExchange: async (exchangeId: string) => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.get<{ exchange: Exchange }>(
            `/exchanges/${exchangeId}`
          );
          return data.exchange;
        } catch (err) {
          console.error("fetchExchange failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      deleteExchange: async (exchangeId: string) => {
        set({ isLoading: true });
        try {
          await axiosInstance.delete<{ exchange: Exchange }>(
            `/exchanges/${exchangeId}`
          );
          await get().fetchDriverExchanges();
        } catch (err) {
          console.error("deleteExchange failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
      editExchange: async (exchangeId: string, exchange: CreateExchange) => {
        set({ isLoading: true });
        try {
          await axiosInstance.put(`/exchanges/${exchangeId}`, exchange);
          await get().fetchDriverExchanges();
        } catch (err) {
          console.error("editExchange failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "driver-exchanges-storage",
      storage: createJSONStorage(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        () => require("@react-native-async-storage/async-storage").default
      ),
    }
  )
);
