export default function OTPInput({ value, onChange }) {
  const digits = value.padEnd(6, ' ').slice(0, 6).split('');
  const setDigit = (index, digit) => {
    const next = digits.map(char => (char === ' ' ? '' : char));
    next[index] = digit.replace(/\D/g, '').slice(-1);
    onChange(next.join('').slice(0, 6));
  };
  return (
    <div className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          className="h-12 w-11 rounded-md border border-slate-300 text-center text-lg font-bold outline-none focus:border-vault focus:ring-2 focus:ring-vault/15"
          value={digit.trim()}
          inputMode="numeric"
          maxLength={1}
          onChange={event => setDigit(index, event.target.value)}
        />
      ))}
    </div>
  );
}
