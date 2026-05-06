import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ email: '', masterPassword: '' });
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async event => {
    event.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.requiresOTP) {
        sessionStorage.setItem('securevault_pending_email', form.email);
        sessionStorage.setItem('securevault_pending_master', form.masterPassword);
        toast.success('OTP sent');
        return navigate('/verify-otp');
      }
      setSession(data.token, data.user, form.masterPassword);
      toast.success('Welcome back');
      navigate('/vault');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-57px)] place-items-center bg-slate-50 p-4">
      <form onSubmit={submit} className="panel w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-black text-ink">Login</h1>
        <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
        <input className="input" name="masterPassword" type="password" placeholder="Master Password" value={form.masterPassword} onChange={update} required />
        <button className="btn-primary w-full">Unlock Vault</button>
        <p className="text-center text-sm text-slate-600">Need an account? <Link to="/register" className="font-bold text-vault">Register</Link></p>
      </form>
    </main>
  );
}
