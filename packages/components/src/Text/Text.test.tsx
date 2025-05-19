import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from './Text';

// Mock the theme hook
jest.mock('theme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
    },
    typography: {
      fontSize: {
        h1: 32,
        h2: 28,
        h3: 24,
        h4: 20,
        h5: 16,
        h6: 14,
        body1: 16,
        body2: 14,
        caption: 12,
        button: 16,
      },
    },
  }),
}));

describe('Text Component', () => {
  // Test rendering and content
  describe('rendering', () => {
    it('should render text content correctly', () => {
      render(<Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeTruthy();
    });

    it('should render with default variant (body1)', () => {
      render(<Text>Default Text</Text>);
      const text = screen.getByText('Default Text');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: 16, // body1 size
            fontWeight: 'normal',
          }),
        ])
      );
    });
  });

  // Test variants
  describe('variants', () => {
    const variants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'button'] as const;
    
    test.each(variants)('should render %s variant correctly', (variant) => {
      render(
        <Text variant={variant} testID={`text-${variant}`}>
          {variant} text
        </Text>
      );
      
      const text = screen.getByTestId(`text-${variant}`);
      const expectedFontSize = {
        h1: 32, h2: 28, h3: 24, h4: 20, h5: 16, h6: 14,
        body1: 16, body2: 14, caption: 12, button: 16,
      }[variant];

      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: expectedFontSize,
            fontWeight: variant.startsWith('h') ? 'bold' : 'normal',
          }),
        ])
      );
    });
  });

  // Test styling props
  describe('styling', () => {
    it('should apply custom color', () => {
      render(<Text color="#FF0000" testID="colored-text">Colored Text</Text>);
      
      const text = screen.getByTestId('colored-text');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            color: '#FF0000',
          }),
        ])
      );
    });

    it('should apply text alignment', () => {
      const alignments = ['left', 'center', 'right', 'justify'] as const;
      
      alignments.forEach(align => {
        render(<Text align={align} testID={`aligned-${align}`}>Aligned Text</Text>);
        
        const text = screen.getByTestId(`aligned-${align}`);
        expect(text.props.style).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              textAlign: align,
            }),
          ])
        );
      });
    });

    it('should apply font weight', () => {
      const weights = ['normal', 'bold', '400', '700'] as const;
      
      weights.forEach(weight => {
        render(<Text weight={weight} testID={`weight-${weight}`}>Weighted Text</Text>);
        
        const text = screen.getByTestId(`weight-${weight}`);
        expect(text.props.style).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              fontWeight: weight,
            }),
          ])
        );
      });
    });

    it('should apply custom style', () => {
      const customStyle = { marginTop: 10, paddingHorizontal: 20 };
      render(<Text style={customStyle} testID="custom-style">Styled Text</Text>);
      
      const text = screen.getByTestId('custom-style');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining(customStyle),
        ])
      );
    });
  });

  // Test line height calculations
  describe('line height', () => {
    it('should apply 120% line height for headings', () => {
      render(<Text variant="h1" testID="heading">Heading</Text>);
      
      const text = screen.getByTestId('heading');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lineHeight: 32 * 1.2, // h1 fontSize * 1.2
          }),
        ])
      );
    });

    it('should apply 150% line height for body text', () => {
      render(<Text variant="body1" testID="body">Body Text</Text>);
      
      const text = screen.getByTestId('body');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lineHeight: 16 * 1.5, // body1 fontSize * 1.5
          }),
        ])
      );
    });
  });
}); 