import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* Profile section */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>
      </View>

      {/* Only show drawer items YOU add */}
      <DrawerItem
        label={() => <Text style={styles.label}>Home</Text>}
        onPress={() => router.push("../tabs/home")}
      />
      {/* <DrawerItem
        label={() => <Text style={styles.label}>Chauffeurs</Text>}
        onPress={() => router.push("../screens/chauffeurs")}
      />
      <DrawerItem
        label={() => <Text style={styles.label}>Assurances</Text>}
        onPress={() => router.push("../screens/assurances")}
      />
      <DrawerItem
        label={() => <Text style={styles.label}>Contrôle Techniques</Text>}
        onPress={() => router.push("../screens/controle-techniques")}
      />
      <DrawerItem
        label={() => <Text style={styles.label}>Carte Grise</Text>}
        onPress={() => router.push("../screens/cart-grise")}
      />
      <DrawerItem
        label={() => <Text style={styles.label}>Substitutions</Text>}
        onPress={() => router.push("../screens/substitutions")}
      /> */}
    </View>
  );
};

export default function driverLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    paddingVertical: 40,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    color: "#666",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});
