import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LockoutOverlay from './components/LockoutOverlay';
import { useAppStore } from './store/useAppStore';
import NightProtocol from './components/NightProtocol';
import SilentRadio from './components/SilentRadio';
import DailyLockout from './components/DailyLockout';
import AlibiJournal from './components/AlibiJournal';

// Code-split pages for lightning-fast sub-second initial load
const LockerRoom = lazy(() => import('./pages/LockerRoom'));
const RasionalisasiPTN = lazy(() => import('./pages/RasionalisasiPTN'));
const TryoutKilat = lazy(() => import('./pages/TryoutKilat'));
const DeconstructSoal = lazy(() => import('./pages/DeconstructSoal'));
const StreakPage = lazy(() => import('./pages/StreakPage'));
const TheVoid = lazy(() => import('./pages/TheVoid'));
const BilikKonsultasi = lazy(() => import('./pages/BilikKonsultasi'));
const BloodOath = lazy(() => import('./pages/BloodOath'));
const BlindSpot = lazy(() => import('./pages/BlindSpot'));
const OneQuestion = lazy(() => import('./pages/OneQuestion'));
const AlibiLog = lazy(() => import('./pages/AlibiLog'));
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
  const incrementTime = useAppStore(state => state.incrementTime);
  const isLockedOut = useAppStore(state => state.isLockedOut);
  const hasDoneAlibiToday = useAppStore(state => state.hasDoneAlibiToday);

  // Timer logic for Forced Lockout
  useEffect(() => {
    if (isLockedOut) return;

    const interval = setInterval(() => {
      incrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [incrementTime, isLockedOut]);

  return (
    <NightProtocol forceShow={false}>
      <SilentRadio />
      <DailyLockout />
      {!hasDoneAlibiToday && <AlibiJournal />}
      <LockoutOverlay />
      <Suspense fallback={<ModuleLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LockerRoom />} />
            <Route path="rasionalisasi" element={<RasionalisasiPTN />} />
            <Route path="tryout" element={<TryoutKilat />} />
            <Route path="bedah" element={<DeconstructSoal />} />
            <Route path="streak" element={<StreakPage />} />
            <Route path="void" element={<TheVoid />} />
            <Route path="mentor" element={<BilikKonsultasi />} />
            <Route path="oath" element={<BloodOath />} />
            <Route path="blindspot" element={<BlindSpot />} />
            <Route path="one" element={<OneQuestion />} />
            <Route path="alibi" element={<AlibiLog />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Suspense>
    </NightProtocol>
  );
}

