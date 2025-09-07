import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  List,
  Button,
  Surface,
  Chip,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useProgressData } from '../hooks/useSupabase';

export const ProfileScreen: React.FC = () => {
  const { patient, signOut } = useAuth();
  const { data: progressData } = useProgressData();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

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
      case 'vata': return 'Air & Space elements - Creative, energetic, quick-thinking';
      case 'pitta': return 'Fire & Water elements - Intense, focused, goal-oriented';
      case 'kapha': return 'Earth & Water elements - Calm, steady, nurturing';
      case 'tridosha': return 'Balanced constitution - Harmonious blend of all doshas';
      default: return '';
    }
  };

  const getDoshaCharacteristics = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return [
          'Light, thin build',
          'Creative and artistic',
          'Quick to learn and forget',
          'Tendency toward anxiety',
          'Irregular appetite and digestion',
        ];
      case 'pitta':
        return [
          'Medium build and strength',
          'Sharp intellect and memory',
          'Strong appetite and digestion',
          'Tendency toward anger and irritability',
          'Fair skin that burns easily',
        ];
      case 'kapha':
        return [
          'Solid, heavy build',
          'Calm and steady nature',
          'Slow to learn but good memory',
          'Tendency toward weight gain',
          'Strong, steady appetite',
        ];
      case 'tridosha':
        return [
          'Balanced physical constitution',
          'Adaptable to different situations',
          'Generally good health',
          'Rarely extreme in any direction',
          'Well-proportioned body',
        ];
      default:
        return [];
    }
  };

  if (!patient) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Profile Not Found
          </Text>
          <Text variant="bodyMedium" style={styles.errorText}>
            Unable to load your profile information.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Surface style={styles.avatarContainer}>
                <Text variant="headlineLarge" style={styles.avatarText}>
                  {patient.name.charAt(0).toUpperCase()}
                </Text>
              </Surface>
              <View style={styles.profileInfo}>
                <Text variant="headlineSmall" style={styles.profileName}>
                  {patient.name}
                </Text>
                <Text variant="bodyMedium" style={styles.profileEmail}>
                  {patient.email}
                </Text>
                {patient.phone && (
                  <Text variant="bodyMedium" style={styles.profilePhone}>
                    {patient.phone}
                  </Text>
                )}
              </View>
            </View>

            {/* Dosha Information */}
            <View style={styles.doshaSection}>
              <Chip
                mode="outlined"
                style={[
                  styles.doshaChip,
                  { borderColor: getDoshaColor(patient.primary_dosha) }
                ]}
                textStyle={{ color: getDoshaColor(patient.primary_dosha) }}
              >
                {patient.primary_dosha.charAt(0).toUpperCase() + patient.primary_dosha.slice(1)} Dosha
              </Chip>
              <Text variant="bodyMedium" style={styles.doshaDescription}>
                {getDoshaDescription(patient.primary_dosha)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Treatment Progress Summary */}
        {progressData && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Treatment Summary
              </Text>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text variant="headlineMedium" style={styles.progressNumber}>
                    {progressData.completedTherapies}
                  </Text>
                  <Text variant="bodyMedium" style={styles.progressLabel}>
                    Completed
                  </Text>
                </View>
                <View style={styles.progressStat}>
                  <Text variant="headlineMedium" style={styles.progressNumber}>
                    {progressData.totalTherapies}
                  </Text>
                  <Text variant="bodyMedium" style={styles.progressLabel}>
                    Total Sessions
                  </Text>
                </View>
                <View style={styles.progressStat}>
                  <Text variant="headlineMedium" style={styles.progressNumber}>
                    {Math.round(progressData.completionPercentage)}%
                  </Text>
                  <Text variant="bodyMedium" style={styles.progressLabel}>
                    Complete
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Dosha Characteristics */}
        <Card style={styles.characteristicsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Your Dosha Characteristics
            </Text>
            <Text variant="bodyMedium" style={styles.characteristicsDescription}>
              Understanding your dosha helps personalize your treatment and lifestyle recommendations.
            </Text>
            <List.Section>
              {getDoshaCharacteristics(patient.primary_dosha).map((characteristic, index) => (
                <List.Item
                  key={index}
                  title={characteristic}
                  left={(props) => <List.Icon {...props} icon="check-circle" color="#4CAF50" />}
                  style={styles.characteristicItem}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>

        {/* Personal Information */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Personal Information
            </Text>
            <List.Section>
              <List.Item
                title="Email"
                description={patient.email}
                left={(props) => <List.Icon {...props} icon="email" color="#2196F3" />}
              />
              {patient.phone && (
                <List.Item
                  title="Phone"
                  description={patient.phone}
                  left={(props) => <List.Icon {...props} icon="phone" color="#4CAF50" />}
                />
              )}
              {patient.date_of_birth && (
                <List.Item
                  title="Date of Birth"
                  description={new Date(patient.date_of_birth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  left={(props) => <List.Icon {...props} icon="cake" color="#FF9800" />}
                />
              )}
              {patient.address && (
                <List.Item
                  title="Address"
                  description={patient.address}
                  left={(props) => <List.Icon {...props} icon="map-marker" color="#F44336" />}
                />
              )}
            </List.Section>
          </Card.Content>
        </Card>

        {/* App Information */}
        <Card style={styles.appInfoCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              About AyurSutra
            </Text>
            <Text variant="bodyMedium" style={styles.appDescription}>
              Your personalized wellness companion for Ayurvedic treatment. Track your progress, 
              get AI-powered guidance, and stay connected with your healing journey.
            </Text>
            <Text variant="bodySmall" style={styles.appVersion}>
              Version 1.0.0
            </Text>
          </Card.Content>
        </Card>

        {/* Sign Out Button */}
        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.signOutButton}
          textColor="#F44336"
          icon="logout"
        >
          Sign Out
        </Button>
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
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    color: '#666',
  },
  doshaSection: {
    marginTop: 8,
  },
  doshaChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  doshaDescription: {
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  progressCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  progressLabel: {
    color: '#666',
    marginTop: 4,
  },
  characteristicsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  characteristicsDescription: {
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  characteristicItem: {
    paddingVertical: 2,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  appInfoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  appDescription: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  appVersion: {
    color: '#999',
    fontStyle: 'italic',
  },
  signOutButton: {
    marginTop: 8,
    marginBottom: 20,
    borderColor: '#F44336',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: '#F44336',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    color: '#666',
    textAlign: 'center',
  },
});