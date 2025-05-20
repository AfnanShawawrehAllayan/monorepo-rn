import { useNavigation } from '@react-navigation/native';
import { Card, Spacer } from 'components';
import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

import type { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

const mockChats: ChatItem[] = [
  {
    id: '0',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: '10:30 AM',
  },
  {
    id: '1',
    name: 'Jane Smith',
    lastMessage: 'See you tomorrow!',
    timestamp: '9:45 AM',
  },
];

type ChatListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatList'>;

const COLORS = {
  background: '#f5f5f5',
  text: '#666',
  subtitle: '#999',
};

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      testID={`chatItem-${item.id}`}
      onPress={() => navigation.navigate('ChatRoom', { chatId: item.id })}
    >
      <Card>
        <View style={styles.chatItem}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Spacer size="xs" />
            <Text style={styles.message}>{item.lastMessage}</Text>
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </Card>
      <Spacer size="sm" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        testID="chatList"
        data={mockChats}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  message: {
    color: COLORS.text,
    fontSize: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: COLORS.subtitle,
    fontSize: 12,
  },
});
