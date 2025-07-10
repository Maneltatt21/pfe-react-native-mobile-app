import BackHeader from "@/app/components/back-botton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export const unstable_settings = {
  drawer: null,
};
export default function VehicleDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackHeader title="Frigo" />

      <View style={styles.detailBox}>
        <Text style={styles.label}>
          ID: <Text style={styles.value}>{id}</Text>
        </Text>
        <Text style={styles.label}>
          Type: <Text style={styles.value}>Frigo</Text>
        </Text>
        <Text style={styles.label}>
          Modèle: <Text style={styles.value}>Earum</Text>
        </Text>
        <Text style={styles.label}>
          Statut: <Text style={styles.value}>Disponible</Text>
        </Text>
        <Text style={styles.label}>
          N°: <Text style={styles.value}>456</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#333" },
  detailBox: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  value: {
    fontWeight: "bold",
    color: "#000",
  },
});
