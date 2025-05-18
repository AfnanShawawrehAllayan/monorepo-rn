import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { I18nContext } from './I18nProvider';

export const useI18n = () => {
  const { t } = useTranslation();
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return {
    t,
    language: context.language,
    setLanguage: context.setLanguage,
    isRTL: context.isRTL,
  };
};