import { Button, Card, Input, Spacer, Text } from '@components';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import * as Yup from 'yup';

import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../store';
import { api } from '../../store/api';
import { setCredentials } from '../../store/slices/authSlice';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { useRegisterMutation } = api;

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [image, setImage] = useState<string | undefined>();
  const { data: testData, error: testError } = api.useTestConnectionQuery();

  // Test server connection on mount
  useEffect(() => {
    if (testError) {
      console.error('Server connection test failed:', {
        error: testError,
        ...('status' in testError && { status: testError.status }),
        ...('data' in testError && { data: testError.data }),
      });
      Alert.alert(
        'Server Connection Error',
        'Unable to connect to the server. Please check if the server is running and try again.',
        [{ text: 'OK' }],
      );
    } else if (testData) {
      console.log('Server connection test successful:', testData);
    }
  }, [testData, testError]);

  const handleImagePick = async () => {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    });

    if (!permission) return;

    const permissionStatus = await check(permission);
    if (permissionStatus === RESULTS.DENIED) {
      const permissionResult = await request(permission);
      if (permissionResult !== RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Please grant permission to access your photos');
        return;
      }
    }

    const imageResult = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (imageResult.assets && imageResult.assets[0]?.uri) {
      setImage(imageResult.assets[0].uri);
    }
  };

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    try {
      // Check server connection before attempting registration
      if (testError) {
        Alert.alert('Server Error', 'Unable to connect to the server. Please try again later.', [
          { text: 'OK' },
        ]);
        return;
      }

      console.log('Attempting registration with:', {
        name: values.name,
        email: values.email,
        hasPassword: !!values.password,
        hasImage: !!image,
        serverStatus: testData ? 'connected' : 'unknown',
      });

      const response = await register({
        ...values,
        image,
      }).unwrap();

      console.log('Registration successful:', {
        hasToken: !!response.token,
        tokenLength: response.token?.length,
      });

      dispatch(setCredentials({ token: response.token }));
      // Navigation will be handled by the root navigator based on auth state
    } catch (error: any) {
      console.error('Registration error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        originalError: error,
        serverStatus: testData ? 'connected' : 'unknown',
      });

      let errorMessage = 'Registration failed. Please try again.';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert('Registration Failed', errorMessage, [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <>
              <Input
                label="Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={touched.name ? errors.name : undefined}
                autoCapitalize="words"
              />
              <Spacer />
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
              <Spacer />
              <Button title="Select Profile Picture" onPress={handleImagePick} variant="outline" />
              {image && (
                <>
                  <Spacer />
                  <Text style={styles.imageText}>Image selected</Text>
                </>
              )}
              <Spacer size="lg" />
              <Button title="Register" onPress={() => handleSubmit()} loading={isLoading} />
            </>
          )}
        </Formik>
        <Spacer />
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Login' as never)}
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
  imageText: {
    color: 'green',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});
