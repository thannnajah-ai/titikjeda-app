import { create } from 'zustand'

export const useAppStore = create((set) => ({
  studyTime: 0,
  isLockedOut: false,
  
  // Action to increment study time
  incrementTime: () => set((state) => {
    // 5400 seconds = 90 minutes
    const newTime = state.studyTime + 1;
    if (newTime >= 5400) {
      return { studyTime: newTime, isLockedOut: true };
    }
    return { studyTime: newTime };
  }),

  // Dev tool to fast forward time
  fastForward: () => set({ studyTime: 5400, isLockedOut: true }), // Langsung memicu Lockout
  
  // Dev tool to reset
  resetLockout: () => set({ studyTime: 0, isLockedOut: false })
}))
