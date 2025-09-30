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
  const { car } = useCarStore();

  // Handle case when car is null or undefined
  if (!car) {
    return (
      <Container>
        <BackHeader title="Échanges" />
        <View style={styles.content}>
          <Text style={{ color: theme.colors.text, padding: 16 }}>
            Aucun véhicule sélectionné.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <BackHeader title="Échanges" />

      <View style={styles.content}>
        <View style={styles.table}>
          {/* Header */}
          <View
            style={[
              styles.tableRowHeader,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text
              style={[
                styles.tableCellHeader,
                { color: theme.colors.text, flex: 1 },
              ]}
            >
              De
            </Text>
            <Text
              style={[
                styles.tableCellHeader,
                { color: theme.colors.text, flex: 1 },
              ]}
            >
              À
            </Text>
            <Text
              style={[
                styles.tableCellHeader,
                { color: theme.colors.text, flex: 1.5 },
              ]}
            >
              Date
            </Text>
            <Text
              style={[
                styles.tableCellHeader,
                { color: theme.colors.text, flex: 1 },
              ]}
            >
              Statut
            </Text>
            <Text
              style={[
                styles.tableCellHeader,
                { color: theme.colors.text, flex: 2 },
              ]}
            >
              Note
            </Text>
          </View>

          {/* Rows */}
          {!car.exchanges || car.exchanges.length === 0 ? (
            <Text style={{ color: theme.colors.text, padding: 16 }}>
              Aucun échange disponible.
            </Text>
          ) : (
            car.exchanges.map((e) => (
              <View
                key={e.id}
                style={[
                  styles.tableRow,
                  {
                    backgroundColor: theme.colors.card,
                    borderBottomColor: theme.colors.border,
                  },
                ]}
              >
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
            ))
          )}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    // marginTop: 20,
    // paddingHorizontal: 10,
  },
  table: {
    borderRadius: 12,
    overflow: "hidden",
    // marginTop: 10,
  },
  tableRowHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  tableRowAdd: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
});
