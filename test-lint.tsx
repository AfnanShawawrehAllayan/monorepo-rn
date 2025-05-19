import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TestComponentProps {
  initialCount?: number;
}

const TestComponent: React.FC<TestComponentProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState<number>(initialCount);

  const handleIncrement = (): void => {
    setCount(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text} onPress={handleIncrement}>
        Count: {count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 5,
  },
  text: {
    color: '#007AFF', // Using iOS blue color as an example
  },
});

export default TestComponent;
