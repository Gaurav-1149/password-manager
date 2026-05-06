import { Copy, Eye, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';

export default function PasswordCard({ entry, onView, onDelete }) {
  const copy = async () => {
    await navigator.clipboard.writeText(entry.password);
    toast.success('Password copied');
  };

  return (
    <article className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">{entry.siteName}</h3>
          <p className="break-all text-sm text-slate-500">{entry.username}</p>
        </div>
        <CategoryBadge category={entry.category} />
      </div>
      <p className="mt-4 font-mono text-sm text-slate-500">••••••••••••</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button title="Copy Password" onClick={copy} className="btn-secondary px-3"><Copy className="h-4 w-4" /></button>
        <button title="View" onClick={() => onView(entry)} className="btn-secondary px-3"><Eye className="h-4 w-4" /></button>
        <Link title="Edit" to={`/vault/edit/${entry.id}`} className="btn-secondary px-3"><Pencil className="h-4 w-4" /></Link>
        <button title="Delete" onClick={() => onDelete(entry.id)} className="btn-secondary px-3 text-red-600"><Trash2 className="h-4 w-4" /></button>
      </div>
    </article>
  );
}
