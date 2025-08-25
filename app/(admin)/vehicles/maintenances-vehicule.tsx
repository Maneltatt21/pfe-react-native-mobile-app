import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useCarStore } from "@/src/store/carStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import mime from "react-native-mime-types";

export const unstable_settings = { drawer: null };

export default function VehicleMaintenancesPage() {
  const { theme } = useTheme();
  const { car, fetchCar } = useCarStore();

  /* --- modal & form state ------------------------------------------------- */
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("Oil Change");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [reminder, setReminder] = useState("");
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const [minReminder, setMinReminder] = useState<Date | null>(null);
  const [invoice, setInvoice] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  /* --- pick invoice file -------------------------------------------------- */
  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });
    if (!res.canceled) setInvoice(res.assets[0]);
  };

  /* --- submit ------------------------------------------------------------- */
  const onSubmit = async () => {
    if (!date || !reminder || !invoice) {
      console.log("No file , date or reminder ");
      return;
    }
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
    const form = new FormData();
    form.append("maintenance_type", type);
    form.append("description", description);
    form.append("date", date);
    form.append("reminder_date", reminder);
    form.append("invoice", {
      uri: invoice.uri,
      type: mime.lookup(invoice.name) || "application/octet-stream",
      name: invoice.name,
    } as any);

    setLoading(true);
    try {
      await axios.post(
        `${Constants.expoConfig?.extra?.BASE_URL}/vehicles/${car.id}/maintenances`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await fetchCar(car.id);
      setVisible(false);
      /* reset form */
      setDescription("");
      setDate("");
      setReminder("");
      setInvoice(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
            {/* header */}
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

            {/* rows */}
            {!car.maintenances?.length ? (
              <Text style={{ color: theme.colors.text, padding: 16 }}>
                Aucun entretien disponible.
              </Text>
            ) : (
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
                        ).catch((err) =>
                          console.error("Failed to open file:", err)
                        );
                      }
                    }}
                  >
                    {m.invoice_path ? "View File" : ""}
                  </Text>
                </View>
              ))
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

      {/* ------------- Modal ------------- */}
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
              style={[{ color: theme.colors.text }]}
              selectedValue={type}
              onValueChange={setType}
            >
              <Picker.Item label="Oil Change" value="Oil Change" />
              <Picker.Item label="Tire Rotation" value="Tire Rotation" />
              <Picker.Item label="Brake Service" value="Brake Service" />
            </Picker>
            <TextInput
              placeholder="Description (optionnel)"
              placeholderTextColor={theme.colors.text}
              value={description}
              onChangeText={setDescription}
              style={[
                styles.fakeInput,
                { color: theme.colors.text, borderColor: theme.colors.border },
              ]}
            />
            {/* ------------- DATE ------------- */}
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
                minimumDate={new Date()} // today
                onChange={(_, d) => {
                  setShowDate(false);
                  if (d) {
                    const iso = d.toISOString().split("T")[0];
                    setDate(iso);
                    setReminder(""); // reset reminder when date changes
                    setMinReminder(d); // reminder ≥ this date
                  }
                }}
              />
            )}

            {/* ------------- REMINDER ------------- */}
            <TouchableOpacity
              onPress={() => date && setShowReminder(true)} // only open if date chosen
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
            {showReminder &&
              date &&
              (() => {
                const nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                return (
                  <DateTimePicker
                    value={reminder ? new Date(reminder) : nextDay}
                    mode="date"
                    display="default"
                    minimumDate={nextDay}
                    onChange={(_, r) => {
                      setShowReminder(false);
                      if (r) setReminder(r.toISOString().split("T")[0]);
                    }}
                  />
                );
              })()}
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
              {loading ? (
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
  modalContent: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
  },
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
