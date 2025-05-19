import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for scaling (based on standard iPhone 11 Pro)
const baseWidth = 375;
const baseHeight = 812;

/**
 * Custom hook for handling responsive scaling
 */
export const useScale = () => {
  const widthScale = SCREEN_WIDTH / baseWidth;
  const heightScale = SCREEN_HEIGHT / baseHeight;

  /**
   * Scale a number based on screen width
   */
  const scale = (size: number): number => {
    const newSize = size * widthScale;
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  };

  /**
   * Scale a number based on screen height
   */
  const verticalScale = (size: number): number => {
    const newSize = size * heightScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  /**
   * Scale a number based on screen size with a factor
   */
  const moderateScale = (size: number, factor = 0.5): number => {
    const scaledSize = size + (scale(size) - size) * factor;
    return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
  };

  return {
    scale,
    verticalScale,
    moderateScale,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  };
}; 