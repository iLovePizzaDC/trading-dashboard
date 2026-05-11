export function usd(n: number) {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function isPos(n: number) {
	return n >= 0;
}

export function fmt(n: number) {
	return `${n >= 0 ? '+' : '-'}$${Math.abs(n).toFixed(2)}`;
}
