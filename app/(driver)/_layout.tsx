import { useTheme } from "@/src/theme/ThemeProvider";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../components/authProvider";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.sidebar }]}>
      {/* Profile section */}
      <View
        style={[
          styles.profileContainer,
          { borderBottomColor: theme.colors.border },
        ]}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, { color: theme.colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.profileEmail, { color: theme.colors.text }]}>
          {user?.email}
        </Text>
      </View>

      {/* Drawer Items */}
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Accueil
          </Text>
        )}
        onPress={() => router.push("../tabs/home")}
      />
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Remplacements
          </Text>
        )}
        onPress={() => router.push("../screens/substitutions")}
      />
    </View>
  );
};

export default function DriverLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.colors.sidebar,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    paddingVertical: 40,
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
  },
  label: {
    fontSize: 16,
  },
});
