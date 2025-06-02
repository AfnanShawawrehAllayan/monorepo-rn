import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAppSelector } from '../store';

import { AuthNavigator } from './AuthStack';
import { MainNavigator } from './MainStack';
import { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = (): React.ReactElement => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <RootStack.Screen name="Main" component={MainNavigator} />
      )}
    </RootStack.Navigator>
  );
};
