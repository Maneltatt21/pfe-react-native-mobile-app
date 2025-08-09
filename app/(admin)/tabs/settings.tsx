import { useTheme } from "@/src/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.appBar,
          {
            backgroundColor: theme.colors.appBar,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.appBarText, { color: theme.colors.text }]}>
          Settings
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={theme.isDark}
            onValueChange={toggleTheme}
            thumbColor={
              theme.isDark ? theme.colors.primary : theme.colors.border
            }
            trackColor={{
              false: theme.colors.sidebar,
              true: theme.colors.sidebar,
            }}
          />
        </View>
        <View style={styles.buttonContainer}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  appBar: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  appBarText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
