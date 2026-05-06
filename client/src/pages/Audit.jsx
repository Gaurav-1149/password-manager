import { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  useEffect(() => { api.get('/audit').then(({ data }) => setLogs(data)); }, []);
  const actions = [...new Set(logs.map(log => log.action))];
  const filtered = useMemo(() => logs.filter(log => !filter || log.action === filter), [logs, filter]);
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-ink">Audit Log</h1>
        <select className="input max-w-xs" value={filter} onChange={event => setFilter(event.target.value)}><option value="">All actions</option>{actions.map(action => <option key={action}>{action}</option>)}</select>
      </div>
      <div className="panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Action</th><th className="p-3">IP Address</th><th className="p-3">Date & Time</th></tr></thead>
          <tbody>{filtered.map(log => <tr className="border-t border-slate-100" key={log._id}><td className="p-3 font-bold">{log.action}</td><td className="p-3">{log.ipAddress}</td><td className="p-3">{new Date(log.timestamp).toLocaleString()}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
