import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { categories } from '../utils/password';
import PasswordCard from '../components/PasswordCard';
import PasswordModal from '../components/PasswordModal';
import SearchBar from '../components/SearchBar';

export default function VaultDashboard() {
  const { masterPassword } = useAuth();
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/vault', { params: { masterPassword } });
      setEntries(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load vault');
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async id => {
    if (!confirm('Delete this password?')) return;
    await api.delete(`/vault/${id}`);
    setEntries(entries.filter(entry => entry.id !== id));
    toast.success('Deleted');
  };

  const filtered = useMemo(() => entries.filter(entry => {
    const matchesQuery = [entry.siteName, entry.username].join(' ').toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!category || entry.category === category);
  }), [entries, query, category]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-black text-ink">Vault</h1><p className="text-sm text-slate-600">{filtered.length} saved credentials</p></div>
        <Link to="/vault/add" className="btn-primary"><Plus className="h-4 w-4" /> Add New Password</Link>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <SearchBar value={query} onChange={setQuery} />
        <select className="input" value={category} onChange={event => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map(item => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(entry => <PasswordCard key={entry.id} entry={entry} onView={setSelected} onDelete={remove} />)}
      </div>
      {!filtered.length && <div className="panel p-8 text-center text-slate-500">No matching passwords.</div>}
      <PasswordModal entry={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
