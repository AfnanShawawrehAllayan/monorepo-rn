import { useEffect, useState, useCallback } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

interface KeyboardCoordinates {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
  duration: number;
  easing: string;
}

interface KeyboardStatus {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
  coordinates: KeyboardCoordinates | null;
  // Animation duration in milliseconds
  animationDuration: number;
  // Platform-specific utilities
  isPermanentlyVisible: boolean;
  dismiss: () => void;
}

export const useKeyboard = (): KeyboardStatus => {
  const [keyboardStatus, setKeyboardStatus] = useState<KeyboardStatus>({
    isKeyboardVisible: false,
    keyboardHeight: 0,
    coordinates: null,
    animationDuration: 0,
    isPermanentlyVisible: false,
    dismiss: () => Keyboard.dismiss(),
  });

  const handleKeyboardShow = useCallback((event: KeyboardEvent) => {
    const { endCoordinates, duration, easing } = event;
    
    setKeyboardStatus(current => ({
      ...current,
      isKeyboardVisible: true,
      keyboardHeight: endCoordinates.height,
      coordinates: {
        screenX: endCoordinates.screenX,
        screenY: endCoordinates.screenY,
        width: endCoordinates.width,
        height: endCoordinates.height,
        duration: duration || 250,
        easing: easing || 'keyboard',
      },
      animationDuration: duration || 250,
    }));
  }, []);

  const handleKeyboardHide = useCallback((event: KeyboardEvent) => {
    const { duration } = event;
    
    setKeyboardStatus(current => ({
      ...current,
      isKeyboardVisible: false,
      keyboardHeight: 0,
      coordinates: null,
      animationDuration: duration || 250,
    }));
  }, []);

  const handleKeyboardDidChangeFrame = useCallback((event: KeyboardEvent) => {
    const { endCoordinates, duration, easing } = event;
    
    setKeyboardStatus(current => ({
      ...current,
      keyboardHeight: endCoordinates.height,
      coordinates: {
        screenX: endCoordinates.screenX,
        screenY: endCoordinates.screenY,
        width: endCoordinates.width,
        height: endCoordinates.height,
        duration: duration || 250,
        easing: easing || 'keyboard',
      },
      animationDuration: duration || 250,
    }));
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      handleKeyboardShow
    );
    
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      handleKeyboardHide
    );

    const changeFrameSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidChangeFrame',
      handleKeyboardDidChangeFrame
    );

    // Check if keyboard is permanently visible (some Android devices)
    if (Platform.OS === 'android') {
      const isKeyboardVisible = Keyboard.isVisible();
      if (isKeyboardVisible) {
        setKeyboardStatus(current => ({
          ...current,
          isPermanentlyVisible: true,
        }));
      }
    }

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      changeFrameSubscription.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide, handleKeyboardDidChangeFrame]);

  return keyboardStatus;
};