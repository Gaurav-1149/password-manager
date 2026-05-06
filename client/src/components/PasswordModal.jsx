import { X } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

export default function PasswordModal({ entry, onClose }) {
  if (!entry) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="panel w-full max-w-lg p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">{entry.siteName}</h2>
            <CategoryBadge category={entry.category} />
          </div>
          <button title="Close" onClick={onClose} className="btn-secondary px-3"><X className="h-4 w-4" /></button>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div><dt className="font-bold text-slate-500">URL</dt><dd className="break-all text-slate-800">{entry.siteURL || 'Not saved'}</dd></div>
          <div><dt className="font-bold text-slate-500">Username</dt><dd className="break-all text-slate-800">{entry.username || 'Not saved'}</dd></div>
          <div><dt className="font-bold text-slate-500">Password</dt><dd className="break-all font-mono text-slate-800">{entry.password}</dd></div>
          <div><dt className="font-bold text-slate-500">Notes</dt><dd className="whitespace-pre-wrap text-slate-800">{entry.notes || 'No notes'}</dd></div>
        </dl>
      </div>
    </div>
  );
}
