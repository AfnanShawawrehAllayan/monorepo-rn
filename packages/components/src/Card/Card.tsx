import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useScale } from 'hooks';
import { useTheme } from 'theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
  outlined?: boolean;
  padded?: boolean;
}

export const Card = ({
  children,
  style,
  elevation = 2,
  outlined = false,
  padded = true,
}: CardProps): React.JSX.Element => {
  const theme = useTheme();
  const { scale } = useScale();

  const styles = StyleSheet.create({
    card: {
      borderRadius: scale(8),
      overflow: 'hidden',
    },
  });

  const cardStyles = [
    styles.card,
    {
      backgroundColor: theme.colors.card,
      padding: padded ? scale(16) : 0,
      borderColor: outlined ? theme.colors.border : 'transparent',
      borderWidth: outlined ? 1 : 0,
      ...getShadow(elevation, theme.mode === 'dark'),
    },
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

// Shadow utility function that works on iOS and Android
const getShadow = (elevation: number, isDark: boolean): ViewStyle => {
  const shadowColor = isDark ? '#000' : '#000';
  const shadowOpacity = isDark ? 0.3 : 0.1;

  return {
    shadowColor,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity,
    shadowRadius: elevation * 0.8,
    elevation,
  };
}; 