import React, { createContext, useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';

type RTLContextType = {
  isRTL: boolean;
};

export const RTLContext = createContext<RTLContextType>({
  isRTL: false,
});

interface RTLProviderProps {
  children: React.ReactNode;
  isRTL: boolean;
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ children, isRTL }) => {
  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);

      // On iOS, we need to reload the app for RTL changes to take effect
      if (Platform.OS === 'ios') {
        // In a real app, you might want to show a modal asking the user to restart
        // For now, we'll just log a message
        console.log('Please restart the app for RTL changes to take effect');
      }
    }
  }, [isRTL]);

  return <RTLContext.Provider value={{ isRTL }}>{children}</RTLContext.Provider>;
};
