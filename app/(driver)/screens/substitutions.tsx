import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function SubstitutionsPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const { exchanges, isLoading, fetchDriverExchanges, createExchange } =
    useDriverExchangesStore();
  const { cars, fetchCars } = useCarsStore();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    to_driver_id: null as number | null,
    vehicle_id: null as number | null,
    note: "",
    image: "",
  });

  useEffect(() => {
    fetchCars();
    fetchDriverExchanges();
  }, []);

  const handleAdd = async () => {
    if (!form.to_driver_id || !form.vehicle_id) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      await createExchange({
        from_driver_id: 1, // Remplacer par CURRENT_USER_ID si nécessaire
        to_driver_id: form.to_driver_id,
        vehicle_id: form.vehicle_id,
        note: form.note || undefined,
        // image: form.image || undefined, // gérer le téléchargement d'image séparément
      });

      setForm({
        to_driver_id: null,
        vehicle_id: null,
        note: "",
        image: "",
      });
      setShowModal(false);
    } catch (err) {
      Alert.alert("Erreur", "Échec de la création de l’échange.");
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
        onPress={() => setShowModal(true)}
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

      {/* Formulaire dans une fenêtre modale */}
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

            {/* Sélecteur de véhicule */}
            <Text style={{ color: theme.colors.text, marginBottom: 4 }}>
              Sélectionner un véhicule
            </Text>
            <View style={[styles.input, { padding: 0 }]}>
              <Picker
                selectedValue={form.vehicle_id}
                onValueChange={(value) => {
                  const selectedCar = cars.find((c) => c.id === value);
                  setForm({
                    ...form,
                    vehicle_id: value ? Number(value) : null,
                    to_driver_id: selectedCar?.assigned_user?.id ?? null,
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

            {/* Note optionnelle */}
            <TextInput
              placeholder="Note (optionnel)"
              placeholderTextColor="#999"
              style={[styles.input, { color: theme.colors.text }]}
              value={form.note}
              onChangeText={(v) => setForm({ ...form, note: v })}
            />

            {/* Sélecteur d’image */}
            <TouchableOpacity
              style={[styles.imagePicker, { borderColor: theme.colors.border }]}
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: false,
                  aspect: [4, 3],
                  quality: 1,
                });
                if (!result.canceled) {
                  setForm({ ...form, image: result.assets[0].uri });
                }
              }}
            >
              {form.image ? (
                <Image source={{ uri: form.image }} style={styles.image} />
              ) : (
                <Text style={{ color: theme.colors.text }}>
                  Sélectionner une image
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleAdd}
              >
                <Text style={styles.buttonText}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.error }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
  },
  vehicle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    marginTop: 4,
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  addText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  imagePicker: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
