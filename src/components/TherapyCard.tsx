import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Card,
  Text,
  Chip,
  IconButton,
} from 'react-native-paper';
import { Therapy } from '../types';

interface TherapyCardProps {
  therapy: Therapy;
  onPress: () => void;
}

export const TherapyCard: React.FC<TherapyCardProps> = ({ therapy, onPress }) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === -1) {
      return 'Yesterday';
    } else if (diffDays > 0) {
      return `In ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isUpcoming = therapy.status === 'scheduled' || therapy.status === 'in_progress';
  const isCompleted = therapy.status === 'completed';

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
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
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Text variant="bodyMedium" style={styles.dateLabel}>
              {isUpcoming ? 'Scheduled' : isCompleted ? 'Completed' : 'Date'}
            </Text>
            <Text variant="bodyLarge" style={styles.dateText}>
              {new Date(therapy.scheduled_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <Text variant="bodySmall" style={styles.relativeDate}>
              {formatDate(therapy.scheduled_date)} at {formatTime(therapy.scheduled_date)}
            </Text>
          </View>

          <View style={styles.durationContainer}>
            <Text variant="bodyMedium" style={styles.durationLabel}>
              Duration
            </Text>
            <Text variant="bodyLarge" style={styles.durationText}>
              {therapy.duration_minutes} min
            </Text>
          </View>
        </View>

        {therapy.description && (
          <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
            {therapy.description}
          </Text>
        )}

        {therapy.precautions && therapy.precautions.length > 0 && (
          <View style={styles.precautionsContainer}>
            <Text variant="bodySmall" style={styles.precautionsLabel}>
              Key Precautions:
            </Text>
            <Text variant="bodySmall" style={styles.precautionsText} numberOfLines={2}>
              {therapy.precautions.slice(0, 2).join(' • ')}
              {therapy.precautions.length > 2 && '...'}
            </Text>
          </View>
        )}

        {isCompleted && (
          <View style={styles.completedContainer}>
            <Text variant="bodySmall" style={styles.completedText}>
              ✓ Session completed successfully
            </Text>
          </View>
        )}
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <IconButton
          icon="chevron-right"
          size={20}
          onPress={onPress}
          style={styles.chevron}
        />
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  dateText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 2,
  },
  relativeDate: {
    color: '#999',
    fontSize: 12,
  },
  durationContainer: {
    alignItems: 'flex-end',
  },
  durationLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  durationText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  description: {
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  precautionsContainer: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  precautionsLabel: {
    color: '#E65100',
    fontWeight: '600',
    marginBottom: 2,
  },
  precautionsText: {
    color: '#E65100',
    fontSize: 12,
  },
  completedContainer: {
    backgroundColor: '#E8F5E8',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  completedText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  actions: {
    justifyContent: 'flex-end',
  },
  chevron: {
    margin: 0,
  },
});