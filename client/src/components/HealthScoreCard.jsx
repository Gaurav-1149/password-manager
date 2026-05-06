export default function HealthScoreCard({ score = 0 }) {
  const color = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-orange-500' : 'text-red-600';
  return (
    <div className="panel flex items-center gap-5 p-5">
      <div className={`grid h-28 w-28 place-items-center rounded-full border-8 border-current ${color}`}>
        <span className="text-3xl font-black">{score}</span>
      </div>
      <div>
        <h2 className="text-xl font-bold text-ink">Password Health</h2>
        <p className="text-sm text-slate-600">Score based on weak, duplicate, and old passwords.</p>
      </div>
    </div>
  );
}
