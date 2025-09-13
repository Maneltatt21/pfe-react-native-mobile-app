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
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.sidebar }]}>
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
          {user?.name
            ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
            : "Admin"}
        </Text>
        <Text style={[styles.profileEmail, { color: theme.colors.text }]}>
          {user?.email}
        </Text>
      </View>

      {/* Only show drawer items YOU add */}
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Tableau de bord
          </Text>
        )}
        onPress={() => router.replace("../tabs/dashbord")}
      />
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Chauffeurs
          </Text>
        )}
        onPress={() => router.replace("../drivers/chauffeurs")}
      />

      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Remplacements
          </Text>
        )}
        onPress={() => router.replace("../screens/substitutions")}
      />
    </View>
  );
};

export default function AdminLayout() {
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
