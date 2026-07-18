export function getMonthCellColor(ret: number): string {
  if (ret >= 8) return 'bg-green-500/50';
  if (ret >= 4) return 'bg-green-500/40';
  if (ret >= 2) return 'bg-green-500/30';
  if (ret >= 0) return 'bg-green-500/20';
  if (ret >= -2) return 'bg-red-500/20';
  if (ret >= -4) return 'bg-red-500/30';
  if (ret >= -8) return 'bg-red-500/40';
  return 'bg-red-500/50';
}
