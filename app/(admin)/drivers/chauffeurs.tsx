import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { Driver } from "@/src/models/driver.model";
import { useCarsStore } from "@/src/store/carsStore";
import { useDriversStore } from "@/src/store/deriversStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChauffeursPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const { fetchDrivers, deleteDriver, assigneDriver, drivers, isLoading } =
    useDriversStore();

  const { cars, fetchCars } = useCarsStore();

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [form, setForm] = useState<{ vehicle_id: number | null }>({
    vehicle_id: null,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchDrivers();
    fetchCars();
  }, [fetchDrivers, fetchCars]);

  const confirmDelete = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (selectedDriver) {
      deleteDriver(selectedDriver.id);
      setShowDeleteModal(false);
    }
  };

  const openAssignModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setForm({
      vehicle_id: driver.vehicle_id ?? null,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    if (selectedDriver) {
      await assigneDriver(selectedDriver.id, form.vehicle_id!);
      setShowUpdateModal(false);
    }
  };

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchText.toLowerCase()) ||
      d.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container>
      <BackHeader title="Chauffeurs" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
          gap: 10,
        }}
      >
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.text + "33",
            },
          ]}
        >
          <TextInput
            placeholder="Rechercher un chauffeur..."
            placeholderTextColor={theme.colors.text + "88"}
            value={searchText}
            onChangeText={setSearchText}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(admin)/drivers/add-driver")}
          style={[styles.newButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.newButtonText}>+ Nouveau</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={{ color: theme.colors.text, marginTop: 20 }}>
          Chargement...
        </Text>
      ) : (
        <FlatList
          data={filteredDrivers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.name, { color: theme.colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.email, { color: theme.colors.text }]}>
                {item.email}
              </Text>

              {item.vehicle ? (
                <View style={styles.vehicleBlock}>
                  <Text
                    style={[styles.vehicleLabel, { color: theme.colors.text }]}
                  >
                    Véhicule: {item.vehicle.model} (
                    {item.vehicle.registration_number})
                  </Text>
                  <Text
                    style={[
                      styles.vehicleDetails,
                      { color: theme.colors.text },
                    ]}
                  >
                    Année: {item.vehicle.year} - Statut: {item.vehicle.status}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.noVehicle, { color: theme.colors.text }]}>
                  Véhicule non assigné
                </Text>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openAssignModal(item)}
                >
                  <Text style={styles.actionText}>Assigné</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(item)}
                >
                  <Text style={styles.actionText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
        />
      )}

      {/* Delete Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Confirmer la suppression
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.text }]}>
              Voulez-vous vraiment supprimer ce chauffeur ?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={styles.modalCancel}
              >
                <Text style={styles.modalText}>Annuler</Text>
              </Pressable>
              <Pressable onPress={handleDelete} style={styles.modalDelete}>
                <Text style={styles.modalText}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update / Assign Vehicle Modal */}
      <Modal visible={showUpdateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Modifier chauffeur / Assigné une voiture
            </Text>

            <View
              style={[
                styles.input,
                { padding: 0, borderColor: theme.colors.border },
              ]}
            >
              <Picker
                selectedValue={form.vehicle_id}
                onValueChange={(value) =>
                  setForm({ ...form, vehicle_id: value ? Number(value) : null })
                }
                style={{ color: theme.colors.text }}
              >
                <Picker.Item label="Choisir un véhicule" value={null} />
                {cars.map((car) => (
                  <Picker.Item
                    key={car.id}
                    label={`${car.model} (${car.registration_number})`}
                    value={car.id}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowUpdateModal(false)}
                style={styles.modalCancel}
              >
                <Text style={styles.modalText}>Annuler</Text>
              </Pressable>
              <Pressable onPress={handleUpdate} style={styles.editButton}>
                <Text style={styles.modalText}>Enregistrer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  email: { fontSize: 14, marginBottom: 8 },
  vehicleBlock: { marginTop: 5, marginBottom: 10 },
  vehicleLabel: { fontSize: 14, fontWeight: "600" },
  vehicleDetails: { fontSize: 13 },
  noVehicle: { fontSize: 13, fontStyle: "italic", marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#dc3545",
    borderRadius: 5,
  },
  createButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  actionText: { color: "#fff", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { padding: 20, borderRadius: 10, width: "85%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalMessage: { fontSize: 15, marginBottom: 20 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  modalCancel: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#6c757d",
    borderRadius: 5,
  },
  modalDelete: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#dc3545",
    borderRadius: 5,
  },
  modalText: { color: "#fff", fontWeight: "600" },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: { flex: 1, fontSize: 15 },
  newButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  newButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
