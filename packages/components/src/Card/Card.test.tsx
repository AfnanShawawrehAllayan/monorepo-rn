// Mock modules before imports
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
}));

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
    mode: 'light',
    colors: {
      card: '#FFFFFF',
      border: '#E0E0E0',
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#000000',
    },
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
    },
  }),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with custom style', () => {
    const customStyle = { marginTop: 20 };
    const { toJSON } = render(
      <Card style={customStyle}>
        <Text>Card Content</Text>
      </Card>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with custom elevation', () => {
    const { toJSON } = render(
      <Card elevation={5}>
        <Text>Card Content</Text>
      </Card>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with outline', () => {
    const { toJSON } = render(
      <Card outlined>
        <Text>Card Content</Text>
      </Card>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders without padding', () => {
    const { toJSON } = render(
      <Card padded={false}>
        <Text>Card Content</Text>
      </Card>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with complex content', () => {
    const { toJSON } = render(
      <Card>
        <View>
          <Text>Title</Text>
          <Text>Description</Text>
          <View>
            <Text>Nested Content</Text>
          </View>
        </View>
      </Card>
    );
    expect(toJSON()).toMatchSnapshot();
  });
}); 