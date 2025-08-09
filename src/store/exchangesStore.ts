// store/exchangesStore.ts

import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { Exchange, ExchangesResponse } from "../models/exchange.model";

interface ExchangesState {
  exchanges: Exchange[];
  isLoading: boolean;
  fetchExchanges: () => Promise<void>;
  setExchanges: (data: Exchange[]) => void;
}

export const useExchangesStore = create<ExchangesState>((set) => ({
  exchanges: [],
  isLoading: false,

  setExchanges: (data) => set({ exchanges: data }),

  fetchExchanges: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get<ExchangesResponse>("/exchanges");
      set({ exchanges: res.data.data });
    } catch (error) {
      console.error("Failed to fetch exchanges:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
