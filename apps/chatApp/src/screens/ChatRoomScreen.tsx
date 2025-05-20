import { useRoute } from '@react-navigation/native';
import { Card, Spacer } from 'components';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import type { RootStackParamList } from '../navigation';
import type { RouteProp } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

const COLORS = {
  background: '#f5f5f5',
  white: '#fff',
  border: '#ddd',
  primary: '#007AFF',
  text: '#fff',
  subtitle: '#999',
};

export const ChatRoomScreen: React.FC = () => {
  const route = useRoute<ChatRoomScreenRouteProp>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
      isSent: true,
    };

    setMessages([newMessage, ...messages]);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isSent && styles.sentMessage]}>
      <Card>
        <View style={styles.messageContent}>
          <Text>{item.text}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </Card>
      <Spacer size="xs" />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      testID="chatRoom"
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        inverted
      />
      <Card>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            testID="messageInput"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} testID="sendButton">
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    marginRight: 12,
    padding: 8,
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  listContent: {
    padding: 16,
  },
  messageContainer: {
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  messageContent: {
    padding: 12,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  sentMessage: {
    alignItems: 'flex-end',
  },
  timestamp: {
    color: COLORS.subtitle,
    fontSize: 12,
    marginTop: 4,
  },
});
