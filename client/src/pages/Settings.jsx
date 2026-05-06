import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, setUser, masterPassword, setMasterPassword, logout } = useAuth();
  const [form, setForm] = useState({ currentMasterPassword: '', newMasterPassword: '' });
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });

  const changeMaster = async event => {
    event.preventDefault();
    await api.put('/auth/change-master-password', form);
    setMasterPassword(form.newMasterPassword);
    setForm({ currentMasterPassword: '', newMasterPassword: '' });
    toast.success('Master password changed');
  };

  const toggle2FA = async event => {
    const { data } = await api.put('/auth/2fa', { enabled: event.target.checked });
    setUser({ ...user, twoFactorEnabled: data.twoFactorEnabled });
    localStorage.setItem('securevault_user', JSON.stringify({ ...user, twoFactorEnabled: data.twoFactorEnabled }));
    toast.success(data.message);
  };

  const exportVault = async () => {
    const { data } = await api.get('/vault/export', { params: { masterPassword } });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `securevault-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importVault = async event => {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parsed = file.name.endsWith('.json') ? JSON.parse(text) : { entries: text.split('\n').slice(1).filter(Boolean).map(line => {
      const [siteName, siteURL, username, password, category, notes] = line.split(',');
      return { siteName, siteURL, username, password, category, notes };
    }) };
    await api.post('/vault/import', { entries: parsed.entries || parsed, masterPassword });
    toast.success('Import complete');
  };

  const deleteAccount = async () => {
    if (!confirm('This permanently deletes your account and vault. Continue?')) return;
    await api.delete('/auth/account');
    toast.success('Account deleted');
    logout();
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <form onSubmit={changeMaster} className="panel space-y-3 p-5">
        <h1 className="text-2xl font-black text-ink">Settings</h1>
        <h2 className="font-bold text-ink">Change Master Password</h2>
        <input className="input" type="password" name="currentMasterPassword" placeholder="Current master password" value={form.currentMasterPassword} onChange={update} required />
        <input className="input" type="password" name="newMasterPassword" placeholder="New master password" minLength={12} value={form.newMasterPassword} onChange={update} required />
        <button className="btn-primary">Change Password</button>
      </form>
      <div className="panel space-y-4 p-5">
        <label className="flex items-center justify-between gap-3 font-bold text-ink">Enable 2FA <input type="checkbox" checked={Boolean(user?.twoFactorEnabled)} onChange={toggle2FA} /></label>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={exportVault}>Export Vault</button>
          <label className="btn-secondary cursor-pointer">Import Vault<input type="file" accept=".json,.csv" className="hidden" onChange={importVault} /></label>
        </div>
        <button onClick={deleteAccount} className="rounded-md border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Delete Account</button>
      </div>
    </section>
  );
}
