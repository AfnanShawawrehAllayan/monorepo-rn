import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useScale } from 'hooks';
import { useTheme } from 'theme';
import { Text } from '../Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
}

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  onRightIconPress,
  onLeftIconPress,
  ...props
}: InputProps) => {
  const theme = useTheme();
  const { scale } = useScale();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: scale(16),
      width: '100%',
    },
    label: {
      marginBottom: scale(6),
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: scale(8),
      overflow: 'hidden',
    },
    input: {
      flex: 1,
      height: scale(48),
      fontSize: scale(16),
      paddingVertical: scale(8),
    },
    iconContainer: {
      padding: scale(12),
      justifyContent: 'center',
      alignItems: 'center',
    },
    error: {
      marginTop: scale(4),
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text 
          variant="body2" 
          style={[
            styles.label, 
            { color: error ? theme.colors.error : theme.colors.text },
            labelStyle
          ]}
        >
          {label}
        </Text>
      )}

      <View 
        style={[
          styles.inputContainer, 
          { 
            borderColor: getBorderColor(),
            backgroundColor: theme.colors.surface,
          }
        ]}
      >
        {leftIcon && (
          <TouchableOpacity 
            onPress={onLeftIconPress} 
            disabled={!onLeftIconPress}
            style={styles.iconContainer}
          >
            {leftIcon}
          </TouchableOpacity>
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              paddingLeft: leftIcon ? 0 : scale(12),
              paddingRight: rightIcon ? 0 : scale(12),
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity 
            onPress={onRightIconPress} 
            disabled={!onRightIconPress}
            style={styles.iconContainer}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          variant="caption"
          style={[styles.error, { color: theme.colors.error }, errorStyle]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}; 