import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  RadioButton,
  Surface,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Therapy } from '../types';
import { useSubmitFeedback } from '../hooks/useSupabase';
import { LoadingIndicator } from '../components/LoadingIndicator';

interface RouteParams {
  therapyId: string;
}

export const FeedbackScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { therapyId } = route.params as RouteParams;
  
  const [therapy, setTherapy] = useState<Therapy | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submitFeedbackMutation = useSubmitFeedback();

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
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!therapy) return;

    if (rating < 1 || rating > 5) {
      Alert.alert('Invalid Rating', 'Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedbackMutation.mutateAsync({
        therapyId: therapy.id,
        rating,
        comment: comment.trim() || undefined,
      });

      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. Your practitioner will review it.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingDescription = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Poor - The session did not meet my expectations';
      case 2:
        return 'Fair - The session was below average';
      case 3:
        return 'Good - The session was satisfactory';
      case 4:
        return 'Very Good - The session exceeded my expectations';
      case 5:
        return 'Excellent - The session was outstanding';
      default:
        return '';
    }
  };

  const getStarColor = (starRating: number) => {
    return starRating <= rating ? '#FFD700' : '#E0E0E0';
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Therapy Information */}
        <Card style={styles.therapyCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.therapyTitle}>
              {therapy.name}
            </Text>
            <Text variant="bodyMedium" style={styles.therapyDate}>
              Completed on {new Date(therapy.scheduled_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text variant="bodySmall" style={styles.therapyDuration}>
              Duration: {therapy.duration_minutes} minutes
            </Text>
          </Card.Content>
        </Card>

        {/* Rating Section */}
        <Card style={styles.ratingCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              How would you rate this session?
            </Text>
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              Your feedback helps us improve our services
            </Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  mode="text"
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                  icon="star"
                  iconColor={getStarColor(star)}
                  labelStyle={[styles.starLabel, { color: getStarColor(star) }]}
                >
                  {star}
                </Button>
              ))}
            </View>

            <Surface style={styles.ratingDescription}>
              <Text variant="bodyMedium" style={styles.ratingText}>
                {getRatingDescription(rating)}
              </Text>
            </Surface>
          </Card.Content>
        </Card>

        {/* Comment Section */}
        <Card style={styles.commentCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Additional Comments (Optional)
            </Text>
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              Share specific details about your experience
            </Text>

            <TextInput
              label="Your feedback"
              value={comment}
              onChangeText={setComment}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Tell us about your experience, what went well, or any suggestions for improvement..."
              style={styles.commentInput}
              maxLength={500}
            />

            <Text variant="bodySmall" style={styles.characterCount}>
              {comment.length}/500 characters
            </Text>
          </Card.Content>
        </Card>

        {/* Privacy Notice */}
        <Card style={styles.privacyCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.privacyText}>
              Your feedback is confidential and will be shared only with your practitioner 
              to help improve your treatment experience. We value your input and use it 
              to enhance our services.
            </Text>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          Submit Feedback
        </Button>

        {submitting && <LoadingIndicator />}
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
  therapyCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#E8F5E8',
  },
  therapyTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  therapyDate: {
    color: '#1B5E20',
    marginBottom: 4,
  },
  therapyDuration: {
    color: '#4CAF50',
  },
  ratingCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 4,
  },
  starLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingDescription: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  ratingText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  commentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  commentInput: {
    marginTop: 12,
  },
  characterCount: {
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  privacyCard: {
    marginBottom: 16,
    elevation: 1,
    backgroundColor: '#F5F5F5',
  },
  privacyText: {
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
  },
  submitButton: {
    marginBottom: 20,
  },
  submitButtonContent: {
    paddingVertical: 8,
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
});