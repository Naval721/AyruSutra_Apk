import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  Chip,
  FAB,
  Searchbar,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTherapies, useUpcomingTherapies, useCompletedTherapies } from '../hooks/useSupabase';
import { Therapy } from '../types';
import { TherapyCard } from '../components/TherapyCard';
import { LoadingIndicator } from '../components/LoadingIndicator';

type FilterType = 'all' | 'upcoming' | 'completed';

export const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const { data: allTherapies, isLoading: allLoading, refetch: refetchAll } = useTherapies();
  const { data: upcomingTherapies, isLoading: upcomingLoading, refetch: refetchUpcoming } = useUpcomingTherapies();
  const { data: completedTherapies, isLoading: completedLoading, refetch: refetchCompleted } = useCompletedTherapies();

  const isLoading = allLoading || upcomingLoading || completedLoading;

  const getFilteredTherapies = (): Therapy[] => {
    let therapies: Therapy[] = [];
    
    switch (filter) {
      case 'upcoming':
        therapies = upcomingTherapies || [];
        break;
      case 'completed':
        therapies = completedTherapies || [];
        break;
      case 'all':
      default:
        therapies = allTherapies || [];
        break;
    }

    if (searchQuery.trim()) {
      therapies = therapies.filter(therapy =>
        therapy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapy.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return therapies;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchAll(),
        refetchUpcoming(),
        refetchCompleted(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const renderTherapyCard = ({ item }: { item: Therapy }) => (
    <TherapyCard
      therapy={item}
      onPress={() => navigation.navigate('TherapyDetail' as never, { therapyId: item.id } as never)}
    />
  );

  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      if (searchQuery.trim()) {
        return 'No therapies found matching your search';
      }
      
      switch (filter) {
        case 'upcoming':
          return 'No upcoming therapies scheduled';
        case 'completed':
          return 'No completed therapies yet';
        case 'all':
        default:
          return 'No therapies found';
      }
    };

    return (
      <View style={styles.emptyState}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          {getEmptyMessage()}
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtitle}>
          {filter === 'upcoming' 
            ? 'Your practitioner will schedule new sessions soon'
            : 'Your therapy sessions will appear here once completed'
          }
        </Text>
      </View>
    );
  };

  const getStatusCounts = () => {
    const all = allTherapies || [];
    return {
      total: all.length,
      upcoming: all.filter(t => t.status === 'scheduled' || t.status === 'in_progress').length,
      completed: all.filter(t => t.status === 'completed').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Therapy Schedule
        </Text>
        
        {/* Search Bar */}
        <Searchbar
          placeholder="Search therapies..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {/* Filter Buttons */}
        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
          buttons={[
            {
              value: 'upcoming',
              label: `Upcoming (${statusCounts.upcoming})`,
            },
            {
              value: 'completed',
              label: `Completed (${statusCounts.completed})`,
            },
            {
              value: 'all',
              label: `All (${statusCounts.total})`,
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <FlatList
        data={getFilteredTherapies()}
        renderItem={renderTherapyCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {isLoading && <LoadingIndicator />}

      {/* FAB for AI Chat */}
      <FAB
        icon="chat"
        style={styles.fab}
        onPress={() => navigation.navigate('Dashboard' as never, { screen: 'Chat' } as never)}
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
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#999',
    textAlign: 'center',
    maxWidth: 300,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});