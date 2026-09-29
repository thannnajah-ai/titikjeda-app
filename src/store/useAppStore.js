import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      studyTime: 0,
      isLockedOut: false,
      
      // V3 States
      oathSignature: null, // Base64 string from canvas
      lastAnswerDate: null, // 'YYYY-MM-DD'
      dailyStatus: null, // 'passed' | 'failed' | null
      alibiLogs: [], // [{ date, text }]
      hasDoneAlibiToday: false,

      // Actions
      setOathSignature: (sig) => set({ oathSignature: sig }),
      setLastAnswerDate: (date) => set({ lastAnswerDate: date }),
      setDailyStatus: (status) => set({ dailyStatus: status }),
      addAlibiLog: (log) => set((state) => ({ 
        alibiLogs: [...state.alibiLogs, log],
        hasDoneAlibiToday: true 
      })),
      resetAlibiStatus: () => set({ hasDoneAlibiToday: false }),
      clearAlibiLogs: () => set({ alibiLogs: [] }),

      incrementTime: () => set((state) => {
        const newTime = state.studyTime + 1;
        if (newTime >= 5400) {
          return { studyTime: newTime, isLockedOut: true };
        }
        return { studyTime: newTime };
      }),

      fastForward: () => set({ studyTime: 5400, isLockedOut: true }),
      resetLockout: () => set({ studyTime: 0, isLockedOut: false })
    }),
    {
      name: 'titikjeda-app-storage',
      partialize: (state) => ({ 
        oathSignature: state.oathSignature, 
        lastAnswerDate: state.lastAnswerDate,
        dailyStatus: state.dailyStatus,
        alibiLogs: state.alibiLogs,
        hasDoneAlibiToday: state.hasDoneAlibiToday
      }) // Only persist these
    }
  )
)
