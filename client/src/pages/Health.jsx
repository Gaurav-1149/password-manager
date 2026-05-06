import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import HealthScoreCard from '../components/HealthScoreCard';

function IssueList({ title, items }) {
  return (
    <div className="panel p-4">
      <h2 className="font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-2">
        {items?.map(entry => (
          <div key={`${title}-${entry.id}`} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
            <span>{entry.siteName} <span className="text-slate-500">{entry.username}</span></span>
            <Link className="font-bold text-vault" to={`/vault/edit/${entry.id}`}>Fix</Link>
          </div>
        ))}
        {!items?.length && <p className="text-sm text-slate-500">No issues found.</p>}
      </div>
    </div>
  );
}

export default function Health() {
  const { masterPassword } = useAuth();
  const [report, setReport] = useState(null);
  useEffect(() => {
    api.get('/vault/health', { params: { masterPassword } }).then(({ data }) => setReport(data)).catch(error => toast.error(error.response?.data?.message || 'Health check failed'));
  }, []);
  if (!report) return <div className="panel p-6">Loading health report...</div>;
  return (
    <section className="space-y-5">
      <HealthScoreCard score={report.score} />
      <div className="grid gap-4 xl:grid-cols-3">
        <IssueList title="Weak Passwords" items={report.weakPasswords} />
        <IssueList title="Duplicate Passwords" items={report.duplicatePasswords} />
        <IssueList title="Old Passwords" items={report.oldPasswords} />
      </div>
    </section>
  );
}
