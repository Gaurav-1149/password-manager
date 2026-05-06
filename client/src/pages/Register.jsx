import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import StrengthMeter from '../components/StrengthMeter';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', masterPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async event => {
    event.preventDefault();
    if (form.masterPassword !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, masterPassword: form.masterPassword });
      toast.success('Account created');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-57px)] place-items-center bg-slate-50 p-4">
      <form onSubmit={submit} className="panel w-full max-w-md space-y-4 p-6">
        <div><h1 className="text-2xl font-black text-ink">Create SecureVault</h1><p className="text-sm text-slate-600">Remember your master password. It cannot be recovered.</p></div>
        <input className="input" name="name" placeholder="Full Name" value={form.name} onChange={update} required />
        <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
        <input className="input" name="masterPassword" type="password" placeholder="Master Password" minLength={12} value={form.masterPassword} onChange={update} required />
        <StrengthMeter password={form.masterPassword} />
        <input className="input" name="confirm" type="password" placeholder="Confirm Master Password" value={form.confirm} onChange={update} required />
        <button disabled={loading} className="btn-primary w-full">Create Account</button>
        <p className="text-center text-sm text-slate-600">Already registered? <Link to="/login" className="font-bold text-vault">Login</Link></p>
      </form>
    </main>
  );
}
