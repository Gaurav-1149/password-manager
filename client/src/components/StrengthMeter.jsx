import { strength } from '../utils/password';

export default function StrengthMeter({ password = '' }) {
  const result = strength(password);
  const width = `${Math.max(15, (result.score + 1) * 20)}%`;
  return (
    <div className="space-y-1">
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${result.color}`} style={{ width }} />
      </div>
      <p className="text-xs font-semibold text-slate-600">{result.label}</p>
    </div>
  );
}
