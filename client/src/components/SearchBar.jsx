import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search vault' }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
      <input className="input pl-9" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
