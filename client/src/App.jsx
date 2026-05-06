import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import VaultDashboard from './pages/VaultDashboard';
import PasswordForm from './pages/PasswordForm';
import Generator from './pages/Generator';
import Health from './pages/Health';
import Breach from './pages/Breach';
import Audit from './pages/Audit';
import Settings from './pages/Settings';

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <div className="lg:flex">
        <Sidebar />
        <main className="min-h-[calc(100vh-57px)] flex-1 bg-slate-50 p-4 lg:p-6">{children}</main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><Landing /></>} />
      <Route path="/register" element={<><Navbar /><Register /></>} />
      <Route path="/login" element={<><Navbar /><Login /></>} />
      <Route path="/verify-otp" element={<><Navbar /><VerifyOTP /></>} />
      <Route element={<PrivateRoute />}>
        <Route path="/vault" element={<Shell><VaultDashboard /></Shell>} />
        <Route path="/vault/add" element={<Shell><PasswordForm /></Shell>} />
        <Route path="/vault/edit/:id" element={<Shell><PasswordForm /></Shell>} />
        <Route path="/generator" element={<Shell><Generator /></Shell>} />
        <Route path="/health" element={<Shell><Health /></Shell>} />
        <Route path="/breach" element={<Shell><Breach /></Shell>} />
        <Route path="/audit" element={<Shell><Audit /></Shell>} />
        <Route path="/settings" element={<Shell><Settings /></Shell>} />
      </Route>
    </Routes>
  );
}
