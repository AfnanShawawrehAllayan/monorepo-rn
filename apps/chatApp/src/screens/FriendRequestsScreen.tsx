import { Button, Card, Spacer, Text } from '@components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList, Alert, RefreshControl } from 'react-native';

import { MainStackParamList } from '../navigation/types';
import { api } from '../store/api';
import { storage } from '../utils/storage';

type FriendRequestsScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'FriendRequests'
>;

interface DecodedToken {
  userId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface FriendRequest {
  _id: string;
  from: User; // Changed from 'sender' to 'from' to match backend
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const FriendRequestsScreen = () => {
  const navigation = useNavigation<FriendRequestsScreenNavigationProp>();
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get token and decode userId on mount
  useEffect(() => {
    const token = storage.getItem<string>('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('Decoded token userId:', decoded.userId);
      setUserId(decoded.userId);
    }
  }, []);

  // Use RTK Query hooks
  const {
    data: pendingRequests = [],
    isLoading,
    refetch,
    error,
  } = api.useGetPendingRequestsQuery(userId!, {
    skip: !userId,
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching pending requests:', error);
    }
    if (pendingRequests) {
      console.log('Pending requests:', pendingRequests);
    }
  }, [pendingRequests, error]);

  const [respondToRequest] = api.useRespondToRequestMutation();

  const handleRespondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    try {
      // Optimistically update the UI
      const optimisticUpdate = api.util.updateQueryData('getPendingRequests', userId, oldData => {
        return oldData?.filter(req => req._id !== requestId) ?? [];
      });

      // Start the mutation
      const result = await respondToRequest({ requestId, status, userId }).unwrap();

      // If successful, show success message
      Alert.alert(
        'Success',
        status === 'accepted' ? 'Friend request accepted!' : 'Friend request rejected',
      );

      // Manually refetch to ensure we have the latest data
      await refetch();
    } catch (error: any) {
      // If there's an error, revert the optimistic update
      api.util.invalidateTags(['FriendRequests']);

      console.error('Error responding to request:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to respond to request';
      Alert.alert('Error', errorMessage);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const renderRequestItem = ({ item }: { item: FriendRequest }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestHeader}>
        {item.from?.image ? (
          <Image source={{ uri: item.from.image }} style={styles.userImage} />
        ) : (
          <View style={styles.userImagePlaceholder}>
            <Text style={styles.userImageText}>
              {(item.from?.name || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.from?.name || 'Unknown User'}</Text>
          <Text style={styles.userEmail}>{item.from?.email || 'No email'}</Text>
          <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Button
          title="Accept"
          onPress={() => handleRespondToRequest(item._id, 'accepted')}
          variant="primary"
          style={styles.acceptButton}
        />
        <Spacer size="sm" />
        <Button
          title="Reject"
          onPress={() => handleRespondToRequest(item._id, 'rejected')}
          variant="outline"
          style={styles.rejectButton}
        />
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      <FlatList
        data={pendingRequests}
        renderItem={renderRequestItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pending friend requests</Text>
            <Spacer size="lg" />
            <Button
              title="Go to Home"
              onPress={() => navigation.navigate('Home')}
              variant="outline"
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  acceptButton: {
    minWidth: 100,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  messageContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginTop: 12,
    padding: 12,
  },
  messageText: {
    color: '#333',
    fontSize: 14,
    fontStyle: 'italic',
  },
  rejectButton: {
    minWidth: 100,
  },
  requestCard: {
    marginBottom: 12,
    padding: 16,
  },
  requestHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  userImage: {
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  userImagePlaceholder: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  userImageText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
