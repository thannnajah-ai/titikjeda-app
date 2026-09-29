import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LockoutOverlay from './components/LockoutOverlay';
import { useAppStore } from './store/useAppStore';

// Lazy load pages for better performance
import LockerRoom from './pages/LockerRoom';
import TheVoid from './pages/TheVoid';
import BilikKonsultasi from './pages/BilikKonsultasi';
import BloodOath from './pages/BloodOath';
import BlindSpot from './pages/BlindSpot';
import OneQuestion from './pages/OneQuestion';
import AlibiLog from './pages/AlibiLog';
import AdminPanel from './pages/AdminPanel';
import StreakPage from './pages/StreakPage';
import NightProtocol from './components/NightProtocol';
import SilentRadio from './components/SilentRadio';
import DailyLockout from './components/DailyLockout';
import AlibiJournal from './components/AlibiJournal';

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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LockerRoom />} />
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
    </NightProtocol>
  );
}
