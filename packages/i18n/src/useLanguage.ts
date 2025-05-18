import { useCallback } from 'react';
import { I18nManager, DevSettings } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useI18n } from './useI18n';

const LANGUAGE_STORAGE_KEY = '@app_language';

type LanguageCode = 'en' | 'ar';

const isRTL = (lang: string) => lang === 'ar';

export const useLanguage = () => {
  const { setLanguage, language, t } = useI18n();

  const loadSavedLanguage = useCallback(async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (savedLanguage) {
        await changeLanguage(savedLanguage as LanguageCode);
      } else {
        await changeLanguage('en');
      }
    } catch (error) {
      console.error(t('errors.loadLanguage'), error);
    }
  }, [t]);

  const changeLanguage = useCallback(async (newLanguage: LanguageCode) => {
    try {
      if (language === newLanguage) return;

      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);

      const shouldBeRTL = isRTL(newLanguage);

      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);

        if (__DEV__) {
          DevSettings.reload();
        } else {
          console.warn(t('errors.restartRequired'));
        }
      }

      await setLanguage(newLanguage);
    } catch (error) {
      console.error(t('errors.changeLanguage'), error);
    }
  }, [language, setLanguage, t]);

  return {
    language,
    changeLanguage,
    loadSavedLanguage,
  };
};