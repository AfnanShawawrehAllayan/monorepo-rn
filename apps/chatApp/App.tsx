import { Button } from 'components';
import React from 'react';
import { View } from 'react-native';
import { ThemeProvider } from 'theme';
import { I18nProvider, useI18n } from 'i18n';

const AppContent = () => {
  const { t, setLanguage, language } = useI18n();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <View style={{ flex: 1,  gap: 20 }}>
      <Button title={t('common.appName')} />
      <Button 
        title={t('settings.language.title')} 
        variant="secondary"
        onPress={toggleLanguage}
      />
    </View>
  );
};

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
