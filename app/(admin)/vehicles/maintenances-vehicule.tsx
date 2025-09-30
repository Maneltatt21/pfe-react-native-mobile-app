import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useCarStore } from "@/src/store/carStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import mime from "react-native-mime-types";

export const unstable_settings = { drawer: null };

export default function VehicleMaintenancesPage() {
  const { theme } = useTheme();
  const { car, fetchCar, createCarMaintenance, isLoading } = useCarStore();
  const { carId } = useLocalSearchParams<{ carId: string }>();

  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("Oil Change");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [reminder, setReminder] = useState("");
  const [invoice, setInvoice] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [minReminder, setMinReminder] = useState<Date | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fetch car on mount
  useEffect(() => {
    fetchCar(Number(carId));
  }, [carId]);

  // Pick invoice file
  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });
    if (!res.canceled) setInvoice(res.assets[0]);
  };

  // Submit maintenance
  const onSubmit = async () => {
    if (!type || !description || !date || !reminder || !invoice) {
      console.log("All fields are required");
      return;
    }

    const authStorage = await AsyncStorage.getItem("auth-storage");
    if (!authStorage) return console.log("No auth data found");

    const parsedAuth = JSON.parse(authStorage);
    const token = parsedAuth.state?.token;
    if (!token) return console.log("No token found");

    const formData = new FormData();
    formData.append("maintenance_type", type);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("reminder_date", reminder);
    formData.append("invoice", {
      uri: invoice.uri,
      type: mime.lookup(invoice.name) || "application/octet-stream",
      name: invoice.name,
    } as any);

    try {
      setLoadingSubmit(true);
      await createCarMaintenance(Number(carId), formData);

      // Reset form
      setType("Oil Change");
      setDescription("");
      setDate("");
      setReminder("");
      setInvoice(null);
      setVisible(false);
    } catch (err) {
      console.error("Failed to add maintenance:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (isLoading || !car) {
    return (
      <Container>
        <BackHeader title="Maintenances" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <BackHeader title="Maintenances" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.content}>
          <View style={[styles.table, { backgroundColor: theme.colors.card }]}>
            <View
              style={[
                styles.tableRowHeader,
                { backgroundColor: theme.colors.border },
              ]}
            >
              {["Type", "Description", "Date", "Rappel", "Facture"].map(
                (h, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.tableCellHeader,
                      {
                        color: theme.colors.text,
                        flex: i === 1 || i === 4 ? 1.5 : 1,
                      },
                    ]}
                  >
                    {h}
                  </Text>
                )
              )}
            </View>

            {car.maintenances.length > 0 ? (
              car.maintenances.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.tableRow,
                    { borderBottomColor: theme.colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      { color: theme.colors.text, flex: 1 },
                    ]}
                  >
                    {m.maintenance_type}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { color: theme.colors.text, flex: 1.5 },
                    ]}
                    numberOfLines={1}
                  >
                    {m.description}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { color: theme.colors.text, flex: 1 },
                    ]}
                  >
                    {new Date(m.date).toLocaleDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { color: theme.colors.text, flex: 1 },
                    ]}
                  >
                    {new Date(m.reminder_date).toLocaleDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { color: "blue", textDecorationLine: "underline" },
                    ]}
                    onPress={() => {
                      if (m.invoice_path) {
                        Linking.openURL(
                          `${Constants.expoConfig?.extra?.APP_STORAGE_URL}/${m.invoice_path}`
                        ).catch(console.error);
                      }
                    }}
                  >
                    {m.invoice_path ? "View File" : ""}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ padding: 12, color: theme.colors.text }}>
                No maintenances found
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.tableRowAdd,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setVisible(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              + Ajouter une maintenance
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Nouvelle maintenance
            </Text>

            <Picker
              style={{ color: theme.colors.text }}
              selectedValue={type}
              onValueChange={setType}
            >
              <Picker.Item label="Oil Change" value="Oil Change" />
              <Picker.Item label="Tire Rotation" value="Tire Rotation" />
              <Picker.Item label="Brake Service" value="Brake Service" />
            </Picker>

            <TextInput
              placeholder="Description"
              placeholderTextColor={theme.colors.text}
              value={description}
              onChangeText={setDescription}
              style={[
                styles.fakeInput,
                { color: theme.colors.text, borderColor: theme.colors.border },
              ]}
            />

            <TouchableOpacity
              onPress={() => setShowDate(true)}
              style={styles.fakeInput}
            >
              <Text
                style={[styles.fakeInputText, { color: theme.colors.text }]}
              >
                {date
                  ? new Date(date).toLocaleDateString()
                  : "Sélectionner une date…"}
              </Text>
            </TouchableOpacity>
            {showDate && (
              <DateTimePicker
                value={date ? new Date(date) : new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(_, d) => {
                  setShowDate(false);
                  if (d) {
                    setDate(d.toISOString().split("T")[0]);
                    setReminder("");
                    setMinReminder(d);
                  }
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => date && setShowReminder(true)}
              style={[styles.fakeInput, !date && { opacity: 0.5 }]}
              disabled={!date}
            >
              <Text
                style={[styles.fakeInputText, { color: theme.colors.text }]}
              >
                {reminder
                  ? new Date(reminder).toLocaleDateString()
                  : date
                  ? "Sélectionner une date de rappel…"
                  : "Choisissez d’abord une date"}
              </Text>
            </TouchableOpacity>
            {showReminder && date && (
              <DateTimePicker
                value={
                  reminder
                    ? new Date(reminder)
                    : new Date(
                        new Date(date).setDate(new Date(date).getDate() + 1)
                      )
                }
                mode="date"
                display="default"
                minimumDate={
                  new Date(new Date(date).setDate(new Date(date).getDate() + 1))
                }
                onChange={(_, r) => {
                  setShowReminder(false);
                  if (r) setReminder(r.toISOString().split("T")[0]);
                }}
              />
            )}

            <TouchableOpacity onPress={pickFile} style={styles.fakeInput}>
              <Text
                style={[styles.fakeInputText, { color: theme.colors.text }]}
              >
                {invoice ? invoice.name : "Sélectionner une facture…"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <Button
                title="Annuler"
                onPress={() => {
                  setDescription("");
                  setDate("");
                  setReminder("");
                  setInvoice(null);
                  setVisible(false);
                }}
              />
              {loadingSubmit ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Button
                  title="Ajouter"
                  onPress={onSubmit}
                  disabled={!date || !reminder || !invoice}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingVertical: 30 },
  content: { flex: 1 },
  table: { borderRadius: 12, overflow: "hidden", marginTop: 10 },
  tableRowHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableCellHeader: { flex: 1, fontSize: 14, fontWeight: "600" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
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
  modalContent: { width: "90%", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  fakeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    justifyContent: "center",
  },
  fakeInputText: { fontSize: 14 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
