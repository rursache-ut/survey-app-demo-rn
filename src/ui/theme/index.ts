import { useColorScheme } from 'react-native';
import { useMemo } from 'react';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 28,
  pill: 999,
};

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37 },
  title1: { fontSize: 28, fontWeight: '700' as const },
  title2: { fontSize: 22, fontWeight: '700' as const },
  title3: { fontSize: 20, fontWeight: '600' as const },
  headline: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 17, fontWeight: '400' as const },
  callout: { fontSize: 16, fontWeight: '400' as const },
  subhead: { fontSize: 15, fontWeight: '400' as const },
  footnote: { fontSize: 13, fontWeight: '400' as const },
  caption1: { fontSize: 12, fontWeight: '400' as const },
  caption2: { fontSize: 11, fontWeight: '400' as const },
};

const lightColors = {
  background: '#F2F2F7',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  separator: 'rgba(60,60,67,0.18)',
  text: '#000000',
  textSecondary: 'rgba(60,60,67,0.6)',
  textTertiary: 'rgba(60,60,67,0.3)',
  accent: '#0A84FF',
  success: '#30D158',
  warning: '#FF9F0A',
  warningBg: '#FFF4E5',
  warningText: '#7C3D00',
  warningTitle: '#B45309',
  danger: '#FF453A',
  payout: '#34C759',
  optionSelectedBg: '#EAF4FF',
  glassTint: 'rgba(255,255,255,0.7)',
  inputBg: '#FFFFFF',
};

const darkColors = {
  background: '#000000',
  card: '#1C1C1E',
  cardElevated: '#2C2C2E',
  separator: 'rgba(84,84,88,0.65)',
  text: '#FFFFFF',
  textSecondary: 'rgba(235,235,245,0.6)',
  textTertiary: 'rgba(235,235,245,0.3)',
  accent: '#0A84FF',
  success: '#30D158',
  warning: '#FF9F0A',
  warningBg: 'rgba(255,159,10,0.15)',
  warningText: '#FFD8A8',
  warningTitle: '#FFB158',
  danger: '#FF453A',
  payout: '#30D158',
  optionSelectedBg: 'rgba(10,132,255,0.18)',
  glassTint: 'rgba(28,28,30,0.6)',
  inputBg: '#1C1C1E',
};

export type ThemeColors = typeof lightColors;

export function useTheme(): { colors: ThemeColors; scheme: 'light' | 'dark' } {
  const scheme = useColorScheme();
  return useMemo(
    () => ({
      colors: scheme === 'dark' ? darkColors : lightColors,
      scheme: scheme === 'dark' ? 'dark' : 'light',
    }),
    [scheme]
  );
}
