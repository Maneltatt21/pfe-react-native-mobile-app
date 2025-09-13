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
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      await createExchange({
        from_driver_id: 1, // Replace with CURRENT_USER_ID if needed
        to_driver_id: form.to_driver_id,
        vehicle_id: form.vehicle_id,
        note: form.note || undefined,
        // image: form.image || undefined, // handle image upload separately
      });

      setForm({
        to_driver_id: null,
        vehicle_id: null,
        note: "",
        image: "",
      });
      setShowModal(false);
    } catch (err) {
      Alert.alert("Error", "Failed to create exchange.");
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
        Vehicle Model: {item.vehicle.model}
      </Text>
      <Text style={[styles.status, { color: theme.colors.text }]}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Container>
      <BackHeader title="My Substitutions" />

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
              No substitutions found
            </Text>
          }
        />
      )}

      {/* Modal Form */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              New Exchange
            </Text>

            {/* Vehicle Picker */}
            <Text style={{ color: theme.colors.text, marginBottom: 4 }}>
              Select Vehicle
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
                <Picker.Item label="Select vehicle" value={null} />
                {cars.map((car) => (
                  <Picker.Item
                    key={car.id}
                    label={`${car.model} (${car.registration_number})`}
                    value={car.id}
                  />
                ))}
              </Picker>
            </View>

            {/* Auto-filled To Driver ID */}
            {/* <TextInput
              placeholder="To Driver ID"
              placeholderTextColor="#999"
              keyboardType="numeric"
              style={[styles.input, { color: theme.colors.text }]}
              value={form.to_driver_id ? form.to_driver_id.toString() : ""}
              onChangeText={(v) =>
                setForm({ ...form, to_driver_id: Number(v) })
              }
            /> */}

            {/* Optional Note */}
            <TextInput
              placeholder="Note (optional)"
              placeholderTextColor="#999"
              style={[styles.input, { color: theme.colors.text }]}
              value={form.note}
              onChangeText={(v) => setForm({ ...form, note: v })}
            />

            {/* Image Picker */}
            <TouchableOpacity
              style={[styles.imagePicker, { borderColor: theme.colors.border }]}
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 0.7,
                });
                if (!result.canceled) {
                  setForm({ ...form, image: result.assets[0].uri });
                }
              }}
            >
              {form.image ? (
                <Image
                  source={{ uri: form.image }}
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                />
              ) : (
                <Text style={{ color: theme.colors.text }}>Select Image</Text>
              )}
            </TouchableOpacity>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#ccc" }]}
                onPress={() => setShowModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleAdd}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  addText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
  },
  vehicle: {
    fontSize: 14,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  imagePicker: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
});
