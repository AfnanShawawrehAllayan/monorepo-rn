import React, { createContext, useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import { i18n, changeLanguage, defaultLanguage, isRTL } from './i18n';
import { RTLProvider } from './RTLProvider';

type I18nContextType = {
  language: string;
  setLanguage: (lng: string) => Promise<string>;
  isRTL: boolean;
};

export const I18nContext = createContext<I18nContextType>({
  language: defaultLanguage,
  setLanguage: () => Promise.resolve(defaultLanguage),
  isRTL: false,
});

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: string;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLanguage = defaultLanguage,
}) => {
  const [language, setLanguageState] = useState(initialLanguage);
  const [rtl, setRtl] = useState(isRTL(initialLanguage));

  useEffect(() => {
    changeLanguage(initialLanguage).then(setLanguageState);
  }, [initialLanguage]);

  const setLanguage = async (lng: string) => {
    const newLng = await changeLanguage(lng);
    setLanguageState(newLng);
    setRtl(isRTL(newLng));
    return newLng;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, isRTL: rtl }}>
      <I18nextProvider i18n={i18n}>
        <RTLProvider isRTL={rtl}>{children}</RTLProvider>
      </I18nextProvider>
    </I18nContext.Provider>
  );
};