import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from 'theme';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
}

export const Button = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  testID,
  ...rest
}: ButtonProps): React.ReactElement => {
  const { colors, spacing } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;

    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textDisabled;

    switch (variant) {
      case 'primary':
      case 'secondary':
        return colors.textOnPrimary;
      case 'outline':
        return colors.primary;
      case 'text':
        return colors.primary;
      default:
        return colors.textOnPrimary;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.disabled;
    return variant === 'outline' ? colors.primary : 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return spacing.s;
      case 'medium':
        return spacing.m;
      case 'large':
        return spacing.l;
      default:
        return spacing.m;
    }
  };

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      borderRadius: 8,
      borderWidth: variant === 'outline' ? 1 : 0,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: getPadding() * 2,
      paddingVertical: getPadding(),
    },
    text: {
      color: getTextColor(),
      fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 18,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      disabled={disabled || loading} 
      testID={testID}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.text, textStyle]}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};
