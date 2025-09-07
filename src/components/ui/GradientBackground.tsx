import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'surface' | 'custom';
  colors?: string[];
  style?: any;
}

const { width, height } = Dimensions.get('window');

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'surface',
  colors,
  style,
}) => {
  const theme = useTheme();

  const getGradientColors = () => {
    if (colors) return colors;

    switch (variant) {
      case 'primary':
        return [theme.colors.primaryContainer, theme.colors.primaryLight];
      case 'secondary':
        return [theme.colors.secondaryContainer, theme.colors.secondaryLight];
      case 'surface':
        return theme.colors.backgroundGradient || [theme.colors.surface, theme.colors.surfaceVariant];
      default:
        return [theme.colors.surface, theme.colors.surfaceVariant];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    minHeight: height,
  },
});