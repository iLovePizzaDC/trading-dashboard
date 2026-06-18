import type { EquityCurveMode } from '@/features/equity/constants/equity';

export function getEquityCurveLabel(mode: EquityCurveMode): string {
	return mode === 'zoom' ? 'zoom' : 'period';
}

export function getEquityCurveModeIcon(mode: EquityCurveMode): string {
	return mode === 'zoom' ? '🔍' : '📊';
}
