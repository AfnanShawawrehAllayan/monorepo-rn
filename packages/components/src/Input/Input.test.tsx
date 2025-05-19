// Mock modules before imports
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.PixelRatio = {
    ...RN.PixelRatio,
    roundToNearestPixel: jest.fn((value) => value),
    get: jest.fn(() => 2),
  };
  return RN;
});

jest.mock('hooks', () => ({
  useScale: () => ({
    scale: jest.fn((value) => value),
    verticalScale: jest.fn((value) => value),
    moderateScale: jest.fn((value) => value),
  }),
}));

// Mock theme
jest.mock('theme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#000000',
      textSecondary: '#666666',
      textOnPrimary: '#FFFFFF',
      textDisabled: '#999999',
      disabled: '#999999',
      error: '#FF3B30',
      success: '#34C759',
      border: '#E0E0E0',
    },
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
    },
    typography: {
      fontSize: {
        h1: 32,
        h2: 28,
        h3: 24,
        h4: 20,
        h5: 18,
        h6: 16,
        body1: 16,
        body2: 14,
        caption: 12,
        button: 16,
      },
    },
  }),
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';
import { View } from 'react-native';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    const { getByPlaceholderText, toJSON } = render(
      <Input placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with label', () => {
    const { getByText, toJSON } = render(
      <Input label="Username" placeholder="Enter username" />
    );
    expect(getByText('Username')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows error message when provided', () => {
    const errorMessage = 'This field is required';
    const { getByText, toJSON } = render(
      <Input error={errorMessage} placeholder="Enter text" />
    );
    expect(getByText(errorMessage)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('handles text input correctly', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" onChangeText={onChangeText} />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'Hello World');
    expect(onChangeText).toHaveBeenCalledWith('Hello World');
  });

  it('handles focus and blur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter text"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalled();
  });

  it('renders with left and right icons', () => {
    const leftIconTestId = 'left-icon';
    const rightIconTestId = 'right-icon';
    const { getByTestId, toJSON } = render(
      <Input
        placeholder="Enter text"
        leftIcon={<View testID={leftIconTestId} />}
        rightIcon={<View testID={rightIconTestId} />}
      />
    );
    
    expect(getByTestId(leftIconTestId)).toBeTruthy();
    expect(getByTestId(rightIconTestId)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('handles icon press events', () => {
    const onLeftIconPress = jest.fn();
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <Input
        placeholder="Enter text"
        leftIcon={<View testID="left-icon" />}
        rightIcon={<View testID="right-icon" />}
        onLeftIconPress={onLeftIconPress}
        onRightIconPress={onRightIconPress}
      />
    );
    
    const leftIcon = getByTestId('left-icon');
    const rightIcon = getByTestId('right-icon');
    
    if (leftIcon.parent) {
      fireEvent.press(leftIcon.parent);
      expect(onLeftIconPress).toHaveBeenCalled();
    }
    
    if (rightIcon.parent) {
      fireEvent.press(rightIcon.parent);
      expect(onRightIconPress).toHaveBeenCalled();
    }
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 20 };
    const inputStyle = { fontSize: 18 };
    const labelStyle = { fontSize: 16 };
    const errorStyle = { fontSize: 12 };
    
    const { getByTestId, toJSON } = render(
      <Input
        testID="custom-input"
        placeholder="Enter text"
        containerStyle={containerStyle}
        inputStyle={inputStyle}
        labelStyle={labelStyle}
        errorStyle={errorStyle}
        label="Custom Input"
        error="Error message"
      />
    );
    
    expect(toJSON()).toMatchSnapshot();
  });
}); 
