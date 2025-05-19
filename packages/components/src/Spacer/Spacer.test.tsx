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

import React from 'react';
import { render } from '@testing-library/react-native';
import { Spacer } from './Spacer';

describe('Spacer Component', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(<Spacer />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with custom numeric size', () => {
    const { toJSON } = render(<Spacer size={20} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with predefined sizes', () => {
    const sizes: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    
    sizes.forEach(size => {
      const { toJSON } = render(<Spacer size={size} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('renders horizontal spacer', () => {
    const { toJSON } = render(<Spacer direction="horizontal" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders vertical spacer', () => {
    const { toJSON } = render(<Spacer direction="vertical" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders horizontal spacer with custom size', () => {
    const { toJSON } = render(<Spacer direction="horizontal" size={40} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with all size variants and both directions', () => {
    const sizes: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const directions: ('horizontal' | 'vertical')[] = ['horizontal', 'vertical'];

    directions.forEach(direction => {
      sizes.forEach(size => {
        const { toJSON } = render(<Spacer direction={direction} size={size} />);
        expect(toJSON()).toMatchSnapshot();
      });
    });
  });
}); 