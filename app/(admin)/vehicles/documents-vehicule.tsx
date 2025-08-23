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
  const { car } = useCarStore();

  return (
    <Container>
      <BackHeader title="Documents" />

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
              Type
            </Text>
            <Text
              style={[
                styles.tableCellHeader,
                { color: theme.colors.text, flex: 1.5 },
              ]}
            >
              Expiration
            </Text>
            <Text
              style={[
                styles.tableCellHeader,
                { color: theme.colors.text, flex: 2 },
              ]}
            >
              Fichier
            </Text>
          </View>

          {/* Rows */}
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
            ))
          )}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {},
  table: {
    borderRadius: 12,
    overflow: "hidden",
  },
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
