const zxcvbn = require('zxcvbn');

function strengthLabel(password) {
  const score = zxcvbn(password || '').score;
  if (score <= 1) return 'Weak';
  if (score <= 3) return 'Medium';
  return 'Strong';
}

function generatePassword({
  length = 18,
  includeUppercase = true,
  includeLowercase = true,
  includeNumbers = true,
  includeSymbols = true
}) {
  const sets = [];
  if (includeUppercase) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (includeLowercase) sets.push('abcdefghijklmnopqrstuvwxyz');
  if (includeNumbers) sets.push('0123456789');
  if (includeSymbols) sets.push('!@#$%^&*()_+-=[]{};:,.<>?');
  const charset = sets.join('') || 'abcdefghijklmnopqrstuvwxyz';
  const size = Math.max(8, Math.min(Number(length) || 18, 64));
  let password = sets.map(set => set[Math.floor(Math.random() * set.length)]).join('');
  while (password.length < size) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

module.exports = { strengthLabel, generatePassword };
