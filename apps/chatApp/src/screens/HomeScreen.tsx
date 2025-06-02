import { Card } from '@components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';

import { MainStackParamList } from '../navigation/types';
import { useAppDispatch } from '../store';
import {
  useGetCurrentUserQuery,
  useGetOtherUsersQuery,
  useSendFriendRequestMutation,
  useRespondToRequestMutation,
  useRemoveFriendMutation,
  useGetPendingRequestsQuery,
  useGetSentRequestsQuery,
  useCancelRequestMutation,
  api,
} from '../store/api';
import { logout } from '../store/slices/authSlice';
import { IUser } from '../types/user';
import { storage } from '../utils/storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState<string | null>(null);
  const { data: userData, refetch: refetchUser } = useGetCurrentUserQuery();
  const { data: otherUsers = [], refetch: refetchOtherUsers } = useGetOtherUsersQuery(
    userId ?? '',
    {
      skip: !userId,
    },
  );
  const [sendRequest] = useSendFriendRequestMutation();
  const [respondToRequest] = useRespondToRequestMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const { data: pendingRequests = [] } = useGetPendingRequestsQuery(userId ?? '', {
    skip: !userId,
  });
  const { data: sentRequests = [] } = useGetSentRequestsQuery(userId ?? '', {
    skip: !userId,
  });
  const [cancelRequest] = useCancelRequestMutation();

  useEffect(() => {
    const loadUserId = async () => {
      const token = await storage.getItem<string>('token');
      if (token) {
        const decoded = jwtDecode<{ userId: string }>(token);
        setUserId(decoded.userId);
      }
    };
    loadUserId();
  }, []);

  const handleLogout = async () => {
    await storage.removeItem('token');
    dispatch(logout());
    dispatch(api.util.resetApiState());
  };

  // Add a function to check if a user already has a pending/sent request
  const hasExistingRequest = React.useCallback(
    (userId: string) => {
      if (!pendingRequests || !sentRequests || !userId) return false;

      // Check if user has a pending request from us
      const hasPendingRequest = pendingRequests.some(
        req => req && req.from && req.from._id && req.from._id === userId,
      );

      // Check if we have a sent request to this user
      const hasSentRequest = sentRequests.some(
        req => req && req.from && req.from._id && req.from._id === userId,
      );

      return hasPendingRequest || hasSentRequest;
    },
    [pendingRequests, sentRequests],
  );

  const handleSendRequest = async (toUserId: string) => {
    if (!userId) return;

    // Check if there's already a request
    if (hasExistingRequest(toUserId)) {
      Alert.alert('Error', 'A friend request already exists for this user');
      return;
    }

    try {
      await sendRequest({
        senderId: userId,
        receiverId: toUserId,
        message: 'Would you like to chat?',
      }).unwrap();
      Alert.alert('Success', 'Friend request sent successfully');
      refetchOtherUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    if (!userId) return;
    try {
      await respondToRequest({
        userId,
        requestId,
        status: accept ? 'accepted' : 'rejected',
      }).unwrap();
      await refetchUser();
      Alert.alert('Success', accept ? 'Friend request accepted' : 'Friend request rejected');
    } catch (error) {
      console.error('Error responding to request:', error);
      Alert.alert('Error', 'Failed to respond to friend request');
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!userId) return;
    Alert.alert('Remove Friend', 'Are you sure you want to remove this friend?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeFriend({ userId, friendId }).unwrap();
            await refetchUser();
            Alert.alert('Success', 'Friend removed successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to remove friend');
          }
        },
      },
    ]);
  };

  // Add handler for canceling sent requests
  const handleCancelRequest = async (requestId: string) => {
    if (!userId) return;

    Alert.alert('Cancel Request', 'Are you sure you want to cancel this friend request?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelRequest({ userId, requestId }).unwrap();
            await refetchUser();
            Alert.alert('Success', 'Friend request cancelled successfully');
          } catch (error) {
            console.error('Error cancelling request:', error);
            Alert.alert('Error', 'Failed to cancel friend request');
          }
        },
      },
    ]);
  };

  const renderRequestItem = ({
    item: request,
  }: {
    item: {
      _id: string;
      from: IUser;
      message: string;
      status: 'pending' | 'accepted' | 'rejected';
    };
  }) => {
    if (!request || !request.from) return null;

    return (
      <Card style={styles.requestCard}>
        <View style={styles.requestInfo}>
          {request.from.image ? (
            <Image source={{ uri: request.from.image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{request.from.name?.[0]?.toUpperCase() ?? '?'}</Text>
            </View>
          )}
          <View style={styles.requestDetails}>
            <Text style={styles.requestName}>{request.from.name || 'Unknown User'}</Text>
            <Text style={styles.requestEmail}>{request.from.email || 'No email'}</Text>
            <Text style={styles.requestMessage}>{request.message || 'No message'}</Text>
            {request.status !== 'pending' && (
              <Text
                style={[
                  styles.requestStatus,
                  request.status === 'accepted' ? styles.statusAccepted : styles.statusRejected,
                ]}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Text>
            )}
          </View>
        </View>
        {request.status === 'pending' && (
          <View style={styles.requestButtons}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => request._id && handleRespondToRequest(request._id, true)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => request._id && handleRespondToRequest(request._id, false)}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    );
  };

  const renderSentRequestItem = ({
    item: request,
  }: {
    item: {
      _id: string;
      from: IUser;
      message: string;
      status: 'pending' | 'accepted' | 'rejected';
    };
  }) => {
    if (!request || !request.from) return null;

    return (
      <Card style={styles.requestCard}>
        <View style={styles.requestInfo}>
          {request.from.image ? (
            <Image source={{ uri: request.from.image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{request.from.name?.[0]?.toUpperCase() ?? '?'}</Text>
            </View>
          )}
          <View style={styles.requestDetails}>
            <Text style={styles.requestName}>{request.from.name || 'Unknown User'}</Text>
            <Text style={styles.requestEmail}>{request.from.email || 'No email'}</Text>
            <Text style={styles.requestMessage}>{request.message || 'No message'}</Text>
            <Text
              style={[
                styles.requestStatus,
                request.status === 'accepted'
                  ? styles.statusAccepted
                  : request.status === 'rejected'
                    ? styles.statusRejected
                    : styles.statusPending,
              ]}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Text>
          </View>
        </View>
        {request.status === 'pending' && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => request._id && handleCancelRequest(request._id)}
          >
            <Text style={styles.buttonText}>Cancel Request</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  const renderFriendItem = ({ item: friend }: { item: IUser }) => (
    <Card style={styles.friendCard}>
      <View style={styles.friendInfo}>
        {friend.image ? (
          <Image source={{ uri: friend.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{friend.name?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
        )}
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{friend.name}</Text>
          <Text style={styles.friendEmail}>{friend.email}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.chatButton]}
          onPress={() => navigation.navigate('ChatRoom', { chatId: friend._id })}
        >
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.removeButton]}
          onPress={() => handleRemoveFriend(friend._id)}
        >
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderUserItem = ({ item: user }: { item: IUser }) => {
    const hasRequest = hasExistingRequest(user._id);

    return (
      <Card style={styles.userCard}>
        <View style={styles.userInfo}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() ?? '?'}</Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.addButton, hasRequest && styles.disabledButton]}
          onPress={() => handleSendRequest(user._id)}
          disabled={hasRequest}
        >
          <Text style={[styles.buttonText, hasRequest && styles.disabledButtonText]}>
            {hasRequest ? 'Request Sent' : 'Add Friend'}
          </Text>
        </TouchableOpacity>
      </Card>
    );
  };

  // Filter other users to exclude friends and users with pending/sent requests
  const filteredOtherUsers = React.useMemo(() => {
    if (!otherUsers || !userData) return [];

    // Get IDs of users who are already friends
    const friendIds = new Set((userData.friends || []).map(friend => friend?._id).filter(Boolean));

    // Get IDs of users who have pending requests
    const pendingRequestIds = new Set(
      (pendingRequests || []).map(req => req?.from?._id).filter(Boolean),
    );

    // Get IDs of users who have sent requests
    const sentRequestIds = new Set((sentRequests || []).map(req => req?.from?._id).filter(Boolean));

    // Filter out users who are friends or have pending/sent requests
    return otherUsers.filter(
      user =>
        user &&
        user._id &&
        !friendIds.has(user._id) &&
        !pendingRequestIds.has(user._id) &&
        !sentRequestIds.has(user._id),
    );
  }, [otherUsers, userData, pendingRequests, sentRequests]);

  return (
    <View style={styles.container}>
      {userData && (
        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            {userData.image ? (
              <Image source={{ uri: userData.image }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.avatarPlaceholder]}>
                <Text style={styles.profileImageText}>
                  {userData.name?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
            )}
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileEmail}>{userData.email}</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Friend Requests Section - Always show at top */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          {pendingRequests.length > 0 && (
            <Text style={styles.requestCount}>({pendingRequests.length})</Text>
          )}
        </View>
        {pendingRequests.length > 0 ? (
          <FlatList
            data={pendingRequests}
            renderItem={renderRequestItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.emptyText}>No pending friend requests</Text>
        )}
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.friendRequestsButton}
            onPress={() => navigation.navigate('FriendRequests')}
          >
            <Text style={styles.friendRequestsButtonText}>
              All Requests {pendingRequests.length > 0 ? `(${pendingRequests.length})` : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sent Requests Section */}
      {sentRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sent Requests</Text>
          <FlatList
            data={sentRequests}
            renderItem={renderSentRequestItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {/* Rest of the sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Friends</Text>
        {userData?.friends && userData.friends.length > 0 ? (
          <FlatList
            data={userData.friends}
            renderItem={renderFriendItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.emptyText}>No friends yet</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Users</Text>
        {filteredOtherUsers.length > 0 ? (
          <FlatList
            data={filteredOtherUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.emptyText}>No other users available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  acceptButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    minWidth: 100,
  },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2196F3',
    marginTop: 8,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 25,
    height: 50,
    marginRight: 12,
    width: 50,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#666',
    fontSize: 24,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    minWidth: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFA500',
    marginTop: 8,
    width: '100%',
  },
  chatButton: {
    backgroundColor: '#4CAF50',
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#666666',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  friendCard: {
    marginBottom: 12,
    padding: 12,
  },
  friendDetails: {
    flex: 1,
  },
  friendEmail: {
    color: '#666',
    fontSize: 14,
  },
  friendInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendRequestsButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 8,
  },
  friendRequestsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonText: {
    color: '#ff4444',
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileDetails: {
    flex: 1,
  },
  profileEmail: {
    color: '#666',
    fontSize: 16,
  },
  profileImage: {
    alignItems: 'center',
    borderRadius: 40,
    height: 80,
    marginRight: 16,
    width: 80,
  },
  profileImageText: {
    color: '#666',
    fontSize: 32,
  },
  profileInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileName: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rejectButton: {
    backgroundColor: '#ff4444',
    flex: 1,
    minWidth: 100,
  },
  removeButton: {
    backgroundColor: '#ff4444',
  },
  requestButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  requestCard: {
    marginBottom: 12,
    marginRight: 12,
    padding: 12,
    width: 300,
  },
  requestCount: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  requestDetails: {
    flex: 1,
  },
  requestEmail: {
    color: '#666',
    fontSize: 14,
  },
  requestInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  requestMessage: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusAccepted: {
    color: '#4CAF50',
  },
  statusPending: {
    color: '#FFA500',
  },
  statusRejected: {
    color: '#ff4444',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userCard: {
    marginBottom: 12,
    padding: 12,
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
  },
  userInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
