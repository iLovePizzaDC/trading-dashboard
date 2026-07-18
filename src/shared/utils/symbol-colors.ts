import { BRAND_COLORS } from '@/shared/constants/symbol-colors';

export function symbolColor(symbol: string): string {
  if (BRAND_COLORS[symbol]) return BRAND_COLORS[symbol];

  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 60%)`;
}
