import React from 'react';
import { View } from 'react-native';
import { useScale } from 'hooks';

type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;
type SpacerDirection = 'horizontal' | 'vertical';

interface SpacerProps {
  size?: SpacerSize;
  direction?: SpacerDirection;
}

export const Spacer = ({ size = 'md', direction = 'vertical' }: SpacerProps): React.JSX.Element => {
  const { scale } = useScale();

  const getSize = (): number => {
    if (typeof size === 'number') return scale(size);
    
    switch (size) {
      case 'xs':
        return scale(4);
      case 'sm':
        return scale(8);
      case 'md':
        return scale(16);
      case 'lg':
        return scale(24);
      case 'xl':
        return scale(32);
      case 'xxl':
        return scale(48);
      default:
        return scale(16);
    }
  };

  const spacerSize = getSize();

  return (
    <View
      style={{
        width: direction === 'horizontal' ? spacerSize : undefined,
        height: direction === 'vertical' ? spacerSize : undefined,
      }}
    />
  );
}; 