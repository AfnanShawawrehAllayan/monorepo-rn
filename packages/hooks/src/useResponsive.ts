import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Breakpoints in dp (density-independent pixels)
const breakpoints = {
  xs: 0,    // Extra small devices (phones < 360dp)
  sm: 360,  // Small devices (phones >= 360dp)
  md: 600,  // Medium devices (tablets)
  lg: 960,  // Large devices (tablets landscape, small laptops)
  xl: 1280, // Extra large devices (large laptops and monitors)
};

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  // Get current screen size based on width
  const getScreenSize = (width: number): ScreenSize => {
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const screenSize = getScreenSize(dimensions.width);

  // Utility methods for responsive design
  const isExtraSmall = screenSize === 'xs';
  const isSmall = screenSize === 'sm';
  const isMedium = screenSize === 'md';
  const isLarge = screenSize === 'lg';
  const isExtraLarge = screenSize === 'xl';
  
  const isMobile = isExtraSmall || isSmall;
  const isTablet = isMedium || isLarge;
  const isDesktop = isExtraLarge;

  // Responsive spacing utility
  const spacing = (
    spacingValues: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      base: number;
    }
  ) => {
    return spacingValues[screenSize] ?? spacingValues.base;
  };

  // Responsive font size utility
  const fontSize = (
    fontSizes: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      base: number;
    }
  ) => {
    return fontSizes[screenSize] ?? fontSizes.base;
  };

  return {
    dimensions,
    screenSize,
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isMobile,
    isTablet,
    isDesktop,
    spacing,
    fontSize,
    width: dimensions.width,
    height: dimensions.height,
  };
};