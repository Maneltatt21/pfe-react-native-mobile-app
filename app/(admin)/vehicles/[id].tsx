import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { CreateCar, Vehicle } from "@/src/models/car.model";
import { useCarsStore } from "@/src/store/carsStore";
import { useTheme } from "@/src/theme/ThemeProvider";

import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export const unstable_settings = {
  drawer: null,
};

export default function VehicleDetailPage() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { fetchCar, deleteCar, editCar } = useCarsStore();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editModel, setEditModel] = useState("");
  const [editYear, setEditYear] = useState(new Date().getFullYear().toString());
  const [editRegistration, setEditRegistration] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const years = Array.from({ length: 20 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    const fetchVehicle = async () => {
      if (typeof id === "string") {
        setLoading(true);
        const data = await fetchCar(id);
        setVehicle(data ?? null);
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [fetchCar, id]);

  const confirmDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce véhicule ?",
      [
        { text: "Non", style: "cancel" },
        { text: "Oui", style: "destructive", onPress: handleDelete },
      ]
    );
  };

  const handleDelete = async () => {
    if (!vehicle) return;
    try {
      setDeleting(true);
      await deleteCar(vehicle.id.toString());
      Alert.alert("Succès", "Véhicule supprimé avec succès.");
      router.back();
    } catch (error) {
      console.error("Erreur de suppression :", error);
      Alert.alert("Erreur", "Impossible de supprimer le véhicule.");
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = () => {
    if (!vehicle) return;
    setEditModel(vehicle.model);
    setEditYear(vehicle.year.toString());
    setEditRegistration(vehicle.registration_number);
    setEditVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!vehicle) return;
    setIsEditing(true);

    const updatedCar: CreateCar = {
      model: editModel,
      year: parseInt(editYear, 10),
      registration_number: editRegistration,
    };

    try {
      await editCar(vehicle.id.toString(), updatedCar);
      setVehicle((prev) =>
        prev
          ? {
              ...prev,
              model: editModel,
              year: parseInt(editYear, 10),
              registration_number: editRegistration,
            }
          : null
      );
      setEditVisible(false);
    } catch (err) {
      Alert.alert("Erreur", "La mise à jour du véhicule a échoué.");
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <BackHeader title="Frigo" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container>
        <BackHeader title="Frigo" />
        <Text style={{ color: theme.colors.text }}>Véhicule introuvable.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <BackHeader title="Détails Véhicule" />

      <View style={[styles.detailBox, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          ID: <Text style={styles.value}>{vehicle.id}</Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Modèle: <Text style={styles.value}>{vehicle.model}</Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Année: <Text style={styles.value}>{vehicle.year}</Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Statut:{" "}
          <Text style={styles.value}>
            {vehicle.status === "active" ? "Disponible" : "Indisponible"}
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          N° d&apos;immatriculation:{" "}
          <Text style={styles.value}>{vehicle.registration_number}</Text>
        </Text>

        {vehicle.assigned_user ? (
          <>
            <View
              style={[
                styles.separator,
                { borderBottomColor: theme.colors.border },
              ]}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Chauffeur Assigné
            </Text>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Nom:{" "}
              <Text style={styles.value}>{vehicle.assigned_user.name}</Text>
            </Text>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Email:{" "}
              <Text style={styles.value}>{vehicle.assigned_user.email}</Text>
            </Text>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Rôle:{" "}
              <Text style={styles.value}>{vehicle.assigned_user.role}</Text>
            </Text>
          </>
        ) : (
          <Text
            style={[styles.label, { marginTop: 16, color: theme.colors.text }]}
          >
            🚫 Ce véhicule n&apos;a pas de chauffeur assigné.
          </Text>
        )}

        <View style={styles.actionButtons}>
          <Button title="Modifier" onPress={openEditModal} />
          <Button
            title={deleting ? "Archivage..." : "Archiver"}
            onPress={confirmDelete}
            color="red"
            disabled={deleting}
          />
        </View>
      </View>

      {/* Modal d'édition */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalBox, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Modifier Véhicule
            </Text>

            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={editModel}
              onChangeText={setEditModel}
              placeholder="Modèle"
              placeholderTextColor="#aaa"
            />

            <Text style={{ color: theme.colors.text, marginBottom: 6 }}>
              Année
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editYear}
                onValueChange={(itemValue) => setEditYear(itemValue)}
                style={{ color: theme.colors.text }}
              >
                {years.map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </View>

            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={editRegistration}
              onChangeText={setEditRegistration}
              placeholder="N° d'immatriculation"
              placeholderTextColor="#aaa"
            />

            <View style={styles.modalActions}>
              <Button title="Annuler" onPress={() => setEditVisible(false)} />
              {isEditing ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                  style={{ marginLeft: 10 }}
                />
              ) : (
                <Button title="Enregistrer" onPress={handleSaveEdit} />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  detailBox: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  value: {
    fontWeight: "bold",
    color: "#1e88e5",
  },
  separator: {
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalBox: {
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    paddingVertical: 6,
    fontSize: 16,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },
  modalActions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
