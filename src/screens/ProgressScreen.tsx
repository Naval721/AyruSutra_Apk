import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  ProgressBar,
  Surface,
  List,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressData, useCompletedTherapies } from '../hooks/useSupabase';
import { LoadingIndicator } from '../components/LoadingIndicator';

export const ProgressScreen: React.FC = () => {
  const { data: progressData, isLoading: progressLoading, refetch: refetchProgress } = useProgressData();
  const { data: completedTherapies, isLoading: therapiesLoading, refetch: refetchTherapies } = useCompletedTherapies();

  const isLoading = progressLoading || therapiesLoading;

  const handleRefresh = () => {
    refetchProgress();
    refetchTherapies();
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#8BC34A';
    if (percentage >= 40) return '#FFC107';
    if (percentage >= 20) return '#FF9800';
    return '#FF5722';
  };

  const getProgressMessage = (percentage: number) => {
    if (percentage === 0) return "Your wellness journey is just beginning!";
    if (percentage < 25) return "Great start! You're building healthy habits.";
    if (percentage < 50) return "You're making steady progress. Keep it up!";
    if (percentage < 75) return "Excellent progress! You're more than halfway there.";
    if (percentage < 100) return "Almost there! You're doing amazing.";
    return "Congratulations! You've completed your treatment program!";
  };

  const getMotivationalQuote = (percentage: number) => {
    const quotes = [
      "Health is not just the absence of disease, but the presence of vitality.",
      "The body is a temple, and we must treat it with respect and care.",
      "Small steps lead to big changes in your wellness journey.",
      "Consistency is the key to unlocking your body's natural healing power.",
      "Every therapy session is a step closer to your optimal health.",
      "Your commitment to healing is inspiring and transformative.",
    ];
    
    const index = Math.floor((percentage / 100) * quotes.length);
    return quotes[Math.min(index, quotes.length - 1)];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Progress Overview */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.progressTitle}>
              Treatment Progress
            </Text>
            
            {progressData && (
              <>
                <View style={styles.progressContainer}>
                  <ProgressBar
                    progress={progressData.completionPercentage / 100}
                    color={getProgressColor(progressData.completionPercentage)}
                    style={styles.progressBar}
                  />
                  <Text variant="headlineLarge" style={[
                    styles.progressPercentage,
                    { color: getProgressColor(progressData.completionPercentage) }
                  ]}>
                    {Math.round(progressData.completionPercentage)}%
                  </Text>
                </View>

                <Text variant="bodyLarge" style={styles.progressMessage}>
                  {getProgressMessage(progressData.completionPercentage)}
                </Text>

                <Surface style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text variant="headlineMedium" style={styles.statNumber}>
                      {progressData.completedTherapies}
                    </Text>
                    <Text variant="bodyMedium" style={styles.statLabel}>
                      Completed
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text variant="headlineMedium" style={styles.statNumber}>
                      {progressData.totalTherapies}
                    </Text>
                    <Text variant="bodyMedium" style={styles.statLabel}>
                      Total Sessions
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text variant="headlineMedium" style={styles.statNumber}>
                      {progressData.upcomingTherapies}
                    </Text>
                    <Text variant="bodyMedium" style={styles.statLabel}>
                      Remaining
                    </Text>
                  </View>
                </Surface>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Motivational Quote */}
        {progressData && (
          <Card style={styles.quoteCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.quoteText}>
                "{getMotivationalQuote(progressData.completionPercentage)}"
              </Text>
              <Text variant="bodySmall" style={styles.quoteSource}>
                — Ayurvedic Wisdom
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Recent Completions */}
        {completedTherapies && completedTherapies.length > 0 && (
          <Card style={styles.completionsCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.completionsTitle}>
                Recent Completions
              </Text>
              <Text variant="bodyMedium" style={styles.completionsSubtitle}>
                Your latest therapy achievements
              </Text>

              <List.Section>
                {completedTherapies.slice(0, 5).map((therapy, index) => (
                  <List.Item
                    key={therapy.id}
                    title={therapy.name}
                    description={`Completed on ${new Date(therapy.scheduled_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}`}
                    left={(props) => (
                      <List.Icon 
                        {...props} 
                        icon="check-circle" 
                        color="#4CAF50" 
                      />
                    )}
                    right={() => (
                      <Chip
                        mode="outlined"
                        style={styles.completionChip}
                        textStyle={styles.completionChipText}
                      >
                        ✓ Done
                      </Chip>
                    )}
                    style={styles.completionItem}
                  />
                ))}
              </List.Section>

              {completedTherapies.length > 5 && (
                <Text variant="bodySmall" style={styles.moreCompletions}>
                  And {completedTherapies.length - 5} more completed sessions
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Wellness Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.tipsTitle}>
              Wellness Tips
            </Text>
            <Text variant="bodyMedium" style={styles.tipsSubtitle}>
              Continue your healing journey with these practices
            </Text>

            <List.Section>
              <List.Item
                title="Stay Hydrated"
                description="Drink warm water throughout the day to support digestion"
                left={(props) => <List.Icon {...props} icon="cup-water" color="#2196F3" />}
              />
              <List.Item
                title="Practice Mindfulness"
                description="Take 5-10 minutes daily for meditation or deep breathing"
                left={(props) => <List.Icon {...props} icon="meditation" color="#4CAF50" />}
              />
              <List.Item
                title="Follow Your Diet"
                description="Stick to dosha-specific dietary recommendations"
                left={(props) => <List.Icon {...props} icon="food-apple" color="#FF9800" />}
              />
              <List.Item
                title="Get Adequate Rest"
                description="Ensure 7-8 hours of quality sleep each night"
                left={(props) => <List.Icon {...props} icon="sleep" color="#9C27B0" />}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {isLoading && <LoadingIndicator />}
      </ScrollView>
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
  progressCard: {
    marginBottom: 16,
    elevation: 2,
  },
  progressTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  progressPercentage: {
    fontWeight: 'bold',
    fontSize: 48,
  },
  progressMessage: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  quoteCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFF8E1',
  },
  quoteText: {
    color: '#E65100',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteSource: {
    color: '#FF8F00',
    textAlign: 'center',
    fontWeight: '600',
  },
  completionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  completionsTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completionsSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  completionItem: {
    paddingVertical: 4,
  },
  completionChip: {
    alignSelf: 'center',
    backgroundColor: '#E8F5E8',
  },
  completionChipText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  moreCompletions: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  tipsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  tipsTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipsSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
});