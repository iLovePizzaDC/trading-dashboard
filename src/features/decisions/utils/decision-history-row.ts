export function getMomentumColor(value?: number) {
  if (!value) return 'bg-white/10 text-white/60';

  if (value > 0.7) return 'bg-green-500/20 text-green-300 border-green-500/30';
  if (value > 0.3) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (value > 0) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';

  return 'bg-red-500/20 text-red-300 border-red-500/30';
}
