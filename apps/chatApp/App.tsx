import { Button, Input, Card, Spacer } from 'components';
import { I18nProvider, useI18n, useLanguage } from 'i18n';
import { useAppState, useBackHandler, useKeyboard, useOrientation } from 'hooks';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, BackHandler } from 'react-native';
import { ThemeProvider, useTheme } from 'theme';

const AppStateDemo = () => {
  const { appState, isActive, isBackground, lastState, onActiveCallback } = useAppState();

  useEffect(() => {
    onActiveCallback(() => {
      Alert.alert('Welcome Back!', 'The app is active again.');
    });
  }, [onActiveCallback]);

  return (
    <Card>
      <Text style={styles.demoTitle}>App State:</Text>
      <Text>Current State: {appState}</Text>
      <Spacer size="xs" />
      <Text>Last State: {lastState || 'None'}</Text>
      <Spacer size="xs" />
      <Text>Is Active: {String(isActive)}</Text>
      <Spacer size="xs" />
      <Text>Is Background: {String(isBackground)}</Text>
    </Card>
  );
};

const KeyboardDemo = () => {
  const { isKeyboardVisible, keyboardHeight, coordinates } = useKeyboard();
  const [text, setText] = useState('');
  const theme = useTheme();

  return (
    <Card>
      <Text style={styles.demoTitle}>Keyboard Status:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
        value={text}
        onChangeText={setText}
        placeholder="Type to show keyboard"
      />
      <Spacer size="sm" />
      <Text>Is Visible: {String(isKeyboardVisible)}</Text>
      <Spacer size="xs" />
      <Text>Height: {keyboardHeight}px</Text>
      {coordinates && (
        <>
          <Spacer size="xs" />
          <Text>
            Position: ({coordinates.screenX}, {coordinates.screenY})
          </Text>
        </>
      )}
    </Card>
  );
};

const OrientationDemo = () => {
  const { orientation, isPortrait, angle, aspectRatio } = useOrientation();

  return (
    <Card>
      <Text style={styles.demoTitle}>Orientation:</Text>
      <Text>Current: {orientation}</Text>
      <Spacer size="xs" />
      <Text>Is Portrait: {String(isPortrait)}</Text>
      <Spacer size="xs" />
      <Text>Angle: {angle}°</Text>
      <Spacer size="xs" />
      <Text>Aspect Ratio: {aspectRatio.toFixed(2)}</Text>
    </Card>
  );
};

const BackHandlerDemo = () => {
  useBackHandler(() => {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {} },
        { text: 'OK', onPress: () => BackHandler.exitApp() }
      ],
      { cancelable: false }
    );
    return true;
  });

  return (
    <Card>
      <Text style={styles.demoTitle}>Back Handler:</Text>
      <Text>Press back button to see alert</Text>
    </Card>
  );
};

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <View style={styles.languageContainer}>
      <Button
        title="English"
        variant={language === 'en' ? 'primary' : 'outline'}
        size="small"
        onPress={() => changeLanguage('en')}
      />
      <Spacer direction="horizontal" size="sm" />
      <Button
        title="العربية"
        variant={language === 'ar' ? 'primary' : 'outline'}
        size="small"
        onPress={() => changeLanguage('ar')}
      />
    </View>
  );
};

const InputDemo = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validateInput = (text: string) => {
    if (text.length < 3) {
      setError('Input must be at least 3 characters long');
    } else {
      setError('');
    }
  };

  return (
    <Card>
      <Text style={styles.demoTitle}>Input Component:</Text>
      <Input
        label="Demo Input"
        value={value}
        onChangeText={(text) => {
          setValue(text);
          validateInput(text);
        }}
        placeholder="Type something..."
        error={error}
      />
    </Card>
  );
};

const AppContent = () => {
  const { t } = useI18n();
  const { loadSavedLanguage } = useLanguage();

  useEffect(() => {
    loadSavedLanguage();
  }, [loadSavedLanguage]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('common.appName')}</Text>
      <LanguageSelector />
      <InputDemo />
      <Spacer size="md" />
      <AppStateDemo />
      <Spacer size="md" />
      <KeyboardDemo />
      <Spacer size="md" />
      <OrientationDemo />
      <Spacer size="md" />
      <BackHandlerDemo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
});

function App(): React.JSX.Element {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
