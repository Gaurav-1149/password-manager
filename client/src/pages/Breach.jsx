import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import BreachResultCard from '../components/BreachResultCard';

export default function Breach() {
  const [email, setEmail] = useState('');
  const [breaches, setBreaches] = useState(null);
  const submit = async event => {
    event.preventDefault();
    try {
      const { data } = await api.post('/tools/check-breach', { email });
      setBreaches(data.breaches);
      toast.success('Check complete');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Breach check failed');
    }
  };
  return (
    <section className="space-y-5">
      <form onSubmit={submit} className="panel flex flex-col gap-3 p-5 md:flex-row">
        <input className="input" type="email" placeholder="Email address" value={email} onChange={event => setEmail(event.target.value)} required />
        <button className="btn-primary">Check</button>
      </form>
      {breaches?.length === 0 && <div className="panel border-emerald-200 bg-emerald-50 p-5 font-bold text-emerald-700">No breaches found.</div>}
      <div className="space-y-3">{breaches?.map(breach => <BreachResultCard key={breach.Name} breach={breach} />)}</div>
    </section>
  );
}
