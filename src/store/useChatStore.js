import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set) => ({
      aiMemory: "",
      setAiMemory: (memory) => set({ aiMemory: memory }),
    }),
    { name: 'titikjeda-ai-memory' }
  )
);
