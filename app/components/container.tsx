import { useTheme } from "@/app/theme/ThemeProvider";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
}

export default function Container({
  children,
  style,
  ...rest
}: ContainerProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
