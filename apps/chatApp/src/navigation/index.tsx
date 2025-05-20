import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ChatListScreen } from '../screens/ChatListScreen';
import { ChatRoomScreen } from '../screens/ChatRoomScreen';

export type RootStackParamList = {
  ChatList: undefined;
  ChatRoom: { chatId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = (): React.ReactElement => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chats' }} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ title: 'Chat' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
