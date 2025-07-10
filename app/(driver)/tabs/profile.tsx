import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DriverProfile() {
  const user = {
    name: "Helmi Rmili",
    email: "helmi@example.com",
    phone: "+216 123 456 789",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />

        <Text style={styles.name}>{user.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#333",
    marginBottom: 30,
  },
  infoRow: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
    color: "#111",
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
});
