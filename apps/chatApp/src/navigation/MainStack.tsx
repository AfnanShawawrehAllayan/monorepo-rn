import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@theme';
import React from 'react';

import { ChatListScreen } from '../screens/ChatListScreen';
import { ChatRoomScreen } from '../screens/ChatRoomScreen';
import { FriendRequestsScreen } from '../screens/FriendRequestsScreen';
import { HomeScreen } from '../screens/HomeScreen';

import { MainStackParamList } from './types';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = (): React.ReactElement => {
  const theme = useTheme();

  return (
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <MainStack.Screen name="Home" component={HomeScreen} options={{ title: 'Profile' }} />
      <MainStack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chats' }} />
      <MainStack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ title: 'Chat' }} />
      <MainStack.Screen
        name="FriendRequests"
        component={FriendRequestsScreen}
        options={{
          headerShown: true,
          title: 'Friend Requests',
          headerBackTitle: 'Back',
        }}
      />
    </MainStack.Navigator>
  );
};
