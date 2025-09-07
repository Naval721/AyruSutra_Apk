import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  ProgressBar,
  Chip,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useUpcomingTherapies, useProgressData } from '../hooks/useSupabase';
import { LoadingIndicator } from '../components/LoadingIndicator';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
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
      case 'vata': return '#8E24AA';
      case 'pitta': return '#F57C00';
      case 'kapha': return '#1976D2';
      case 'tridosha': return '#388E3C';
      default: return '#666';
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.welcomeTitle}>
              Welcome back, {patient?.name}!
            </Text>
            <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
              Your wellness journey continues
            </Text>
            
            {patient?.primary_dosha && (
              <View style={styles.doshaSection}>
                <Chip
                  mode="outlined"
                  style={[styles.doshaChip, { borderColor: getDoshaColor(patient.primary_dosha) }]}
                  textStyle={{ color: getDoshaColor(patient.primary_dosha) }}
                >
                  {patient.primary_dosha.charAt(0).toUpperCase() + patient.primary_dosha.slice(1)} Dosha
                </Chip>
                <Text variant="bodySmall" style={styles.doshaDescription}>
                  {getDoshaDescription(patient.primary_dosha)}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {progressData?.completedTherapies || 0}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Therapies Completed
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {progressData?.upcomingTherapies || 0}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Upcoming Sessions
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Progress Overview */}
        {progressData && progressData.totalTherapies > 0 && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.progressTitle}>
                Treatment Progress
              </Text>
              <View style={styles.progressContainer}>
                <ProgressBar
                  progress={progressData.completionPercentage / 100}
                  color="#2E7D32"
                  style={styles.progressBar}
                />
                <Text variant="bodyMedium" style={styles.progressText}>
                  {Math.round(progressData.completionPercentage)}% Complete
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Next Therapy */}
        {nextTherapy ? (
          <Card style={styles.nextTherapyCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.nextTherapyTitle}>
                Next Therapy Session
              </Text>
              <Text variant="headlineSmall" style={styles.therapyName}>
                {nextTherapy.name}
              </Text>
              <Text variant="bodyMedium" style={styles.therapyDate}>
                {new Date(nextTherapy.scheduled_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text variant="bodySmall" style={styles.therapyDuration}>
                Duration: {nextTherapy.duration_minutes} minutes
              </Text>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Schedule' as never, { screen: 'TherapyDetail', params: { therapyId: nextTherapy.id } } as never)}
                style={styles.viewDetailsButton}
              >
                View Details
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.noTherapyCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.noTherapyTitle}>
                No Upcoming Therapies
              </Text>
              <Text variant="bodyMedium" style={styles.noTherapyText}>
                Your therapy schedule is clear. Check back later for updates.
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Schedule' as never)}
            style={styles.actionButton}
            icon="calendar-clock"
          >
            View Schedule
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Progress' as never)}
            style={styles.actionButton}
            icon="chart-line"
          >
            Track Progress
          </Button>
        </View>

        {isLoading && <LoadingIndicator />}
      </ScrollView>

      {/* FAB for AI Chat */}
      <FAB
        icon="chat"
        style={styles.fab}
        onPress={() => navigation.navigate('Chat' as never)}
        label="AI Assistant"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  welcomeTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    color: '#666',
    marginTop: 4,
  },
  doshaSection: {
    marginTop: 16,
  },
  doshaChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  doshaDescription: {
    color: '#666',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  progressCard: {
    marginBottom: 16,
    elevation: 2,
  },
  progressTitle: {
    color: '#2E7D32',
    marginBottom: 12,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    color: '#666',
    textAlign: 'center',
  },
  nextTherapyCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#E8F5E8',
  },
  nextTherapyTitle: {
    color: '#2E7D32',
    marginBottom: 8,
  },
  therapyName: {
    color: '#1B5E20',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  therapyDate: {
    color: '#2E7D32',
    marginBottom: 4,
  },
  therapyDuration: {
    color: '#666',
    marginBottom: 16,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
  },
  noTherapyCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#F5F5F5',
  },
  noTherapyTitle: {
    color: '#666',
    marginBottom: 8,
  },
  noTherapyText: {
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 80,
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});