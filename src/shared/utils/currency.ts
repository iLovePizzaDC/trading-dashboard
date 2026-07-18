export function usd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function isPos(n: number) {
  return n >= 0;
}

export function fmt(n: number, relative: boolean = true) {
  return `${n >= 0 ? '+' : '-'}${relative ? '' : '$'}${Math.abs(n).toFixed(2)}${relative ? '%' : ''}`;
}
