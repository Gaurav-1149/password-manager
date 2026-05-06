import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'securevault_token';
const USER_KEY = 'securevault_user';
const MASTER_KEY = 'securevault_master';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(USER_KEY) || 'null'));
  const [masterPassword, setMasterPasswordState] = useState(() => sessionStorage.getItem(MASTER_KEY) || '');

  const setSession = (nextToken, nextUser, nextMasterPassword) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    sessionStorage.setItem(MASTER_KEY, nextMasterPassword);
    setToken(nextToken);
    setUser(nextUser);
    setMasterPasswordState(nextMasterPassword);
  };

  const setMasterPassword = value => {
    sessionStorage.setItem(MASTER_KEY, value);
    setMasterPasswordState(value);
  };

  const logout = async () => {
    try {
      if (token) await api.post('/auth/logout');
    } catch {
      // Local logout should always proceed.
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(MASTER_KEY);
    setToken(null);
    setUser(null);
    setMasterPasswordState('');
    toast.success('Logged out');
  };

  useEffect(() => {
    if (!token) return undefined;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, 15 * 60 * 1000);
    };
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event => window.addEventListener(event, reset));
    reset();
    return () => {
      clearTimeout(timer);
      ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event => window.removeEventListener(event, reset));
    };
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    masterPassword,
    isAuthenticated: Boolean(token),
    setSession,
    setMasterPassword,
    setUser,
    logout
  }), [token, user, masterPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
