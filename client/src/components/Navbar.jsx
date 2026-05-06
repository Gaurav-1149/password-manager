import { Link, NavLink } from 'react-router-dom';
import { LockKeyhole, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-ink">
          <Shield className="h-6 w-6 text-vault" /> SecureVault
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {isAuthenticated ? (
            <>
              <NavLink to="/vault" className="hidden px-3 py-2 font-medium text-slate-700 sm:inline">Vault</NavLink>
              <button onClick={logout} className="btn-secondary"><LogOut className="h-4 w-4" /> Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="px-3 py-2 font-medium text-slate-700">Login</NavLink>
              <Link to="/register" className="btn-primary"><LockKeyhole className="h-4 w-4" /> Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
