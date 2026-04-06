export function usd(n: number) {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
