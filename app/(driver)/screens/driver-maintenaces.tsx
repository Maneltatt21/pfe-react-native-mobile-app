import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useDriverStore } from "@/src/store/driverStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export const unstable_settings = { drawer: null };

export default function DriverMaintenancesPage() {
  const { theme } = useTheme();
  const { maintenance } = useDriverStore();

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
            {maintenance?.length ? (
              <Text style={{ color: theme.colors.text, padding: 16 }}>
                Aucun entretien disponible.
              </Text>
            ) : (
              maintenance.map((m) => (
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
                    {m.type}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { color: theme.colors.text, flex: 1.5 },
                    ]}
                    numberOfLines={1}
                  >
                    {m.notes}
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
                    {new Date(m.date).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
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
