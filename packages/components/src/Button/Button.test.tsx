import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
import { ActivityIndicator, Text } from 'react-native';

// Mock the theme hook
jest.mock('theme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      disabled: '#A9A9A9',
      textOnPrimary: '#FFFFFF',
      textDisabled: '#808080',
    },
    spacing: {
      s: 8,
      m: 16,
      l: 24,
    },
  }),
}));

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByText, toJSON } = render(<Button title="Press Me" />);
    expect(getByText('Press Me')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot('Button component - default props');
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText, toJSON } = render(
      <Button title="Press Me" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
    expect(toJSON()).toMatchSnapshot('Button component - with onPress handler');
  });

  it('renders correctly when disabled', () => {
    const { getByTestId, toJSON } = render(
      <Button title="Press Me" disabled testID="button" />
    );
    
    const button = getByTestId('button');
    expect(button.props.disabled).toBe(true);
    expect(toJSON()).toMatchSnapshot('Button component - disabled state');
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId, toJSON } = render(
      <Button title="Press Me" style={customStyle} testID="button" />
    );
    
    const button = getByTestId('button');
    const buttonStyles = button.props.style;
    expect(buttonStyles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: 'red',
        }),
      ])
    );
    expect(toJSON()).toMatchSnapshot('Button component - with custom style');
  });



  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'text'] as const;
    
    variants.forEach(variant => {
      const { getByTestId, toJSON } = render(
        <Button title="Press Me" variant={variant} testID={`button-${variant}`} />
      );
      
      const button = getByTestId(`button-${variant}`);
      expect(button).toBeTruthy();
      expect(toJSON()).toMatchSnapshot(`Button component - ${variant} variant`);
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    
    sizes.forEach(size => {
      const { getByTestId, toJSON } = render(
        <Button title="Press Me" size={size} testID={`button-${size}`} />
      );
      
      const button = getByTestId(`button-${size}`);
      expect(button).toBeTruthy();
      expect(toJSON()).toMatchSnapshot(`Button component - ${size} size`);
    });
  });

  it('renders with left and right icons', () => {
    const TestIcon = () => <Text>icon</Text>;
    
    const { getAllByText, toJSON } = render(
      <Button 
        title="Press Me" 
        leftIcon={<TestIcon />}
        rightIcon={<TestIcon />}
      />
    );
    
    const icons = getAllByText('icon');
    expect(icons).toHaveLength(2);
    expect(toJSON()).toMatchSnapshot('Button component - with icons');
  });

  it('applies custom text style', () => {
    const customTextStyle = { fontSize: 20, color: 'blue' };
    const { getByText, toJSON } = render(
      <Button title="Press Me" textStyle={customTextStyle} />
    );
    
    const buttonText = getByText('Press Me');
    expect(buttonText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customTextStyle),
      ])
    );
    expect(toJSON()).toMatchSnapshot('Button component - with custom text style');
  });
});
