import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAppStore } from './useAppStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isAuthModalOpen: false,
  authError: null,

  openAuthModal: () => set({ isAuthModalOpen: true, authError: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, authError: null }),

  // Initialize auth state on app boot
  initAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user, session });
        get().syncFromCloud(session.user);
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null, session });
        if (session?.user) {
          get().syncFromCloud(session.user);
        }
      });
    } catch (e) {
      console.warn("Supabase auth init warning:", e);
    }
  },

  // 1-Click Google OAuth
  signInWithGoogle: async () => {
    set({ isLoading: true, authError: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (e) {
      set({ authError: e.message || 'Gagal login dengan Google' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Smart Instant Auth: coba login, jika akun baru otomatis registrasi
  smartAuthWithEmail: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      // 1. Coba login dulu
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!signInErr && signInData?.user) {
        set({ user: signInData.user, session: signInData.session, isAuthModalOpen: false });
        get().syncToCloud(signInData.user);
        return { success: true, isNew: false };
      }

      // 2. Jika akun belum terdaftar, coba otomatis buatkan akun
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpErr) {
        throw new Error(signUpErr.message || signInErr?.message || 'Gagal memproses otentikasi');
      }

      set({ user: signUpData.user, session: signUpData.session, isAuthModalOpen: false });
      if (signUpData.user) {
        get().syncToCloud(signUpData.user);
      }
      return { success: true, isNew: true };
    } catch (e) {
      set({ authError: e.message || 'Gagal memproses otentikasi' });
      return { success: false, error: e.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // 1-Click Demo Testing User
  signInDemoUser: async () => {
    return get().smartAuthWithEmail('pejuang.utbk@titikjeda.id', 'titikjeda2026');
  },

  // Email Magic Link / Password
  signInWithEmail: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      set({ user: data.user, session: data.session, isAuthModalOpen: false });
      get().syncToCloud(data.user);
      return true;
    } catch (e) {
      set({ authError: e.message || 'Email atau password salah' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  signUpWithEmail: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      set({ user: data.user, session: data.session, isAuthModalOpen: false });
      if (data.user) {
        get().syncToCloud(data.user);
      }
      return true;
    } catch (e) {
      set({ authError: e.message || 'Gagal mendaftar akun' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } catch (e) {
      console.warn("Sign out error:", e);
    }
  },

  // Sync local data to Supabase User Metadata (Guaranteed to work without needing DB migrations)
  syncToCloud: async (userParam) => {
    const activeUser = userParam || get().user;
    if (!activeUser) return;

    try {
      const appState = useAppStore.getState();
      const payload = {
        targetPTN: appState.targetPTN,
        targetScore: appState.targetScore,
        tryoutHistory: appState.tryoutHistory,
        habitHistory: appState.habitHistory,
        lastAnswerDate: appState.lastAnswerDate,
        dailyStatus: appState.dailyStatus,
        syncedAt: new Date().toISOString()
      };

      // 1. Update Supabase User Metadata
      await supabase.auth.updateUser({
        data: { titikjeda_progress: payload }
      });

      // 2. Try updating user_progress table if table exists
      try {
        await supabase.from('user_profiles').upsert({
          id: activeUser.id,
          email: activeUser.email,
          target_ptn: appState.targetPTN,
          target_score: appState.targetScore,
          updated_at: new Date().toISOString()
        });
      } catch (tableErr) {
        // Silent catch if user hasn't created the table in SQL editor
      }

      console.log("☁️ Progres TitikJeda berhasil disinkronkan ke Cloud Supabase!");
    } catch (e) {
      console.warn("Cloud sync warning:", e);
    }
  },

  // Sync data from Cloud to local state
  syncFromCloud: (activeUser) => {
    if (!activeUser?.user_metadata?.titikjeda_progress) return;
    try {
      const cloudData = activeUser.user_metadata.titikjeda_progress;
      const appStore = useAppStore.getState();

      // Merge cloud target if not locally set or older
      if (cloudData.targetPTN) {
        appStore.setTargetGoal({
          targetPTN: cloudData.targetPTN,
          targetScore: cloudData.targetScore || 735
        });
      }

      // Merge habit history
      if (cloudData.habitHistory && Object.keys(cloudData.habitHistory).length > 0) {
        const mergedHabit = {
          ...cloudData.habitHistory,
          ...appStore.habitHistory
        };
        useAppStore.setState({ habitHistory: mergedHabit });
      }

      // Merge tryout history
      if (Array.isArray(cloudData.tryoutHistory) && cloudData.tryoutHistory.length > 0) {
        const currentRuns = appStore.tryoutHistory || [];
        const existingIds = new Set(currentRuns.map(r => r.id));
        const newRuns = cloudData.tryoutHistory.filter(r => !existingIds.has(r.id));
        if (newRuns.length > 0) {
          useAppStore.setState({
            tryoutHistory: [...currentRuns, ...newRuns].slice(0, 30)
          });
        }
      }
    } catch (e) {
      console.warn("Sync from cloud parse error:", e);
    }
  }
}));
