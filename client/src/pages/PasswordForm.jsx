import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, WandSparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { categories } from '../utils/password';
import StrengthMeter from '../components/StrengthMeter';

const empty = { siteName: '', siteURL: '', username: '', password: '', category: 'Other', notes: '' };

export default function PasswordForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { masterPassword } = useAuth();
  const [form, setForm] = useState(empty);
  const [show, setShow] = useState(false);
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });

  useEffect(() => {
    if (!id) return;
    api.get('/vault', { params: { masterPassword } }).then(({ data }) => {
      const found = data.find(entry => entry.id === id);
      if (found) setForm({ ...empty, ...found });
    });
  }, [id]);

  const generate = async () => {
    const { data } = await api.post('/tools/generate', { length: 20, includeUppercase: true, includeNumbers: true, includeSymbols: true });
    setForm({ ...form, password: data.password });
  };

  const submit = async event => {
    event.preventDefault();
    try {
      const payload = { ...form, masterPassword };
      if (id) await api.put(`/vault/${id}`, payload);
      else await api.post('/vault', payload);
      toast.success(id ? 'Password updated' : 'Password added');
      navigate('/vault');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  return (
    <form onSubmit={submit} className="panel mx-auto max-w-2xl space-y-4 p-5">
      <h1 className="text-2xl font-black text-ink">{id ? 'Edit Password' : 'Add Password'}</h1>
      <input className="input" name="siteName" placeholder="Site Name" value={form.siteName} onChange={update} required />
      <input className="input" name="siteURL" placeholder="Site URL" value={form.siteURL} onChange={update} />
      <input className="input" name="username" placeholder="Username" value={form.username} onChange={update} />
      <div className="flex gap-2">
        <input className="input" name="password" type={show ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={update} required />
        <button type="button" title="Show password" onClick={() => setShow(!show)} className="btn-secondary px-3">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
        <button type="button" title="Generate password" onClick={generate} className="btn-secondary px-3"><WandSparkles className="h-4 w-4" /></button>
      </div>
      <StrengthMeter password={form.password} />
      <select className="input" name="category" value={form.category} onChange={update}>{categories.map(item => <option key={item}>{item}</option>)}</select>
      <textarea className="input min-h-28" name="notes" placeholder="Notes" value={form.notes} onChange={update} />
      <button className="btn-primary">Save Password</button>
    </form>
  );
}
