import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@theme';
import React from 'react';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

import { AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = (): React.ReactElement => {
  const theme = useTheme();

  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};
