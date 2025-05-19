import { Button } from 'components';
import { I18nProvider, useI18n, useLanguage } from 'i18n';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemeProvider } from 'theme';

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
      <View style={styles.buttonSpacer} />
      <Button
        title="العربية"
        variant={language === 'ar' ? 'primary' : 'outline'}
        size="small"
        onPress={() => changeLanguage('ar')}
      />
    </View>
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
      <Button title={t('settings.language.title')} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonSpacer: {
    width: 12,
  },
  container: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
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
    textAlign: 'right',
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
