import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  ProgressBar,
  Chip,
  FAB,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useUpcomingTherapies, useProgressData } from '../hooks/useSupabase';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { GradientBackground } from '../components/ui/GradientBackground';
import { ProgressRing } from '../components/ui/ProgressRing';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';

const { width } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { patient } = useAuth();
  const { data: upcomingTherapies, isLoading: therapiesLoading, refetch: refetchTherapies } = useUpcomingTherapies();
  const { data: progressData, isLoading: progressLoading, refetch: refetchProgress } = useProgressData();

  const handleRefresh = () => {
    refetchTherapies();
    refetchProgress();
  };

  const isLoading = therapiesLoading || progressLoading;

  const nextTherapy = upcomingTherapies?.[0];

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata': return theme.colors.vata;
      case 'pitta': return theme.colors.pitta;
      case 'kapha': return theme.colors.kapha;
      case 'tridosha': return theme.colors.tridosha;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const getDoshaDescription = (dosha: string) => {
    switch (dosha) {
      case 'vata': return 'Air & Space - Creative, energetic, quick-thinking';
      case 'pitta': return 'Fire & Water - Intense, focused, goal-oriented';
      case 'kapha': return 'Earth & Water - Calm, steady, nurturing';
      case 'tridosha': return 'Balanced - Harmonious blend of all doshas';
      default: return '';
    }
  };

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case 'vata': return 'weather-windy';
      case 'pitta': return 'fire';
      case 'kapha': return 'water';
      case 'tridosha': return 'balance';
      default: return 'help-circle';
    }
  };

  return (
    <GradientBackground variant="surface">
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <AnimatedCard style={styles.headerCard} animated delay={0}>
            <View style={styles.headerContent}>
              <View style={styles.welcomeSection}>
                <Text style={[styles.welcomeTitle, { color: theme.colors.primary }]}>
                  Welcome back, {patient?.name}! 👋
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                  Your wellness journey continues
                </Text>
              </View>
              
              {patient?.primary_dosha && (
                <View style={styles.doshaSection}>
                  <Chip
                    mode="outlined"
                    style={[
                      styles.doshaChip,
                      { borderColor: getDoshaColor(patient.primary_dosha) }
                    ]}
                    textStyle={{ color: getDoshaColor(patient.primary_dosha) }}
                    icon={getDoshaIcon(patient.primary_dosha)}
                  >
                    {patient.primary_dosha.charAt(0).toUpperCase() + patient.primary_dosha.slice(1)}
                  </Chip>
                </View>
              )}
            </View>
          </AnimatedCard>

          {/* Progress Ring Section */}
          {progressData && progressData.totalTherapies > 0 && (
            <AnimatedCard style={styles.progressCard} animated delay={100}>
              <View style={styles.progressContent}>
                <View style={styles.progressInfo}>
                  <Text style={[styles.progressTitle, { color: theme.colors.primary }]}>
                    Treatment Progress
                  </Text>
                  <Text style={[styles.progressSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                    {progressData.completedTherapies} of {progressData.totalTherapies} sessions completed
                  </Text>
                </View>
                <ProgressRing
                  progress={progressData.completionPercentage}
                  size={100}
                  strokeWidth={8}
                  color={theme.colors.primary}
                  animated
                />
              </View>
            </AnimatedCard>
          )}

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <AnimatedCard style={styles.statCard} animated delay={200}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {progressData?.completedTherapies || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Completed
                </Text>
              </View>
            </AnimatedCard>

            <AnimatedCard style={styles.statCard} animated delay={250}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={24}
                    color={theme.colors.tertiary}
                  />
                </View>
                <Text style={[styles.statNumber, { color: theme.colors.tertiary }]}>
                  {progressData?.upcomingTherapies || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Upcoming
                </Text>
              </View>
            </AnimatedCard>
          </View>

          {/* Next Therapy */}
          {nextTherapy ? (
            <AnimatedCard
              style={[styles.nextTherapyCard, { backgroundColor: theme.colors.primaryContainer }]}
              animated
              delay={300}
              onPress={() => navigation.navigate('Schedule' as never, { screen: 'TherapyDetail', params: { therapyId: nextTherapy.id } } as never)}
            >
              <View style={styles.nextTherapyContent}>
                <View style={styles.nextTherapyHeader}>
                  <MaterialCommunityIcons
                    name="calendar-star"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.nextTherapyTitle, { color: theme.colors.primary }]}>
                    Next Session
                  </Text>
                </View>
                <Text style={[styles.therapyName, { color: theme.colors.primaryDark }]}>
                  {nextTherapy.name}
                </Text>
                <Text style={[styles.therapyDate, { color: theme.colors.primary }]}>
                  {new Date(nextTherapy.scheduled_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <View style={styles.therapyDetails}>
                  <View style={styles.therapyDetailItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text style={[styles.therapyDuration, { color: theme.colors.onSurfaceVariant }]}>
                      {nextTherapy.duration_minutes} min
                    </Text>
                  </View>
                </View>
              </View>
            </AnimatedCard>
          ) : (
            <AnimatedCard style={styles.noTherapyCard} animated delay={300}>
              <View style={styles.noTherapyContent}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={48}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text style={[styles.noTherapyTitle, { color: theme.colors.onSurfaceVariant }]}>
                  No Upcoming Sessions
                </Text>
                <Text style={[styles.noTherapyText, { color: theme.colors.onSurfaceVariant }]}>
                  Your schedule is clear. Check back for updates.
                </Text>
              </View>
            </AnimatedCard>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <AnimatedCard
              style={styles.actionCard}
              animated
              delay={400}
              onPress={() => navigation.navigate('Schedule' as never)}
            >
              <View style={styles.actionContent}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>
                  View Schedule
                </Text>
              </View>
            </AnimatedCard>

            <AnimatedCard
              style={styles.actionCard}
              animated
              delay={450}
              onPress={() => navigation.navigate('Progress' as never)}
            >
              <View style={styles.actionContent}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={24}
                  color={theme.colors.secondary}
                />
                <Text style={[styles.actionText, { color: theme.colors.secondary }]}>
                  Track Progress
                </Text>
              </View>
            </AnimatedCard>
          </View>

          {isLoading && <LoadingIndicator />}
        </ScrollView>

        {/* Floating Action Button for AI Chat */}
        <FloatingActionButton
          icon="chat"
          label="AI Assistant"
          onPress={() => navigation.navigate('Chat' as never)}
          variant="primary"
          size="large"
          animated
          delay={500}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  doshaSection: {
    marginLeft: 12,
  },
  doshaChip: {
    alignSelf: 'flex-start',
  },
  progressCard: {
    marginBottom: 20,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressInfo: {
    flex: 1,
    marginRight: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  nextTherapyCard: {
    marginBottom: 20,
  },
  nextTherapyContent: {
    padding: 4,
  },
  nextTherapyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextTherapyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  therapyName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  therapyDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  therapyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapyDuration: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 4,
  },
  noTherapyCard: {
    marginBottom: 20,
  },
  noTherapyContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noTherapyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  noTherapyText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 100,
  },
  actionCard: {
    flex: 1,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});