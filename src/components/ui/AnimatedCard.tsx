import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  elevation?: number;
  animated?: boolean;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  style,
  elevation = 2,
  animated = true,
  delay = 0,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(animated ? 0.8 : 1);
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pressInStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0.8, 1], [0.95, 0.98]) }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withTiming(0.98, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }
  };

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.pressable,
            pressed && pressInStyle,
          ]}
        >
          <Card
            style={[
              styles.card,
              { elevation },
              theme.shadows.medium,
            ]}
            contentStyle={styles.cardContent}
          >
            {children}
          </Card>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Card
        style={[
          styles.card,
          { elevation },
          theme.shadows.medium,
        ]}
        contentStyle={styles.cardContent}
      >
        {children}
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
  },
});