import { useEffect, useState, useCallback } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

type Orientation = 'portrait' | 'landscape';

interface OrientationDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

interface OrientationInfo {
  orientation: Orientation;
  dimensions: OrientationDimensions;
  isPortrait: boolean;
  isLandscape: boolean;
  angle: 0 | 90 | 180 | 270;
  aspectRatio: number;
}

export const useOrientation = () => {
  const [orientationInfo, setOrientationInfo] = useState<OrientationInfo>(() => {
    const window = Dimensions.get('window');
    const orientation = window.width < window.height ? 'portrait' : 'landscape';
    
    return {
      orientation,
      dimensions: window,
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
      angle: 0,
      aspectRatio: window.width / window.height,
    };
  });

  const updateOrientation = useCallback((window: ScaledSize) => {
    const orientation = window.width < window.height ? 'portrait' : 'landscape';
    const aspectRatio = window.width / window.height;
    
    // Calculate rotation angle based on dimensions and aspect ratio
    let angle: 0 | 90 | 180 | 270 = 0;
    if (window.width > window.height) {
      angle = aspectRatio > 1 ? 90 : 270;
    }

    setOrientationInfo({
      orientation,
      dimensions: window,
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
      angle,
      aspectRatio,
    });
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      updateOrientation(window);
    });

    return () => subscription.remove();
  }, [updateOrientation]);

  // Utility functions
  const getOptimalDimension = useCallback((portraitValue: number, landscapeValue: number): number => {
    return orientationInfo.isPortrait ? portraitValue : landscapeValue;
  }, [orientationInfo.isPortrait]);

  const getOptimalSpacing = useCallback((spacing: { portrait: number; landscape: number }): number => {
    return orientationInfo.isPortrait ? spacing.portrait : spacing.landscape;
  }, [orientationInfo.isPortrait]);

  return {
    ...orientationInfo,
    getOptimalDimension,
    getOptimalSpacing,
  };
};