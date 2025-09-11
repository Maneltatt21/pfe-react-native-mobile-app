import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useCarStore } from "@/src/store/carStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import mime from "react-native-mime-types";

import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const { car, fetchCar } = useCarStore();

  /* --- local state ------------------------------------------------------- */
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // <-- spinner flag
  const [type, setType] = useState("carte_grise");
  const [expirationDate, setExpirationDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );

  /* --- pick file ---------------------------------------------------------- */
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFile(pickedFile);
        console.log("File selected:", pickedFile);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  /* --- upload ------------------------------------------------------------- */
  const handleAddDocument = async () => {
    if (!file || !expirationDate) {
      console.log("No file or expiration date");
      return;
    }
    const uploadUrl = `${Constants.expoConfig?.extra?.BASE_URL}/vehicles/${car.id}/documents`;
    // Get the stored auth data
    const authStorage = await AsyncStorage.getItem("auth-storage");
    if (!authStorage) {
      console.log("No auth data found");
      return;
    }

    const parsedAuth = JSON.parse(authStorage);
    const token = parsedAuth.state?.token; // extract token
    if (!token) {
      console.log("No token found in auth storage");
      return;
    }
    setIsLoading(true); // show spinner
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("expiration_date", expirationDate);
      formData.append("file", {
        uri: file.uri,
        type:
          mime.lookup(file.name) || file.mimeType || "application/octet-stream",
        name: file.name,
      } as any);

      await axios.post(uploadUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchCar(car.id); // refresh store
      setFile(null);
      setExpirationDate("");
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false); // hide spinner
      setModalVisible(false);
    }
  };

  /* --- date picker -------------------------------------------------------- */
  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate)
      setExpirationDate(selectedDate.toISOString().split("T")[0]);
    setShowDatePicker(false);
  };

  /* ----------------------------------------------------------------------- */
  /* ------------------------------  UI  ---------------------------------- */
  /* ----------------------------------------------------------------------- */
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
          {!car.documents || car.documents.length === 0 ? (
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
                    { color: "blue", textDecorationLine: "underline" },
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
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              + Ajouter un document
            </Text>
          </TouchableOpacity>
        </View>

        {/* --------------- ADD-DOCUMENT MODAL --------------- */}
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

              <Picker
                selectedValue={type}
                onValueChange={setType}
                style={{
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Picker.Item label="Carte Grise" value="carte_grise" />
                <Picker.Item label="Assurance" value="assurance" />
                <Picker.Item
                  label="Contrôle Technique"
                  value="controle_technique"
                />
              </Picker>

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.fakeInput}
              >
                <Text
                  style={[styles.fakeInputText, { color: theme.colors.text }]}
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
                />
              )}

              <TouchableOpacity onPress={pickDocument} style={styles.fakeInput}>
                <Text
                  style={[styles.fakeInputText, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {file ? file.name : "Sélectionner un fichier…"}
                </Text>
              </TouchableOpacity>

              {/* ---- buttons with spinner ---- */}
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
                    disabled={!file || !expirationDate}
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
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  fakeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    justifyContent: "center",
  },
  fakeInputText: {
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
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
  modalContent: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
