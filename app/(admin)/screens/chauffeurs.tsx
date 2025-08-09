import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { Driver } from "@/src/models/driver.model";
import { useDriversStore } from "@/src/store/deriversStore";
import { useTheme } from "@/src/theme/ThemeProvider";

import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChauffeursPage() {
  const { theme } = useTheme();
  const { fetchDrivers, drivers, isLoading } = useDriversStore();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const confirmDelete = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (selectedDriver) {
      // deleteDriver(selectedDriver.id);
      setShowModal(false);
    }
  };

  return (
    <Container>
      <BackHeader title="Chauffeurs" />
      {isLoading ? (
        <Text style={{ color: theme.colors.text, marginTop: 20 }}>
          Chargement...
        </Text>
      ) : (
        <FlatList
          data={drivers}
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
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.actionText}>Modifier</Text>
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
          contentContainerStyle={{ paddingTop: 10 }}
        />
      )}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
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
                onPress={() => setShowModal(false)}
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
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    marginBottom: 8,
  },
  vehicleBlock: {
    marginTop: 5,
    marginBottom: 10,
  },
  vehicleLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  vehicleDetails: {
    fontSize: 13,
  },
  noVehicle: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
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
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
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
  modalText: {
    color: "#fff",
    fontWeight: "600",
  },
});
