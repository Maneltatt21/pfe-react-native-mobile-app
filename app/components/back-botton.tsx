import { useTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BackHeaderProps {
  title: string;
}

export default function BackHeader({ title }: BackHeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.appBar }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <View style={styles.backButton} /> {/* spacer to balance */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 30,
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
