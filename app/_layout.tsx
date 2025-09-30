import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthProvider from "./components/authProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container} edges={["top"]}>
            <StatusBar style="auto" />
            <Slot />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
