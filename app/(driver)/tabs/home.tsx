import { useAuth } from "@/app/components/authProvider";
import ConfirmModal from "@/app/components/confirm-model";
import { useTheme } from "@/app/theme/ThemeProvider"; // make sure path is correct
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
  const { theme } = useTheme();
  const { logout, user } = useAuth();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      router.replace("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onPress={() => dropdownVisible && setDropdownVisible(false)}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: theme.colors.appBar }]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.avatarContainer,
              { backgroundColor: theme.colors.card },
            ]}
            onPress={toggleDropdown}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
            <View style={styles.driverLabelContainer}>
              <Text style={[styles.driverLabel, { color: theme.colors.text }]}>
                {user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : "Driver"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={theme.colors.text}
              />
            </View>
          </TouchableOpacity>
        </View>

        {dropdownVisible && (
          <Pressable
            style={[styles.dropdown, { backgroundColor: theme.colors.card }]}
          >
            <Pressable onPress={handleLogout} style={styles.dropdownItem}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.colors.deleteButton}
              />
              <Text
                style={[
                  styles.logoutText,
                  { color: theme.colors.deleteButton },
                ]}
              >
                Logout
              </Text>
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
    paddingTop: 16,
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
    marginRight: 4,
  },
  dropdown: {
    position: "absolute",
    top: 60,
    right: 16,
    width: 150,
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
    fontWeight: "600",
    fontSize: 16,
  },
});
