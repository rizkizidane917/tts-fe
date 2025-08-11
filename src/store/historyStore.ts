import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryItem {
  id: number;
  fullText: string;
  language: string;
  voice: string;
  date: string;
  speed: string;
  pitch: string;
  volume: string;
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
