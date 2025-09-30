import { useAuth } from "@/app/components/authProvider";
import ConfirmModal from "@/app/components/confirm-model";
import Container from "@/app/components/container";
import { useDriverStore } from "@/src/store/driverStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type DrawerParamList = {
  Home: undefined;
};

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const { driver, fetchDriverProfile } = useDriverStore();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isMounted = useRef(true);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  const handleLogout = () => setShowLogoutModal(true);

  useEffect(() => {
    if (isMounted.current && user?.id) {
      fetchDriverProfile();
    }
  }, [fetchDriverProfile, user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const confirmLogout = async () => {
    if (!isMounted.current) return;

    setShowLogoutModal(false);

    try {
      // Let the AuthProvider handle navigation - don't call router.replace here
      await logout();
    } catch (err) {
      console.error("Échec de la déconnexion:", err);
      // Only show error if component is still mounted
      if (isMounted.current) {
        // Handle error - maybe show a toast or alert
      }
    }
  };

  const navigateToDocuments = () => {
    if (!isMounted.current || !driver?.vehicle) return;

    try {
      router.push("/(driver)/screens/driver-documents");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const navigateToMaintenances = () => {
    if (!isMounted.current || !driver?.vehicle) return;

    try {
      router.push("/(driver)/screens/driver-maintenaces");
    } catch (error) {
      console.error("Navigation error:", error);
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

          <View>
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
                <Text
                  style={[styles.driverLabel, { color: theme.colors.text }]}
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                    : "Chauffeur"}
                </Text>
                <Ionicons
                  name={dropdownVisible ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.colors.text}
                />
              </View>
            </TouchableOpacity>

            {dropdownVisible && (
              <View
                style={[
                  styles.dropdown,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleLogout}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={theme.colors.error || "red"}
                  />
                  <Text
                    style={[
                      styles.logoutText,
                      { color: theme.colors.error || "red" },
                    ]}
                  >
                    Déconnexion
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <Container>
          <View
            style={[styles.detailBox, { backgroundColor: theme.colors.card }]}
          >
            {driver?.vehicle ? (
              <>
                {/* <Text style={[styles.label, { color: theme.colors.text }]}>
                  ID: <Text style={styles.value}>{driver.vehicle.id}</Text>
                </Text> */}
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Modèle:{" "}
                  <Text style={styles.value}>{driver.vehicle.model}</Text>
                </Text>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Année: <Text style={styles.value}>{driver.vehicle.year}</Text>
                </Text>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Statut:
                  <Text style={styles.value}>
                    {driver.vehicle.status === "active"
                      ? "Disponible"
                      : "Indisponible"}
                  </Text>
                </Text>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  N° d&apos;immatriculation:
                  <Text style={styles.value}>
                    {driver.vehicle.registration_number}
                  </Text>
                </Text>
              </>
            ) : (
              <Text
                style={[
                  styles.label,
                  { marginTop: 16, color: theme.colors.error || "red" },
                ]}
              >
                🚫 Aucun véhicule assigné pour vous.
              </Text>
            )}

            {user && (
              <>
                <View
                  style={[
                    styles.separator,
                    { borderBottomColor: theme.colors.border },
                  ]}
                />
                <Text
                  style={[styles.sectionTitle, { color: theme.colors.text }]}
                >
                  Chauffeur Assigné
                </Text>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Nom: <Text style={styles.value}>{user.name}</Text>
                </Text>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Email: <Text style={styles.value}>{user.email}</Text>
                </Text>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Rôle: <Text style={styles.value}>{user.role}</Text>
                </Text>
              </>
            )}
          </View>

          {/* Links */}
          <Pressable
            disabled={!driver?.vehicle}
            onPress={navigateToDocuments}
            style={[
              styles.row,
              {
                backgroundColor: theme.colors.card,
                opacity: driver?.vehicle ? 1 : 0.5,
              },
            ]}
          >
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Documents
            </Text>
            <Icon name="chevron-right" size={24} color="#666" />
          </Pressable>

          <Pressable
            disabled={!driver?.vehicle}
            onPress={navigateToMaintenances}
            style={[
              styles.row,
              {
                backgroundColor: theme.colors.card,
                opacity: driver?.vehicle ? 1 : 0.5,
              },
            ]}
          >
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Maintenances
            </Text>
            <Icon name="chevron-right" size={24} color="#666" />
          </Pressable>
        </Container>

        <ConfirmModal
          visible={showLogoutModal}
          title="Déconnexion"
          message="Êtes-vous sûr de vouloir vous déconnecter ?"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
          confirmText="Déconnexion"
          cancelText="Annuler"
        />
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
  scrollContainer: { justifyContent: "flex-start" },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  driverLabelContainer: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  driverLabel: { fontSize: 16, fontWeight: "600", marginRight: 4 },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 180,
    borderRadius: 12,
    elevation: 4,
    padding: 8,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  logoutText: { marginLeft: 8, fontWeight: "600", fontSize: 16 },
  detailBox: { padding: 16, borderRadius: 12, elevation: 2, marginTop: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  value: { fontWeight: "bold", color: "#1e88e5" },
  separator: { borderBottomWidth: 1, marginVertical: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  row: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
