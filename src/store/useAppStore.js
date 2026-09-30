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

      // Buku Dosa (Error Logbook)
      errorLog: [],
      recordMistakes: (mistakes) => set((state) => {
        if (!Array.isArray(mistakes) || mistakes.length === 0) return {};
        const existing = [...state.errorLog];
        mistakes.forEach((m) => {
          const idx = existing.findIndex((e) => e.id === m.id);
          if (idx >= 0) {
            existing[idx] = {
              ...existing[idx],
              ...m,
              timesFailed: (existing[idx].timesFailed || 1) + 1,
              status: 'unresolved',
              lastFailedAt: new Date().toISOString()
            };
          } else {
            existing.unshift({
              ...m,
              status: 'unresolved',
              timesFailed: 1,
              timesRedeemed: 0,
              failedAt: new Date().toISOString()
            });
          }
        });
        return { errorLog: existing };
      }),
      redeemMistake: (id) => set((state) => ({
        errorLog: state.errorLog.map((item) =>
          item.id === id
            ? { ...item, status: 'redeemed', timesRedeemed: (item.timesRedeemed || 0) + 1, redeemedAt: new Date().toISOString() }
            : item
        )
      })),
      removeMistake: (id) => set((state) => ({
        errorLog: state.errorLog.filter((item) => item.id !== id)
      })),
      clearErrorLog: () => set({ errorLog: [] }),
      assignErrorTaxonomy: (id, taxonomy) => set((state) => ({
        errorLog: state.errorLog.map((item) =>
          item.id === id ? { ...item, taxonomy } : item
        )
      })),

      // Spartan Target & PTN Goal
      targetPTN: 'STEI ITB - REKAYASA PERANGKAT LUNAK',
      targetScore: 735,
      setTargetGoal: ({ targetPTN, targetScore }) => set({ targetPTN, targetScore }),

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
        tryoutHistory: state.tryoutHistory,
        targetPTN: state.targetPTN,
        targetScore: state.targetScore,
        errorLog: state.errorLog
      }) // Only persist these
    }
  )
)
