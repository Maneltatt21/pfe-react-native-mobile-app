import { useAuth } from "@/app/components/authProvider";
import ConfirmModal from "@/app/components/confirm-model";
import { useCarsStore } from "@/src/store/carsStore";
import { useTheme } from "@/src/theme/ThemeProvider";

import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function AdminDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const { fetchCars, cars, nbCars, nbCarsAssigne, nbCarsDisponible } =
    useCarsStore();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout, user } = useAuth();

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

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
            <View style={styles.adminLabelContainer}>
              <Text style={[styles.adminLabel, { color: theme.colors.text }]}>
                {user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : "Admin"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={theme.colors.text}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Véhicules Totaux
              </Text>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {nbCars}
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Véhicules Assigné
              </Text>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {nbCarsAssigne}
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Véhicules Disponible
              </Text>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {nbCarsDisponible}
              </Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.searchContainer,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => router.push("/(admin)/vehicles/search")}
            >
              <Ionicons
                name="search"
                size={18}
                color={theme.colors.text}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.searchPlaceholder, { color: theme.colors.text }]}
              >
                Rechercher un véhicule...
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: theme.colors.createButton },
              ]}
              onPress={() => router.push("/(admin)/vehicles/add-vehicle")}
            >
              <Ionicons name="add" size={20} color={theme.colors.buttonText} />
              <Text
                style={[
                  styles.addButtonText,
                  { color: theme.colors.buttonText },
                ]}
              >
                Ajouter
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.table}>
            <View
              style={[
                styles.tableRowHeader,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Text
                style={[styles.tableCellHeader, { color: theme.colors.text }]}
              >
                #
              </Text>
              <Text
                style={[styles.tableCellHeader, { color: theme.colors.text }]}
              >
                N°
              </Text>
              <Text
                style={[styles.tableCellHeader, { color: theme.colors.text }]}
              >
                Type
              </Text>
              <Text
                style={[styles.tableCellHeader, { color: theme.colors.text }]}
              >
                Model
              </Text>
            </View>

            {Array.isArray(cars) && cars.length > 0 ? (
              cars.map((vehicle, index) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor: theme.colors.card,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/vehicles/[id]",
                      params: {
                        id: vehicle.id,
                        type: vehicle.year,
                        model: vehicle.model,
                      },
                    })
                  }
                >
                  <Text
                    style={[styles.tableCell, { color: theme.colors.text }]}
                  >
                    {vehicle.id}
                  </Text>
                  <Text
                    style={[styles.tableCell, { color: theme.colors.text }]}
                  >
                    {vehicle.registration_number}
                  </Text>
                  <Text
                    style={[styles.tableCell, { color: theme.colors.text }]}
                  >
                    {vehicle.year}
                  </Text>
                  <Text
                    style={[styles.tableCell, { color: theme.colors.text }]}
                  >
                    {vehicle.model}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: theme.colors.text, padding: 16 }}>
                No vehicles found.
              </Text>
            )}
            <TouchableOpacity
              onPress={() => router.push("/(admin)/vehicles/add-vehicle")}
            >
              <View
                style={[
                  styles.tableRowAdd,
                  {
                    backgroundColor: theme.colors.createButton,
                  },
                ]}
              >
                <Text
                  style={[styles.tableCell, { color: theme.colors.buttonText }]}
                >
                  +
                </Text>
                <Text
                  style={[styles.tableCell, { color: theme.colors.buttonText }]}
                >
                  ---
                </Text>
                <Text
                  style={[styles.tableCell, { color: theme.colors.buttonText }]}
                >
                  Ajouter
                </Text>
                <Text
                  style={[styles.tableCell, { color: theme.colors.buttonText }]}
                >
                  un véhicule
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ConfirmModal
          visible={showLogoutModal}
          title="Logout"
          message="Are you sure you want to logout?"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
          confirmText="Logout"
          cancelText="Cancel"
        />
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
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, backgroundColor: "transparent" },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    width: 180,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    elevation: 2,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  adminLabelContainer: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  adminLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  dropdown: {
    position: "absolute",
    top: 60,
    right: 16,
    width: 180,
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    width: "100%",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
    borderWidth: 1,
  },
  searchPlaceholder: {
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
  },
  addButtonText: {
    fontWeight: "600",
    marginLeft: 6,
  },
  table: {
    paddingVertical: 20,
    width: "100%",
    paddingHorizontal: 16,
  },
  tableRowHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tableRowAdd: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  tableCellHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
});
