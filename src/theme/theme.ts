import { MD3LightTheme } from 'react-native-paper';

// Ayurvedic Color Palette
const colors = {
  // Primary Colors - Healing Green
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  primaryContainer: '#E8F5E8',
  
  // Secondary Colors - Earthy Brown
  secondary: '#8D6E63',
  secondaryLight: '#A1887F',
  secondaryDark: '#5D4037',
  secondaryContainer: '#F5F5F5',
  
  // Tertiary Colors - Warm Gold
  tertiary: '#FF8F00',
  tertiaryLight: '#FFB74D',
  tertiaryDark: '#E65100',
  tertiaryContainer: '#FFF3E0',
  
  // Dosha Colors
  vata: '#8E24AA',      // Purple - Air & Space
  pitta: '#F57C00',     // Orange - Fire & Water
  kapha: '#1976D2',     // Blue - Earth & Water
  tridosha: '#388E3C',  // Green - Balanced
  
  // Neutral Colors
  surface: '#FFFFFF',
  surfaceVariant: '#F8F9FA',
  background: '#FAFAFA',
  backgroundGradient: ['#FAFAFA', '#F5F5F5'],
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Text Colors
  onSurface: '#1A1A1A',
  onSurfaceVariant: '#6C6C6C',
  onBackground: '#1A1A1A',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  
  // Border and Outline
  outline: '#E0E0E0',
  outlineVariant: '#F0F0F0',
  
  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
};

// Typography Scale
const typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  titleLarge: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  titleSmall: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
};

// Spacing Scale
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius Scale
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
};

// Shadow Presets
const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xlarge: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  roundness: borderRadius.md,
};

// Export individual design tokens
export { colors, typography, spacing, borderRadius, shadows };