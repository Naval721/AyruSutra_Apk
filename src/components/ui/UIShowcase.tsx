import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCard } from './AnimatedCard';
import { GradientBackground } from './GradientBackground';
import { ProgressRing } from './ProgressRing';
import { FloatingActionButton } from './FloatingActionButton';

export const UIShowcase: React.FC = () => {
  const theme = useTheme();

  return (
    <GradientBackground variant="surface">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          🎨 Enhanced UI Components
        </Text>

        {/* Animated Cards */}
        <AnimatedCard style={styles.section} animated delay={0}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="card"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Animated Cards
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
            Smooth animations with spring physics and staggered delays for a delightful user experience.
          </Text>
        </AnimatedCard>

        {/* Progress Ring */}
        <AnimatedCard style={styles.section} animated delay={100}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="chart-donut"
              size={24}
              color={theme.colors.secondary}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
              Progress Ring
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={75}
              size={120}
              strokeWidth={8}
              color={theme.colors.primary}
              animated
            />
            <View style={styles.progressInfo}>
              <Text style={[styles.progressLabel, { color: theme.colors.onSurface }]}>
                Treatment Progress
              </Text>
              <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
                75% Complete
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Gradient Backgrounds */}
        <AnimatedCard style={styles.section} animated delay={200}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="gradient"
              size={24}
              color={theme.colors.tertiary}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.tertiary }]}>
              Gradient Backgrounds
            </Text>
          </View>
          <View style={styles.gradientShowcase}>
            <View style={[styles.gradientBox, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[styles.gradientLabel, { color: theme.colors.primary }]}>
                Primary
              </Text>
            </View>
            <View style={[styles.gradientBox, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Text style={[styles.gradientLabel, { color: theme.colors.secondary }]}>
                Secondary
              </Text>
            </View>
            <View style={[styles.gradientBox, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <Text style={[styles.gradientLabel, { color: theme.colors.tertiary }]}>
                Tertiary
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Design System */}
        <AnimatedCard style={styles.section} animated delay={300}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="palette"
              size={24}
              color={theme.colors.vata}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.vata }]}>
              Design System
            </Text>
          </View>
          <View style={styles.designSystem}>
            <View style={styles.colorPalette}>
              <Text style={[styles.paletteTitle, { color: theme.colors.onSurface }]}>
                Dosha Colors
              </Text>
              <View style={styles.colorRow}>
                <View style={[styles.colorSwatch, { backgroundColor: theme.colors.vata }]}>
                  <Text style={styles.colorLabel}>Vata</Text>
                </View>
                <View style={[styles.colorSwatch, { backgroundColor: theme.colors.pitta }]}>
                  <Text style={styles.colorLabel}>Pitta</Text>
                </View>
                <View style={[styles.colorSwatch, { backgroundColor: theme.colors.kapha }]}>
                  <Text style={styles.colorLabel}>Kapha</Text>
                </View>
                <View style={[styles.colorSwatch, { backgroundColor: theme.colors.tridosha }]}>
                  <Text style={styles.colorLabel}>Tridosha</Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedCard>

        {/* Typography */}
        <AnimatedCard style={styles.section} animated delay={400}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="format-text"
              size={24}
              color={theme.colors.kapha}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.kapha }]}>
              Typography Scale
            </Text>
          </View>
          <View style={styles.typographyShowcase}>
            <Text style={[styles.displayText, { color: theme.colors.onSurface }]}>
              Display Large
            </Text>
            <Text style={[styles.headlineText, { color: theme.colors.onSurface }]}>
              Headline Medium
            </Text>
            <Text style={[styles.titleText, { color: theme.colors.onSurface }]}>
              Title Large
            </Text>
            <Text style={[styles.bodyText, { color: theme.colors.onSurfaceVariant }]}>
              Body Medium - This is how body text appears in the app
            </Text>
            <Text style={[styles.labelText, { color: theme.colors.primary }]}>
              Label Large
            </Text>
          </View>
        </AnimatedCard>

        {/* Floating Action Button */}
        <View style={styles.fabContainer}>
          <FloatingActionButton
            icon="star"
            label="Enhanced UI"
            onPress={() => {}}
            variant="primary"
            size="large"
            animated
            delay={500}
          />
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  gradientShowcase: {
    flexDirection: 'row',
    gap: 12,
  },
  gradientBox: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  designSystem: {
    gap: 16,
  },
  colorPalette: {
    gap: 8,
  },
  paletteTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  colorSwatch: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  typographyShowcase: {
    gap: 8,
  },
  displayText: {
    fontSize: 32,
    fontWeight: '700',
  },
  headlineText: {
    fontSize: 20,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fabContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});