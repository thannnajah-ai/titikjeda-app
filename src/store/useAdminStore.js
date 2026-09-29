import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminPin: 'TITIKJEDA2026',
      adminAnnouncement: 'WARTA PUSAT: H-60 UTBK 2026. PERKETAT DISIPLIN, JANGAN ADA YANG KENDOR.',
      isAnnouncementActive: true,
      customQuestions: [], // Soal tambahan dari admin
      forcedQuestionId: null, // Override ID soal yang aktif hari ini
      
      // Auth Actions
      login: (pin) => {
        if (pin === useAdminStore.getState().adminPin) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      setAdminPin: (newPin) => set({ adminPin: newPin }),

      // Announcement Actions
      setAnnouncement: (text, active = true) => set({ 
        adminAnnouncement: text, 
        isAnnouncementActive: active 
      }),
      toggleAnnouncement: () => set((state) => ({ 
        isAnnouncementActive: !state.isAnnouncementActive 
      })),

      // Question Management Actions
      addCustomQuestion: (question) => set((state) => ({
        customQuestions: [question, ...state.customQuestions]
      })),
      deleteCustomQuestion: (id) => set((state) => ({
        customQuestions: state.customQuestions.filter(q => q.id !== id),
        forcedQuestionId: state.forcedQuestionId === id ? null : state.forcedQuestionId
      })),
      setForcedQuestionId: (id) => set({ forcedQuestionId: id }),
      clearForcedQuestion: () => set({ forcedQuestionId: null })
    }),
    {
      name: 'titikjeda-admin-storage',
      partialize: (state) => ({
        adminPin: state.adminPin,
        adminAnnouncement: state.adminAnnouncement,
        isAnnouncementActive: state.isAnnouncementActive,
        customQuestions: state.customQuestions,
        forcedQuestionId: state.forcedQuestionId
      })
    }
  )
);
