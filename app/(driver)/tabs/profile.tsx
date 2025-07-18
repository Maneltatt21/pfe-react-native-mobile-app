import { useTheme } from "@/app/theme/ThemeProvider";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function DriverProfile() {
  const { theme, toggleTheme } = useTheme();

  const user = {
    name: "Helmi Rmili",
    email: "helmi@example.com",
    phone: "+216 123 456 789",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />

        <Text style={[styles.name, { color: theme.colors.text }]}>
          {user.name}
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Email:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {user.email}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Phone:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {user.phone}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
  },
  infoRow: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: "#E53935",
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    width: "100%", // added width so settingRow works well
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // <-- this spaces text and switch
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
