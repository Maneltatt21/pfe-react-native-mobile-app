import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useCarStore } from "@/src/store/carStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";

import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const unstable_settings = { drawer: null };

export default function VehicleDocumentsPage() {
  const { theme } = useTheme();
  const { car, fetchCar, createCarDocument } = useCarStore();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("carte_grise");
  const [expirationDate, setExpirationDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get today's date for minimum date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day

  /* Pick document */
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true, // Important for React Native
      });
      if (!result.canceled && result.assets?.length) {
        setFile(result.assets[0]);
        setErrorMessage(null); // Clear previous errors
        console.log("File selected:", result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      setErrorMessage("Erreur lors de la sélection du fichier");
    }
  };

  /* Upload */
  const handleAddDocument = async () => {
    if (!file || !expirationDate || !car?.id) {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(expirationDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setErrorMessage("La date d'expiration ne peut pas être dans le passé");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Get token
      const authStorage = await AsyncStorage.getItem("auth-storage");
      if (!authStorage) throw new Error("No auth data");

      const { state } = JSON.parse(authStorage);
      const token = state?.token;
      if (!token) throw new Error("No token found");

      // Create FormData
      const formData = new FormData();
      formData.append("type", type);
      formData.append("expiration_date", expirationDate);
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || "image/png",
        name: file.name,
      } as any);

      console.log("📤 Uploading with fetch...");

      // Use fetch instead of axios
      const response = await fetch(
        `${Constants.expoConfig?.extra?.BASE_URL}/vehicles/${car.id}/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      console.log("📨 Fetch response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("✅ Upload successful:", result);

      // Refresh data using your store
      await fetchCar(car.id);

      // Reset form
      setFile(null);
      setExpirationDate("");
      setModalVisible(false);
    } catch (err: any) {
      console.error("❌ Upload failed:", err);
      setErrorMessage(err.message || "Erreur lors de l'upload");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      // Validate the selected date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setErrorMessage("La date d'expiration ne peut pas être dans le passé");
        setShowDatePicker(false);
        return;
      }

      setExpirationDate(selectedDate.toISOString().split("T")[0]);
      setErrorMessage(null); // Clear any previous date errors
    }
    setShowDatePicker(false);
  };

  // Helper function to check if a date is valid (not in past)
  const isDateValid = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  return (
    <Container>
      <BackHeader title="Documents" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: theme.colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {!car?.documents || car.documents.length === 0 ? (
            <Text style={{ color: theme.colors.text, padding: 16 }}>
              Aucun document disponible.
            </Text>
          ) : (
            car.documents.map((doc) => (
              <View
                key={doc.id}
                style={[
                  styles.tableRow,
                  {
                    backgroundColor: theme.colors.card,
                    borderBottomColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.tableCell, { color: theme.colors.text }]}>
                  {doc.type}
                </Text>
                <Text style={[styles.tableCell, { color: theme.colors.text }]}>
                  {new Date(doc.expiration_date).toLocaleDateString()}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    {
                      color:
                        doc.expiration_date && !isDateValid(doc.expiration_date)
                          ? theme.colors.error
                          : "blue",
                      textDecorationLine: "underline",
                    },
                  ]}
                  onPress={() => {
                    if (doc.file_path) {
                      Linking.openURL(
                        `${Constants.expoConfig?.extra?.APP_STORAGE_URL}/${doc.file_path}`
                      ).catch((err) =>
                        console.error("Failed to open file:", err)
                      );
                    }
                  }}
                >
                  {doc.file_path ? "View File" : ""}
                </Text>
              </View>
            ))
          )}

          <TouchableOpacity
            style={[
              styles.tableRowAdd,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => {
              setModalVisible(true);
              setErrorMessage(null); // Clear errors when opening modal
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              + Ajouter un document
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Nouveau Document
              </Text>

              {/* Error Message */}
              {errorMessage && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errorMessage}
                </Text>
              )}

              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Picker
                  selectedValue={type}
                  onValueChange={setType}
                  style={{ color: theme.colors.text }}
                >
                  <Picker.Item label="Carte Grise" value="carte_grise" />
                  <Picker.Item label="Assurance" value="assurance" />
                  <Picker.Item
                    label="Contrôle Technique"
                    value="controle_technique"
                  />
                </Picker>
              </View>

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.fakeInput,
                  {
                    borderColor:
                      expirationDate && !isDateValid(expirationDate)
                        ? theme.colors.error
                        : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.fakeInputText,
                    {
                      color:
                        expirationDate && !isDateValid(expirationDate)
                          ? theme.colors.error
                          : theme.colors.text,
                    },
                  ]}
                >
                  {expirationDate
                    ? new Date(expirationDate).toLocaleDateString()
                    : "Sélectionner une date…"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={expirationDate ? new Date(expirationDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={today} // This prevents selecting past dates in the picker
                />
              )}

              <TouchableOpacity
                onPress={pickDocument}
                style={[styles.fakeInput, { borderColor: theme.colors.border }]}
              >
                <Text
                  style={[styles.fakeInputText, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {file ? file.name : "Sélectionner un fichier…"}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <Button
                  title="Annuler"
                  onPress={() => setModalVisible(false)}
                />
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                ) : (
                  <Button
                    title="Ajouter"
                    onPress={handleAddDocument}
                    disabled={!file || !expirationDate || isLoading}
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Container>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  content: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingVertical: 30 },
  fakeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    justifyContent: "center",
  },
  fakeInputText: { fontSize: 14 },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tableCell: { flex: 1, fontSize: 14, textAlign: "center" },
  tableRowAdd: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { width: "90%", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,0,0,0.1)",
  },
});
