import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import mime from "react-native-mime-types";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Exchange } from "@/src/models/exchange.model";
import { useCarsStore } from "@/src/store/carsStore";
import { useDriverExchangesStore } from "@/src/store/driverExchangesStore";
import useAuthStore from "@/src/store/authStore";

export default function SubstitutionsPage() {
  const { theme } = useTheme();
  const { exchanges, isLoading, fetchDriverExchanges, createExchange } =
    useDriverExchangesStore();
  const { cars, fetchCars } = useCarsStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );
  const [carsLoading, setCarsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState<{
    to_driver_id: number | null;
    vehicle_id: number | null;
    note: string;
  }>({
    to_driver_id: user?.id ?? null,
    vehicle_id: null,
    note: "",
  });

  useEffect(() => {
    const loadCarsAndExchanges = async () => {
      setCarsLoading(true);
      await fetchCars();
      await fetchDriverExchanges();
      setCarsLoading(false);
    };

    loadCarsAndExchanges();
  }, []);

  useEffect(() => {
    if (user?.id && form.to_driver_id === null) {
      setForm((prev) => ({ ...prev, to_driver_id: user.id }));
    }
  }, [user]);

  const openModal = () => {
    if (carsLoading) {
      Alert.alert("Veuillez patienter", "Chargement des véhicules en cours...");
      return;
    }
    setShowModal(true);
  };

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
    });

    if (!res.canceled) {
      setPhoto(res.assets[0]);
    }
  };

  const handleAdd = async () => {
    if (!form.to_driver_id || !form.vehicle_id || !photo) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      setIsCreating(true);

      const formData = new FormData();
      formData.append("to_driver_id", String(form.to_driver_id));
      formData.append("vehicle_id", String(form.vehicle_id));
      if (form.note) formData.append("note", form.note);

      const mimeType = mime.lookup(photo.name) || "image/jpeg";
      formData.append("before_photo", {
        uri: photo.uri,
        name: photo.name,
        type: mimeType,
      } as any);

      await createExchange(formData);

      Alert.alert("Succès", "Échange créé avec succès !");
      setForm({
        to_driver_id: user?.id ?? null,
        vehicle_id: null,
        note: "",
      });
      setPhoto(null);
      setShowModal(false);
      await fetchDriverExchanges();
    } catch (err: any) {
      console.error("createExchange failed:", err);
      Alert.alert(
        "Erreur",
        err.response?.data?.message || "Échec de la création de l'échange."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const renderItem = ({ item }: { item: Exchange }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="car-outline" size={20} color={theme.colors.text} />
        <Text style={[styles.date, { color: theme.colors.text }]}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.vehicle, { color: theme.colors.text }]}>
        Modèle du véhicule : {item.vehicle.model}
      </Text>
      <Text style={[styles.status, { color: theme.colors.text }]}>
        Statut : {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Container>
      <BackHeader title="Mes substitutions" />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={openModal}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Ajouter</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={exchanges}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ color: theme.colors.text, textAlign: "center" }}>
              Aucune substitution trouvée
            </Text>
          }
        />
      )}

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Nouvel échange
            </Text>

            <Text style={{ color: theme.colors.text, marginBottom: 4 }}>
              Sélectionner un véhicule
            </Text>
            <View
              style={[
                styles.input,
                { padding: 0, borderColor: theme.colors.border },
              ]}
            >
              <Picker
                selectedValue={form.vehicle_id}
                onValueChange={(value) => {
                  const selectedCar = cars.find((c) => c.id === value);
                  const newDriverId =
                    selectedCar?.assigned_user?.id ?? user?.id ?? null;

                  setForm({
                    ...form,
                    vehicle_id: value ? Number(value) : null,
                    to_driver_id: newDriverId,
                  });
                }}
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

            <Text
              style={{ color: theme.colors.text, marginTop: 8, fontSize: 12 }}
            >
              Conducteur cible: {form.to_driver_id ?? "Non sélectionné"}
            </Text>

            <TextInput
              placeholder="Note (optionnel)"
              placeholderTextColor="#999"
              style={[
                styles.input,
                { color: theme.colors.text, borderColor: theme.colors.border },
              ]}
              value={form.note}
              onChangeText={(v) => setForm({ ...form, note: v })}
            />

            <TouchableOpacity
              style={[styles.imagePicker, { borderColor: theme.colors.border }]}
              onPress={pickFile}
            >
              {photo ? (
                <Image source={{ uri: photo.uri }} style={styles.image} />
              ) : (
                <Text style={{ color: theme.colors.text }}>
                  Sélectionner un fichier ou image
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.colors.primary,
                    opacity: isCreating ? 0.6 : 1,
                  },
                ]}
                onPress={handleAdd}
                disabled={isCreating}
              >
                <Text style={styles.buttonText}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.error }]}
                onPress={() => setShowModal(false)}
                disabled={isCreating}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>

            {isCreating && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[styles.loadingText, { color: "#fff" }]}>
                  Création en cours...
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  date: { fontSize: 12 },
  vehicle: { marginTop: 8, fontSize: 16, fontWeight: "600" },
  status: { marginTop: 4, fontSize: 14 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  addText: { color: "#fff", marginLeft: 6, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginVertical: 8 },
  imagePicker: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  image: { width: "100%", height: "100%", borderRadius: 8 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    zIndex: 999,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
});
