export default function BreachResultCard({ breach }) {
  return (
    <article className="panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-ink">{breach.Name || breach.Title}</h3>
        <span className="text-sm font-semibold text-red-600">{breach.BreachDate}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: breach.Description || '' }} />
      <p className="mt-3 text-xs font-bold text-slate-500">Exposed: {(breach.DataClasses || []).join(', ')}</p>
    </article>
  );
}
