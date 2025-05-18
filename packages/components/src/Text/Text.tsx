import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from 'theme';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'button';
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

export const Text = ({
  variant = 'body1',
  color,
  align,
  weight,
  style,
  children,
  ...rest
}: TextProps) => {
  const { colors, typography } = useTheme();
  
  const getFontSize = () => {
    switch (variant) {
      case 'h1':
        return typography.fontSize.h1;
      case 'h2':
        return typography.fontSize.h2;
      case 'h3':
        return typography.fontSize.h3;
      case 'h4':
        return typography.fontSize.h4;
      case 'h5':
        return typography.fontSize.h5;
      case 'h6':
        return typography.fontSize.h6;
      case 'body1':
        return typography.fontSize.body1;
      case 'body2':
        return typography.fontSize.body2;
      case 'caption':
        return typography.fontSize.caption;
      case 'button':
        return typography.fontSize.button;
      default:
        return typography.fontSize.body1;
    }
  };
  
  const getLineHeight = () => {
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return getFontSize() * 1.2; // 120% for headings
      default:
        return getFontSize() * 1.5; // 150% for body text
    }
  };
  
  const styles = StyleSheet.create({
    text: {
      color: color || colors.text,
      fontSize: getFontSize(),
      lineHeight: getLineHeight(),
      fontWeight: weight || (variant.startsWith('h') ? 'bold' : 'normal'),
      textAlign: align,
    },
  });

  return (
    <RNText style={[styles.text, style]} {...rest}>
      {children}
    </RNText>
  );
};