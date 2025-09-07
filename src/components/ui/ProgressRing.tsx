import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  delay?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  color,
  backgroundColor,
  animated = true,
  delay = 0,
}) => {
  const theme = useTheme();
  const animatedProgress = useSharedValue(0);
  const scale = useSharedValue(animated ? 0.8 : 1);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        animatedProgress.value = withTiming(progress, {
          duration: 1500,
          easing: Easing.out(Easing.cubic),
        });
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      }, delay);

      return () => clearTimeout(timer);
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated, delay]);

  const animatedProps = useAnimatedProps(() => {
    const currentProgress = animated ? animatedProgress.value : progress;
    const currentStrokeDashoffset = circumference - (currentProgress / 100) * circumference;
    
    return {
      strokeDashoffset: currentStrokeDashoffset,
    };
  });

  const animatedScaleProps = useAnimatedProps(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={animatedScaleProps}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor || theme.colors.outlineVariant}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color || theme.colors.primary}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            animatedProps={animatedProps}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </Animated.View>
      
      {showPercentage && (
        <View style={styles.percentageContainer}>
          <Text
            variant="headlineMedium"
            style={[
              styles.percentageText,
              { color: color || theme.colors.primary }
            ]}
          >
            {Math.round(progress)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontWeight: '700',
  },
});