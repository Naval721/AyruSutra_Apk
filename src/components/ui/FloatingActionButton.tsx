import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  animated?: boolean;
  delay?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  label,
  variant = 'primary',
  size = 'medium',
  position = 'bottom-right',
  animated = true,
  delay = 0,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(animated ? 0 : 1);
  const opacity = useSharedValue(animated ? 0 : 1);

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
        opacity.value = withTiming(1, { duration: 300 });
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [animated, delay]);

  const getSize = () => {
    switch (size) {
      case 'small': return 48;
      case 'large': return 64;
      default: return 56;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 28;
      default: return 24;
    }
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: theme.colors.secondary,
          text: theme.colors.onSecondary,
        };
      case 'tertiary':
        return {
          background: theme.colors.tertiary,
          text: theme.colors.onPrimary,
        };
      default:
        return {
          background: theme.colors.primary,
          text: theme.colors.onPrimary,
        };
    }
  };

  const getPosition = () => {
    const buttonSize = getSize();
    const margin = 16;
    
    switch (position) {
      case 'bottom-left':
        return { bottom: margin, left: margin };
      case 'top-right':
        return { top: margin, right: margin };
      case 'top-left':
        return { top: margin, left: margin };
      default:
        return { bottom: margin, right: margin };
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pressInStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [0.9, 0.95]) }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const colors = getVariantColors();
  const buttonSize = getSize();
  const iconSize = getIconSize();
  const positionStyle = getPosition();

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            backgroundColor: colors.background,
            borderRadius: buttonSize / 2,
          },
          theme.shadows.large,
          pressed && pressInStyle,
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          color={colors.text}
        />
      </Pressable>
      
      {label && (
        <Animated.View style={[styles.labelContainer, pressInStyle]}>
          <Animated.View
            style={[
              styles.label,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.labelText,
                { color: colors.text },
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  labelContainer: {
    position: 'absolute',
    right: 60,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
  },
});