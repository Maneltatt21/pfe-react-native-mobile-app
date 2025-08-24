/* VehicleDocumentsPage.tsx */
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
  Button,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const unstable_settings = { drawer: null };
const STORAGE_URL = `http://${Constants.expoConfig?.extra?.APP_IP_EMULATOR_DEVICE}:8000/storage`;

export default function VehicleDocumentsPage() {
  const { theme } = useTheme();
  const { car } = useCarStore();

  /* --- local state ------------------------------------------------------- */
  const [isModalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("carte_grise");
  const [expirationDate, setExpirationDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );

  /* --- pick file ---------------------------------------------------------- */

  // const pickDocument = async () => {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: ["application/pdf", "image/jpeg", "image/png"],
  //     });

  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       const file = result.assets[0]; // <-- file details here
  //       console.log("File URI:", file.uri);
  //       console.log("File Name:", file.name);
  //       console.log("File Type:", file.mimeType);
  //       console.log("File Size:", file.size);

  //       return file; // return file to use later
  //     } else {
  //       console.log("User canceled file picker");
  //     }
  //   } catch (error) {
  //     console.error("Error picking document:", error);
  //   }
  // };
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFile(pickedFile); // ✅ save in state
        console.log("File selected:", pickedFile);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const handleAddDocument = async () => {
    if (!file || !expirationDate) {
      console.log("No file or expiration date");
      return;
    }

    const BASE_URL = `http://${Constants.expoConfig?.extra?.APP_IP_EMULATOR_DEVICE}:8000/api/v1`;
    const STORAGE_URL = `http://${Constants.expoConfig?.extra?.APP_IP_EMULATOR_DEVICE}:8000/storage`;

    const uploadUrl = `${BASE_URL}/vehicles/${car.id}/documents`;
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

      // const token =
      //   "Bearer 101|LodlbXhku0iUlX7GV97OY3qGMms14UcmImqcc2QW8846e256"; // replace with dynamic auth

      const res = await axios.post(uploadUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload success:", res.data);

      // reset UI
      setModalVisible(false);
      setFile(null);
      setExpirationDate("");
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  /* --- date picker -------------------------------------------------------- */
  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "android");
    if (selectedDate)
      setExpirationDate(selectedDate.toISOString().split("T")[0]);
  };

  /* ----------------------------------------------------------------------- */
  /* ------------------------------  UI  ---------------------------------- */
  /* ----------------------------------------------------------------------- */
  return (
    <Container>
      <BackHeader title="Documents" />
      <View style={styles.content}>
        {/* … the rest of your UI remains identical … */}
        {car.documents?.length === 0 || !car.documents ? (
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
                    Linking.openURL(`${STORAGE_URL}/${doc.file_path}`).catch(
                      (err) => console.error("Failed to open file:", err)
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

      {/* Modal identical to your code */}
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
              style={styles.pickFileBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {expirationDate || "Sélectionner une date"}
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

            <TouchableOpacity style={styles.pickFileBtn} onPress={pickDocument}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {file ? "Changer le fichier" : "Sélectionner un fichier"}
              </Text>
            </TouchableOpacity>
            {file && (
              <Text
                style={{ marginTop: 8, fontSize: 14, color: theme.colors.text }}
              >
                {file.name}
              </Text>
            )}

            <View style={styles.modalActions}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} />
              <Button title="Ajouter" onPress={handleAddDocument} />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  table: { borderRadius: 12, overflow: "hidden", marginTop: 10 },
  tableRowHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  tableCell: { flex: 1, fontSize: 14 },
  tableRowAdd: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
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
  pickFileBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
