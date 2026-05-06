import { useEffect, useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import StrengthMeter from '../components/StrengthMeter';

export default function Generator() {
  const [options, setOptions] = useState({ length: 18, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true });
  const [password, setPassword] = useState('');
  const update = event => setOptions({ ...options, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });

  const generate = async () => {
    const { data } = await api.post('/tools/generate', options);
    setPassword(data.password);
  };

  useEffect(() => { generate(); }, [options]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    toast.success('Copied');
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div><h1 className="text-2xl font-black text-ink">Password Generator</h1><p className="text-sm text-slate-600">Live preview updates as options change.</p></div>
      <div className="panel space-y-5 p-5">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-sm break-all">{password}</div>
        <StrengthMeter password={password} />
        <label className="block text-sm font-bold text-slate-700">Length: {options.length}<input className="mt-2 w-full" type="range" min="8" max="64" name="length" value={options.length} onChange={update} /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['includeUppercase', 'Uppercase'],
            ['includeLowercase', 'Lowercase'],
            ['includeNumbers', 'Numbers'],
            ['includeSymbols', 'Symbols']
          ].map(([name, label]) => <label key={name} className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name={name} checked={options[name]} onChange={update} /> {label}</label>)}
        </div>
        <div className="flex gap-2"><button className="btn-primary" onClick={generate}><RotateCcw className="h-4 w-4" /> Regenerate</button><button className="btn-secondary" onClick={copy}><Copy className="h-4 w-4" /> Copy</button></div>
      </div>
    </section>
  );
}
