import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';

import SocketService from '../services/socketService';

const socketService = SocketService.getInstance();

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [user, setUser] = useState<User>({
    _id: '',
    name: 'User',
  });

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get or create user ID
        let userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          userId = Math.random().toString(36).substring(7);
          await AsyncStorage.setItem('userId', userId);
        }

        setUser({
          _id: userId,
          name: `User ${userId.slice(0, 4)}`,
        });

        // Connect to socket server
        const socket = socketService.connect(userId);

        // Listen for new messages
        socketService.on('message', (message: IMessage) => {
          setMessages(previousMessages => GiftedChat.append(previousMessages, [message]));
        });

        // Load previous messages (you can implement this with your backend)
        // For now, we'll just show a welcome message
        setMessages([
          {
            _id: 1,
            text: 'Welcome to the chat!',
            createdAt: new Date(),
            user: {
              _id: 'system',
              name: 'System',
            },
          },
        ]);

        return () => {
          socketService.disconnect();
        };
      } catch (error) {
        Alert.alert('Error', 'Failed to initialize chat');
      }
    };

    initializeChat();
  }, []);

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      const message = newMessages[0];
      if (message) {
        // Send message to server
        socketService.emit('message', {
          ...message,
          user,
        });

        // Add message to local state
        setMessages(previousMessages => GiftedChat.append(previousMessages, [message]));
      }
    },
    [user],
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        renderAvatar={null}
        alwaysShowSend
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default ChatScreen;
