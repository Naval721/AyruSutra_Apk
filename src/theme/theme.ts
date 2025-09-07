import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32', // Ayurvedic green
    primaryContainer: '#C8E6C9',
    secondary: '#8D6E63', // Earthy brown
    secondaryContainer: '#D7CCC8',
    tertiary: '#5D4037', // Dark brown
    tertiaryContainer: '#BCAAA4',
    surface: '#FFF8E1', // Warm cream
    surfaceVariant: '#F3E5AB',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
    onBackground: '#1C1B1F',
    onError: '#FFFFFF',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#A5D6A7',
    elevation: {
      level0: 'transparent',
      level1: '#FFF8E1',
      level2: '#FFF3C4',
      level3: '#FFEEB3',
      level4: '#FFE082',
      level5: '#FFD54F',
    },
  },
  roundness: 12,
};