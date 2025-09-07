import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Chip,
  Button,
  Divider,
  List,
  Surface,
  Portal,
  Modal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Therapy, Feedback } from '../types';
import { useTherapyFeedback } from '../hooks/useSupabase';
import { LoadingIndicator } from '../components/LoadingIndicator';

interface RouteParams {
  therapyId: string;
}

export const TherapyDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { therapyId } = route.params as RouteParams;
  
  const [therapy, setTherapy] = useState<Therapy | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  
  const { data: existingFeedback } = useTherapyFeedback(therapyId);

  useEffect(() => {
    fetchTherapyDetails();
  }, [therapyId]);

  const fetchTherapyDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('therapies')
        .select('*')
        .eq('id', therapyId)
        .single();

      if (error) throw error;
      setTherapy(data);
    } catch (error) {
      console.error('Error fetching therapy details:', error);
      Alert.alert('Error', 'Failed to load therapy details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#2196F3';
      case 'in_progress':
        return '#FF9800';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'calendar-clock';
      case 'in_progress':
        return 'clock-outline';
      case 'completed':
        return 'check-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const handleFeedbackPress = () => {
    if (therapy?.status === 'completed') {
      if (existingFeedback) {
        Alert.alert(
          'Feedback Already Submitted',
          'You have already submitted feedback for this therapy session.',
          [{ text: 'OK' }]
        );
      } else {
        setFeedbackModalVisible(true);
      }
    } else {
      Alert.alert(
        'Feedback Not Available',
        'You can only submit feedback for completed therapy sessions.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleFeedbackSubmit = () => {
    setFeedbackModalVisible(false);
    navigation.navigate('Feedback' as never, { therapyId } as never);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!therapy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Therapy Not Found
          </Text>
          <Text variant="bodyMedium" style={styles.errorText}>
            The requested therapy session could not be found.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const { date, time } = formatDateTime(therapy.scheduled_date);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.titleContainer}>
              <Text variant="headlineSmall" style={styles.title}>
                {therapy.name}
              </Text>
              <Chip
                mode="outlined"
                style={[styles.statusChip, { borderColor: getStatusColor(therapy.status) }]}
                textStyle={{ color: getStatusColor(therapy.status) }}
                icon={getStatusIcon(therapy.status)}
              >
                {therapy.status.replace('_', ' ').toUpperCase()}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Scheduled Date & Time
                </Text>
                <Text variant="bodyLarge" style={styles.dateText}>
                  {date}
                </Text>
                <Text variant="bodyMedium" style={styles.timeText}>
                  {time}
                </Text>
              </View>

              <View style={styles.durationSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Duration
                </Text>
                <Text variant="headlineMedium" style={styles.durationText}>
                  {therapy.duration_minutes}
                </Text>
                <Text variant="bodyMedium" style={styles.durationLabel}>
                  minutes
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Description */}
        {therapy.description && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Description
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {therapy.description}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Precautions */}
        {therapy.precautions && therapy.precautions.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Important Precautions
              </Text>
              <Text variant="bodySmall" style={styles.precautionNote}>
                Please follow these precautions carefully for your safety and the best results.
              </Text>
              <List.Section>
                {therapy.precautions.map((precaution, index) => (
                  <List.Item
                    key={index}
                    title={precaution}
                    left={(props) => <List.Icon {...props} icon="alert-circle" color="#FF9800" />}
                    titleStyle={styles.precautionItem}
                  />
                ))}
              </List.Section>
            </Card.Content>
          </Card>
        )}

        {/* Notes */}
        {therapy.notes && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Additional Notes
              </Text>
              <Text variant="bodyMedium" style={styles.notes}>
                {therapy.notes}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Feedback Section */}
        {therapy.status === 'completed' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Session Feedback
              </Text>
              {existingFeedback ? (
                <Surface style={styles.feedbackSubmitted}>
                  <Text variant="bodyMedium" style={styles.feedbackSubmittedText}>
                    ✓ Thank you! Your feedback has been submitted.
                  </Text>
                  <Text variant="bodySmall" style={styles.feedbackRating}>
                    Rating: {existingFeedback.rating}/5 stars
                  </Text>
                </Surface>
              ) : (
                <View style={styles.feedbackContainer}>
                  <Text variant="bodyMedium" style={styles.feedbackText}>
                    Help us improve by sharing your experience with this therapy session.
                  </Text>
                  <Button
                    mode="contained"
                    onPress={handleFeedbackPress}
                    style={styles.feedbackButton}
                    icon="star-outline"
                  >
                    Submit Feedback
                  </Button>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {therapy.status === 'completed' && !existingFeedback && (
            <Button
              mode="contained"
              onPress={handleFeedbackPress}
              style={styles.actionButton}
              icon="star-outline"
            >
              Rate Session
            </Button>
          )}
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
            icon="arrow-left"
          >
            Back to Schedule
          </Button>
        </View>
      </ScrollView>

      {/* Feedback Modal */}
      <Portal>
        <Modal
          visible={feedbackModalVisible}
          onDismiss={() => setFeedbackModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Submit Feedback
              </Text>
              <Text variant="bodyMedium" style={styles.modalText}>
                Your feedback helps us improve our services and provides valuable insights to your practitioner.
              </Text>
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setFeedbackModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleFeedbackSubmit}
                  style={styles.modalButton}
                >
                  Continue
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
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
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginRight: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateSection: {
    flex: 1,
  },
  durationSection: {
    alignItems: 'center',
    marginLeft: 20,
  },
  sectionTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateText: {
    color: '#1B5E20',
    fontWeight: '600',
    marginBottom: 4,
  },
  timeText: {
    color: '#2E7D32',
  },
  durationText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  durationLabel: {
    color: '#666',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  description: {
    color: '#666',
    lineHeight: 22,
  },
  precautionNote: {
    color: '#FF9800',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  precautionItem: {
    color: '#E65100',
    fontSize: 14,
  },
  notes: {
    color: '#666',
    lineHeight: 22,
  },
  feedbackContainer: {
    alignItems: 'center',
  },
  feedbackText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  feedbackButton: {
    marginTop: 8,
  },
  feedbackSubmitted: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
  },
  feedbackSubmittedText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 4,
  },
  feedbackRating: {
    color: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
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
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
  },
  modalContainer: {
    margin: 20,
  },
  modalTitle: {
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});