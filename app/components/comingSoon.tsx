import { useTheme } from "@/app/theme/ThemeProvider"; // <-- import useTheme
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ComingSoonProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onPress?: () => void;
}

export default function ComingSoon({
  title = "We're working on this screen!",
  message = "This feature is coming soon. Stay tuned!",
  buttonText = "Go Back",
  onPress,
}: ComingSoonProps) {
  const { theme } = useTheme(); // <-- get theme

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={styles.emoji}>🚧</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        {message}
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
