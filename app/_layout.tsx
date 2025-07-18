// app/_layout.tsx
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "./theme/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <StatusBar style="auto" />
          <Slot />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Or your global background color
  },
});
