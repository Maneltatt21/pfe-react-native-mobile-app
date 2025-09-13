import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { CreateCar } from "@/src/models/car.model";
import { useCarStore } from "@/src/store/carStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // or Ionicons / Feather etc.

export const unstable_settings = {
  drawer: null,
};

export default function VehicleDetailPage() {
  const { id } = useLocalSearchParams();

  const { theme } = useTheme();
  const { car, errors, isLoading, fetchCar, deleteCar, editCar, clearErrors } =
    useCarStore();
  const router = useRouter();

  const [editVisible, setEditVisible] = useState(false);
  const [editModel, setEditModel] = useState("");
  const [editYear, setEditYear] = useState(new Date().getFullYear().toString());
  const [editRegistration, setEditRegistration] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const years = Array.from({ length: 20 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    fetchCar(Number(id));
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
    try {
      await deleteCar(car!.id.toString());
      Alert.alert("Succès", "Véhicule supprimé avec succès.");
      router.back();
    } catch (error) {
      console.error("Erreur de suppression :", error);
      Alert.alert("Erreur", "Impossible de supprimer le véhicule.");
    }
  };

  const openEditModal = () => {
    setEditModel(car!.model);
    setEditYear(car!.year.toString());
    setEditRegistration(car!.registration_number);
    setEditVisible(true);
  };

  const handleSaveEdit = async () => {
    setIsEditing(true);
    const updatedCar: CreateCar = {
      model: editModel,
      year: parseInt(editYear, 10),
      registration_number: editRegistration,
    };

    try {
      await editCar(id[0], updatedCar);
      setEditVisible(false);
    } catch (err) {
      Alert.alert("Erreur", "La mise à jour du véhicule a échoué.");
    } finally {
      setIsEditing(false);
    }
  };

  if (!id) {
    // Defensive fallback in case id is missing
    return <Text>ID du véhicule invalide</Text>;
  }
  if (isLoading) {
    return (
      <Container>
        <BackHeader title="" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }
  return (
    <Container>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <BackHeader title={car!.model} />
        <View
          style={[styles.detailBox, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.label, { color: theme.colors.text }]}>
            ID : <Text style={styles.value}>{car!.id}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Modèle : <Text style={styles.value}>{car!.model}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Année : <Text style={styles.value}>{car!.year}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Statut :
            <Text style={styles.value}>
              {car!.status === "active" ? "Disponible" : "Indisponible"}
            </Text>
          </Text>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Numéro d&apos;immatriculation :
            <Text style={styles.value}>{car!.registration_number}</Text>
          </Text>

          {car!.assigned_user ? (
            <>
              <View
                style={[
                  styles.separator,
                  { borderBottomColor: theme.colors.border },
                ]}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Chauffeur assigné
              </Text>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Nom :{" "}
                <Text style={styles.value}>{car!.assigned_user.name}</Text>
              </Text>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                E-mail :
                <Text style={styles.value}>{car!.assigned_user.email}</Text>
              </Text>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Rôle :{" "}
                <Text style={styles.value}>{car!.assigned_user.role}</Text>
              </Text>
            </>
          ) : (
            <Text
              style={[
                styles.label,
                { marginTop: 16, color: theme.colors.text },
              ]}
            >
              🚫 Aucun chauffeur assigné à ce véhicule.
            </Text>
          )}

          <View style={styles.actionButtons}>
            <Button title="Modifier" onPress={openEditModal} />
            <Button title="Archiver" onPress={confirmDelete} color="red" />
          </View>
        </View>

        <Pressable
          onPress={() =>
            router.navigate({
              pathname: "/vehicles/documents-vehicule",
              params: { carId: car!.id }, // pass the car ID
            })
          }
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: theme.colors.card },
            // pressed && styles.pressed,
          ]}
        >
          <Text style={{ color: theme.colors.text }}>Documents</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </Pressable>

        <Pressable
          onPress={() =>
            router.navigate({
              pathname: "/vehicles/maintenances-vehicule",
              params: { carId: car!.id }, // pass the car ID
            })
          }
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: theme.colors.card },
            // pressed && styles.pressed,
          ]}
        >
          <Text style={{ color: theme.colors.text }}>Maintenances</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </Pressable>
        {errors.length > 0 && (
          <View
            style={[
              styles.tableContainer,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Erreurs
            </Text>
            {errors.map((error, index) => (
              <Text
                key={index}
                style={[styles.label, { color: theme.colors.error || "red" }]}
              >
                [{new Date(error.timestamp).toLocaleString()}] {error.operation}
                :{error.message}
              </Text>
            ))}
            <Button title="Effacer les erreurs" onPress={clearErrors} />
          </View>
        )}
        <Modal visible={editVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalBox, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Modifier le véhicule
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
                placeholder="Numéro d'immatriculation"
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
      </ScrollView>
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
  tableContainer: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    fontSize: 14,
    textAlign: "left",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20, // Ensure content doesn't get cut off at the bottom
  },
  row: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pressed: {
    backgroundColor: "#f2f2f2",
  },
});
