import { useTheme } from "@/app/theme/ThemeProvider";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
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
          John Doe
        </Text>
        <Text style={[styles.profileEmail, { color: theme.colors.text }]}>
          john.doe@example.com
        </Text>
      </View>

      {/* Only show drawer items YOU add */}
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Dashboard
          </Text>
        )}
        onPress={() => router.push("../tabs/dashbord")}
      />
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Chauffeurs
          </Text>
        )}
        onPress={() => router.push("../screens/chauffeurs")}
      />
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Assurances
          </Text>
        )}
        onPress={() => router.push("../screens/assurances")}
      />
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Contrôle Techniques
          </Text>
        )}
        onPress={() => router.push("../screens/controle-techniques")}
      />
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Carte Grise
          </Text>
        )}
        onPress={() => router.push("../screens/cart-grise")}
      />
      <DrawerItem
        label={() => (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Substitutions
          </Text>
        )}
        onPress={() => router.push("../screens/substitutions")}
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
