import { useEffect, useRef, useCallback } from 'react';
import { BackHandler } from 'react-native';

interface BackHandlerOptions {
  enabled?: boolean;
  priority?: number;
}

type BackHandlerFunction = () => boolean;

interface RegisteredHandler {
  handler: BackHandlerFunction;
  priority: number;
}

export const useBackHandler = (
  handler: BackHandlerFunction,
  options: BackHandlerOptions = {}
) => {
  const {
    enabled = true,
    priority = 0,
  } = options;

  // Use ref to avoid re-registering handlers on priority change
  const handlerRef = useRef<RegisteredHandler>({ handler, priority });
  
  // Update ref when handler changes
  useEffect(() => {
    handlerRef.current.handler = handler;
  }, [handler]);

  // Update ref when priority changes
  useEffect(() => {
    handlerRef.current.priority = priority;
  }, [priority]);

  const handleBackPress = useCallback(() => {
    if (!enabled) return false;

    try {
      return handlerRef.current.handler();
    } catch (error) {
      console.warn('Error in back handler:', error);
      return false;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => {
      subscription.remove();
    };
  }, [enabled, handleBackPress]);

  // Return utility functions
  return {
    // Temporarily disable the handler
    disable: useCallback(() => {
      handlerRef.current.priority = -1;
    }, []),
    
    // Re-enable the handler with original or new priority
    enable: useCallback((newPriority?: number) => {
      handlerRef.current.priority = newPriority ?? priority;
    }, [priority]),
    
    // Check if handler is currently enabled
    isEnabled: useCallback(() => {
      return enabled && handlerRef.current.priority >= 0;
    }, [enabled]),
    
    // Get current priority
    getPriority: useCallback(() => {
      return handlerRef.current.priority;
    }, []),
  };
};