import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LockoutOverlay from './components/LockoutOverlay';
import { useAppStore } from './store/useAppStore';

// Lazy load pages for better performance
import LockerRoom from './pages/LockerRoom';
import TheVoid from './pages/TheVoid';
import BilikKonsultasi from './pages/BilikKonsultasi';

export default function App() {
  const incrementTime = useAppStore(state => state.incrementTime);
  const isLockedOut = useAppStore(state => state.isLockedOut);

  // Timer logic for Forced Lockout
  useEffect(() => {
    if (isLockedOut) return;
    
    const interval = setInterval(() => {
      incrementTime();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [incrementTime, isLockedOut]);

  return (
    <>
      <LockoutOverlay />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LockerRoom />} />
          <Route path="void" element={<TheVoid />} />
          <Route path="mentor" element={<BilikKonsultasi />} />
        </Route>
      </Routes>
    </>
  );
}
