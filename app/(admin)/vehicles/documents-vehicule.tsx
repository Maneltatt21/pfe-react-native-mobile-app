import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useCarStore } from "@/src/store/carStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";

export const unstable_settings = {
  drawer: null,
};

export default function VehicleDocumentsPage() {
  const { theme } = useTheme();
  const { car, errors, isLoading, fetchCar, deleteCar, editCar, clearErrors } =
    useCarStore();

  return (
    <Container>
      <BackHeader title="Documents" />
      {/* Documents Table */}
      <View
        style={[styles.tableContainer, { backgroundColor: theme.colors.card }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Documents
        </Text>
        {car.documents?.length === 0 || !car.documents ? (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Aucun document disponible.
          </Text>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: theme.colors.text, flex: 1 },
                ]}
              >
                Type
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: theme.colors.text, flex: 1.5 },
                ]}
              >
                Expiration
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: theme.colors.text, flex: 2 },
                ]}
              >
                Fichier
              </Text>
            </View>
            {car.documents.map((doc) => (
              <View key={doc.id} style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {doc.type}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { color: theme.colors.text, flex: 1.5 },
                  ]}
                >
                  {new Date(doc.expiration_date).toLocaleDateString()}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { color: theme.colors.text, flex: 2 },
                  ]}
                  numberOfLines={1}
                >
                  {doc.file_path?.split("/").pop() ?? "No file"}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  detailBox: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  value: {
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  tableContainer: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    fontSize: 14,
    textAlign: "left",
  },
});
