import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/src/theme/ThemeProvider";
import Constants from "expo-constants";

import { useDriverStore } from "@/src/store/driverStore";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

export const unstable_settings = { drawer: null };

export default function VehicleDocumentsPage() {
  const { theme } = useTheme();
  const { documents } = useDriverStore();
  console.log("doc length : ", documents.length);
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
          {documents.length === 0 ? (
            <Text style={{ color: theme.colors.text, padding: 16 }}>
              Aucun document disponible.
            </Text>
          ) : (
            documents.map((doc) => (
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
                  {new Date(doc.expiryDate).toLocaleDateString()}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "blue", textDecorationLine: "underline" },
                  ]}
                  onPress={() => {
                    if (doc.url) {
                      Linking.openURL(
                        `${Constants.expoConfig?.extra?.APP_STORAGE_URL}/${doc.url}`
                      ).catch((err) =>
                        console.error("Failed to open file:", err)
                      );
                    }
                  }}
                >
                  {doc.url ? "View File" : ""}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* --------------- ADD-DOCUMENT MODAL --------------- */}
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
