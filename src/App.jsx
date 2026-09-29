import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SilentRadio from './components/SilentRadio';
import AuthModal from './components/AuthModal';
import { useAuthStore } from './store/useAuthStore';

// Code-split pages for lightning-fast sub-second initial load
const LockerRoom = lazy(() => import('./pages/LockerRoom'));
const RasionalisasiPTN = lazy(() => import('./pages/RasionalisasiPTN'));
const TryoutKilat = lazy(() => import('./pages/TryoutKilat'));
const DeconstructSoal = lazy(() => import('./pages/DeconstructSoal'));
const StreakPage = lazy(() => import('./pages/StreakPage'));
const TheVoid = lazy(() => import('./pages/TheVoid'));
const BilikKonsultasi = lazy(() => import('./pages/BilikKonsultasi'));
const BloodOath = lazy(() => import('./pages/BloodOath'));
const OneQuestion = lazy(() => import('./pages/OneQuestion'));
const BukuDosa = lazy(() => import('./pages/BukuDosa'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function ModuleLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 font-mono">
      <div className="w-8 h-8 border-4 border-zinc-950 border-t-transparent animate-spin mb-4"></div>
      <p className="text-xs font-black uppercase tracking-widest text-zinc-600 animate-pulse">
        MEMUAT MODUL PERANG...
      </p>
    </div>
  );
}

export default function App() {
  const initAuth = useAuthStore(state => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <SilentRadio />
      <AuthModal />
      <Suspense fallback={<ModuleLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LockerRoom />} />
            <Route path="rasionalisasi" element={<RasionalisasiPTN />} />
            <Route path="tryout" element={<TryoutKilat />} />
            <Route path="dosa" element={<BukuDosa />} />
            <Route path="bedah" element={<DeconstructSoal />} />
            <Route path="streak" element={<StreakPage />} />
            <Route path="void" element={<TheVoid />} />
            <Route path="mentor" element={<BilikKonsultasi />} />
            <Route path="oath" element={<BloodOath />} />
            <Route path="one" element={<OneQuestion />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}


