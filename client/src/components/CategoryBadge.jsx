const colors = {
  Social: 'bg-sky-50 text-sky-700',
  Banking: 'bg-emerald-50 text-emerald-700',
  Work: 'bg-indigo-50 text-indigo-700',
  Email: 'bg-amber-50 text-amber-700',
  Shopping: 'bg-rose-50 text-rose-700',
  Other: 'bg-slate-100 text-slate-700'
};

export default function CategoryBadge({ category = 'Other' }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-bold ${colors[category] || colors.Other}`}>{category}</span>;
}
