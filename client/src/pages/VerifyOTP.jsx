import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import OTPInput from '../components/OTPInput';
import { useAuth } from '../context/AuthContext';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const email = sessionStorage.getItem('securevault_pending_email');
  const master = sessionStorage.getItem('securevault_pending_master');

  useEffect(() => {
    const timer = setInterval(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const submit = async event => {
    event.preventDefault();
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      setSession(data.token, data.user, master);
      toast.success('Verified');
      navigate('/vault');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP failed');
    }
  };

  const resend = async () => {
    await api.post('/auth/resend-otp', { email });
    setCooldown(60);
    toast.success('OTP resent');
  };

  return (
    <main className="grid min-h-[calc(100vh-57px)] place-items-center bg-slate-50 p-4">
      <form onSubmit={submit} className="panel w-full max-w-md space-y-5 p-6">
        <div><h1 className="text-2xl font-black text-ink">Verify OTP</h1><p className="text-sm text-slate-600">Enter the 6-digit code sent to {email}.</p></div>
        <OTPInput value={otp} onChange={setOtp} />
        <button className="btn-primary w-full" disabled={otp.length !== 6}>Verify</button>
        <button type="button" className="btn-secondary w-full" disabled={cooldown > 0} onClick={resend}>Resend {cooldown > 0 ? `(${cooldown}s)` : ''}</button>
      </form>
    </main>
  );
}
