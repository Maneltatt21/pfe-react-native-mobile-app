import ConfirmModal from "@/app/components/confirm-model";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DrawerParamList = {
  Home: undefined;
};

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    router.replace("/");
    console.log("Logging out...");
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => dropdownVisible && setDropdownVisible(false)}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={toggleDropdown}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
            <View style={styles.driverLabelContainer}>
              <Text style={styles.driverLabel}>Driver</Text>
              <Ionicons name="chevron-down" size={18} color="#333" />
            </View>
          </TouchableOpacity>
        </View>

        {dropdownVisible && (
          <Pressable style={styles.dropdown}>
            <Pressable onPress={handleLogout} style={styles.dropdownItem}>
              <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </Pressable>
        )}

        <ConfirmModal
          visible={showLogoutModal}
          title="Logout"
          message="Are you sure you want to logout?"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
          confirmText="Logout"
          cancelText="Cancel"
        />
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F9F9F9",
  },
  scrollContainer: {
    justifyContent: "flex-start",
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarContainer: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  driverLabelContainer: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  driverLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 4,
  },
  dropdown: {
    position: "absolute",
    top: 60,
    right: 16,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
    padding: 8,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  logoutText: {
    marginLeft: 8,
    color: "#e74c3c",
    fontWeight: "600",
    fontSize: 16,
  },
});
