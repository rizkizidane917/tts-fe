import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryItem {
  id: string;
  text: string;
  language: string;
  voice: string;
  createdAt: string;
  rate: number;
  pitch: number;
  volume: number;
  userId: string;
}

interface HistoryState {
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history], // new at top
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "tts-history", // localStorage key
    }
  )
);
