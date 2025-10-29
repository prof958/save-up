// Theme constants for Save Up app

export const colors = {
  // Base colors
  background: '#fdfffc',
  dark: '#011627',
  accent: '#2ec4b6',
  alert: '#e71d36',
  
  // Text colors
  textPrimary: '#011627',
  textLight: '#fdfffc',
  textSecondary: 'rgba(1, 22, 39, 0.6)',
  textMuted: 'rgba(1, 22, 39, 0.4)',
  
  // Button colors
  primaryButton: '#2ec4b6',
  alertButton: '#e71d36',
  
  // State colors
  active: '#2ec4b6',
  inactive: 'rgba(1, 22, 39, 0.4)',
  error: '#e71d36',
  
  // Surface colors
  surface: '#ffffff',
  surfaceElevated: '#fdfffc',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  round: 999,
} as const;

export const fontSize = {
  heading1: 32,
  heading2: 28,
  heading3: 24,
  bodyLarge: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  label: 14,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const shadow = {
  small: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  medium: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // Android
  },
} as const;

// Export type for colors
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
