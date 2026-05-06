import zxcvbn from 'zxcvbn';

export function strength(password) {
  const score = zxcvbn(password || '').score;
  if (score <= 1) return { label: 'Weak', score, color: 'bg-red-500' };
  if (score <= 3) return { label: 'Medium', score, color: 'bg-orange-500' };
  return { label: 'Strong', score, color: 'bg-emerald-600' };
}

export const categories = ['Social', 'Banking', 'Work', 'Email', 'Shopping', 'Other'];
