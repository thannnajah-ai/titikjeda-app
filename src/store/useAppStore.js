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
      habitHistory: {
        // Formatted 'YYYY-MM-DD': 'passed' | 'failed' | 'alibi'
        [new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0]]: 'passed',
        [new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]]: 'passed',
        [new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0]]: 'alibi',
        [new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0]]: 'passed',
        [new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0]]: 'failed',
        [new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0]]: 'passed',
        [new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0]]: 'passed',
        [new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0]]: 'alibi',
        [new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0]]: 'passed',
      },

      // Actions
      setOathSignature: (sig) => set({ oathSignature: sig }),
      setLastAnswerDate: (date) => set({ lastAnswerDate: date }),
      setDailyStatus: (status) => set((state) => {
        const todayKey = new Date().toISOString().split('T')[0];
        const newHistory = { ...state.habitHistory };
        if (status) {
          newHistory[todayKey] = status;
        } else {
          delete newHistory[todayKey];
        }
        return { 
          dailyStatus: status,
          habitHistory: newHistory
        };
      }),
      addAlibiLog: (log) => set((state) => {
        const todayKey = new Date().toISOString().split('T')[0];
        const newHistory = { ...state.habitHistory };
        if (!newHistory[todayKey] || newHistory[todayKey] !== 'passed') {
          newHistory[todayKey] = 'alibi';
        }
        return { 
          alibiLogs: [...state.alibiLogs, log],
          hasDoneAlibiToday: true,
          habitHistory: newHistory
        };
      }),
      recordHabitDate: (dateStr, status) => set((state) => {
        const newHistory = { ...state.habitHistory };
        if (status) {
          newHistory[dateStr] = status;
        } else {
          delete newHistory[dateStr];
        }
        return { habitHistory: newHistory };
      }),
      clearHabitHistory: () => set({ habitHistory: {} }),
      resetAlibiStatus: () => set({ hasDoneAlibiToday: false }),
      clearAlibiLogs: () => set({ alibiLogs: [] }),

      // Tryout Kilat Pareto
      tryoutHistory: [],
      saveTryoutResult: (result) => set((state) => {
        const todayKey = new Date().toISOString().split('T')[0];
        const newHistory = { ...state.habitHistory };
        // If tryout score >= 600, qualify as passed today if not already passed
        if (result.score >= 600 && (!newHistory[todayKey] || newHistory[todayKey] !== 'passed')) {
          newHistory[todayKey] = 'passed';
        }
        return {
          tryoutHistory: [result, ...state.tryoutHistory].slice(0, 30), // keep latest 30 runs
          habitHistory: newHistory
        };
      }),

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
        hasDoneAlibiToday: state.hasDoneAlibiToday,
        habitHistory: state.habitHistory,
        tryoutHistory: state.tryoutHistory
      }) // Only persist these
    }
  )
)
