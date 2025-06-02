import { Button, Card, Input, Spacer, Text } from '@components';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as Yup from 'yup';

import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../store';
import { api } from '../../store/api';
import { setCredentials } from '../../store/slices/authSlice';


import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { useLoginMutation } = api;

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await login(values).unwrap();
      dispatch(setCredentials({ token: response.token }));
      // Navigation will be handled by the root navigator based on auth state
    } catch (error: any) {
      Alert.alert('Login Failed', error.data?.message || 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <>
              <Input
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email ? errors.email : undefined}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Spacer />
              <Input
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password ? errors.password : undefined}
                secureTextEntry
              />
              <Spacer size="lg" />
              <Button title="Login" onPress={() => handleSubmit()} loading={isLoading} />
            </>
          )}
        </Formik>
        <Spacer />
        <Button
          title="Don't have an account? Register"
          onPress={() => navigation.navigate('Register' as never)}
          variant="text"
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});
