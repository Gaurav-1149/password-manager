import { NavLink } from 'react-router-dom';
import { Activity, HeartPulse, KeyRound, Lock, Radar, Settings, WandSparkles } from 'lucide-react';

const links = [
  ['/vault', KeyRound, 'Vault'],
  ['/vault/add', Lock, 'Add Password'],
  ['/generator', WandSparkles, 'Generator'],
  ['/health', HeartPulse, 'Health'],
  ['/breach', Radar, 'Breach Check'],
  ['/audit', Activity, 'Audit Log'],
  ['/settings', Settings, 'Settings']
];

export default function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white lg:min-h-[calc(100vh-57px)] lg:w-64 lg:border-b-0 lg:border-r">
      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
        {links.map(([to, Icon, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-teal-50 text-vault' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
