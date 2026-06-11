import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './framer/LandingPage';
import FarmerShell from './framer/farmer/FarmerShell';
import AdminShell from './framer/admin/AdminShell';
import GovShell from './framer/government/GovShell';
import BankShell from './framer/bank/BankShell';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/farmer/*" element={<FarmerShell />} />
      <Route path="/admin/*" element={<AdminShell />} />
      <Route path="/government/*" element={<GovShell />} />
      <Route path="/bank/*" element={<BankShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
