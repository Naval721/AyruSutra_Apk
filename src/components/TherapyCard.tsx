import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Card,
  Text,
  Chip,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Therapy } from '../types';
import { AnimatedCard } from './ui/AnimatedCard';

interface TherapyCardProps {
  therapy: Therapy;
  onPress: () => void;
}

export const TherapyCard: React.FC<TherapyCardProps> = ({ therapy, onPress }) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return theme.colors.info;
      case 'in_progress':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
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

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return theme.colors.info + '20';
      case 'in_progress':
        return theme.colors.warning + '20';
      case 'completed':
        return theme.colors.success + '20';
      case 'cancelled':
        return theme.colors.error + '20';
      default:
        return theme.colors.surfaceVariant;
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
  const statusColor = getStatusColor(therapy.status);
  const statusBgColor = getStatusBackgroundColor(therapy.status);

  return (
    <AnimatedCard
      style={[
        styles.card,
        { backgroundColor: statusBgColor }
      ]}
      onPress={onPress}
      animated
    >
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={2}>
              {therapy.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <MaterialCommunityIcons
                name={getStatusIcon(therapy.status)}
                size={16}
                color={theme.colors.surface}
              />
              <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                {therapy.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <View style={styles.dateHeader}>
              <MaterialCommunityIcons
                name="calendar"
                size={16}
                color={statusColor}
              />
              <Text style={[styles.dateLabel, { color: statusColor }]}>
                {isUpcoming ? 'Scheduled' : isCompleted ? 'Completed' : 'Date'}
              </Text>
            </View>
            <Text style={[styles.dateText, { color: theme.colors.onSurface }]}>
              {new Date(therapy.scheduled_date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <Text style={[styles.relativeDate, { color: theme.colors.onSurfaceVariant }]}>
              {formatDate(therapy.scheduled_date)} at {formatTime(therapy.scheduled_date)}
            </Text>
          </View>

          <View style={styles.durationContainer}>
            <View style={styles.durationHeader}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={statusColor}
              />
              <Text style={[styles.durationLabel, { color: statusColor }]}>
                Duration
              </Text>
            </View>
            <Text style={[styles.durationText, { color: theme.colors.onSurface }]}>
              {therapy.duration_minutes} min
            </Text>
          </View>
        </View>

        {/* Description */}
        {therapy.description && (
          <View style={styles.descriptionContainer}>
            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
              {therapy.description}
            </Text>
          </View>
        )}

        {/* Precautions */}
        {therapy.precautions && therapy.precautions.length > 0 && (
          <View style={[styles.precautionsContainer, { backgroundColor: theme.colors.warning + '15' }]}>
            <View style={styles.precautionsHeader}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color={theme.colors.warning}
              />
              <Text style={[styles.precautionsLabel, { color: theme.colors.warning }]}>
                Key Precautions
              </Text>
            </View>
            <Text style={[styles.precautionsText, { color: theme.colors.warning }]} numberOfLines={2}>
              {therapy.precautions.slice(0, 2).join(' • ')}
              {therapy.precautions.length > 2 && '...'}
            </Text>
          </View>
        )}

        {/* Completed Badge */}
        {isCompleted && (
          <View style={[styles.completedContainer, { backgroundColor: theme.colors.success + '20' }]}>
            <MaterialCommunityIcons
              name="check-circle"
              size={16}
              color={theme.colors.success}
            />
            <Text style={[styles.completedText, { color: theme.colors.success }]}>
              Session completed successfully
            </Text>
          </View>
        )}

        {/* Action Indicator */}
        <View style={styles.actionIndicator}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={statusColor}
          />
        </View>
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    position: 'relative',
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
    lineHeight: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  relativeDate: {
    fontSize: 12,
    fontWeight: '400',
  },
  durationContainer: {
    alignItems: 'flex-end',
  },
  durationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  durationLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  precautionsContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  precautionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  precautionsLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  precautionsText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionIndicator: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});