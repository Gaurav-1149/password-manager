import { Link } from 'react-router-dom';
import { Activity, EyeOff, KeyRound, LockKeyhole, Radar, WandSparkles } from 'lucide-react';

const features = [
  [LockKeyhole, 'AES-256 Encryption', 'Vault items are encrypted before they are written to MongoDB.'],
  [EyeOff, 'Zero-Knowledge Flow', 'Your master password is used at runtime and never saved as plain text.'],
  [WandSparkles, 'Strong Generator', 'Create long, random passwords with symbols, numbers, and uppercase.'],
  [Activity, 'Audit Trail', 'Sensitive actions are recorded with timestamp, IP, and browser details.'],
  [Radar, 'Breach Checks', 'Check accounts against HaveIBeenPwned with an API key.'],
  [KeyRound, 'Vault Health', 'Find weak, duplicate, and stale passwords fast.']
];

export default function Landing() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-vault">Personal password manager</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight text-ink md:text-6xl">SecureVault</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">Store credentials in an encrypted vault, generate stronger passwords, verify vault health, and protect logins with optional email OTP.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
        <div className="panel p-5">
          <div className="rounded-md bg-ink p-5 text-slate-100">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold">Vault Snapshot</span>
              <LockKeyhole className="h-5 w-5 text-teal-300" />
            </div>
            {['Bank Portal', 'Work SSO', 'Primary Email'].map((item, index) => (
              <div key={item} className="mb-3 rounded-md border border-white/10 bg-white/5 p-3">
                <p className="font-semibold">{item}</p>
                <p className="font-mono text-sm text-slate-400">{'•'.repeat(14 + index)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(([Icon, title, text]) => (
          <article key={title} className="panel p-5">
            <Icon className="h-6 w-6 text-vault" />
            <h2 className="mt-4 font-bold text-ink">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{text}</p>
          </article>
        ))}
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-2xl font-black text-ink">Security Model</h2>
          <p className="mt-3 max-w-3xl text-slate-600">SecureVault hashes your master password with bcrypt and uses PBKDF2 to derive AES-256-CBC keys only when you provide it. A stolen database contains bcrypt hashes and encrypted blobs, not readable vault passwords.</p>
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">SecureVault password manager</footer>
    </main>
  );
}
