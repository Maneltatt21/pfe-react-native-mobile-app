import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
}

export default function Container({ children, style, ...rest }: ContainerProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});
