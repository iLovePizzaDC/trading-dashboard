export const EQUITY_CURVE_MODES = ['zoom', 'period'] as const;

export type EquityCurveMode = (typeof EQUITY_CURVE_MODES)[number];
