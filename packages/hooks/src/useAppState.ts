import { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface AppStateHookResult {
  appState: AppStateStatus;
  isActive: boolean;
  isBackground: boolean;
  isInactive: boolean;
  lastState: AppStateStatus | null;
  onActiveCallback: (callback: () => void) => void;
  onBackgroundCallback: (callback: () => void) => void;
  onInactiveCallback: (callback: () => void) => void;
}

export const useAppState = (): AppStateHookResult => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [lastState, setLastState] = useState<AppStateStatus | null>(null);
  const [activeCallback, setActiveCallback] = useState<(() => void) | null>(null);
  const [backgroundCallback, setBackgroundCallback] = useState<(() => void) | null>(null);
  const [inactiveCallback, setInactiveCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setLastState(appState);
      setAppState(nextAppState);

      if (nextAppState === 'active' && activeCallback) {
        activeCallback();
      } else if (nextAppState === 'background' && backgroundCallback) {
        backgroundCallback();
      } else if (nextAppState === 'inactive' && inactiveCallback) {
        inactiveCallback();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, activeCallback, backgroundCallback, inactiveCallback]);

  const onActiveCallback = useCallback((callback: () => void) => {
    setActiveCallback(() => callback);
  }, []);

  const onBackgroundCallback = useCallback((callback: () => void) => {
    setBackgroundCallback(() => callback);
  }, []);

  const onInactiveCallback = useCallback((callback: () => void) => {
    setInactiveCallback(() => callback);
  }, []);

  const isActive = appState === 'active';
  const isBackground = appState === 'background';
  const isInactive = appState === 'inactive';

  return {
    appState,
    isActive,
    isBackground,
    isInactive,
    lastState,
    onActiveCallback,
    onBackgroundCallback,
    onInactiveCallback,
  };
};