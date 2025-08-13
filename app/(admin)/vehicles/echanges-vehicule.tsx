import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useCarStore } from "@/src/store/carStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";

export const unstable_settings = {
  drawer: null,
};

export default function VehicleEchangesPage() {
  const { theme } = useTheme();
  const { car, errors, isLoading, fetchCar, deleteCar, editCar, clearErrors } =
    useCarStore();

  return (
    <Container>
      <BackHeader title="Echanges" />
      <View
        style={[styles.tableContainer, { backgroundColor: theme.colors.card }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Échanges
        </Text>
        {car.exchanges?.length === 0 || !car.exchanges ? (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Aucun échange disponible.
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
                De
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: theme.colors.text, flex: 1 },
                ]}
              >
                À
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: theme.colors.text, flex: 1.5 },
                ]}
              >
                Date
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: theme.colors.text, flex: 1 },
                ]}
              >
                Statut
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: theme.colors.text, flex: 2 },
                ]}
              >
                Note
              </Text>
            </View>
            {car.exchanges.map((e) => (
              <View key={e.id} style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {e.from_driver_id}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {e.to_driver_id}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { color: theme.colors.text, flex: 1.5 },
                  ]}
                >
                  {new Date(e.request_date).toLocaleDateString()}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {e.status}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { color: theme.colors.text, flex: 2 },
                  ]}
                  numberOfLines={1}
                >
                  {e.note}
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
