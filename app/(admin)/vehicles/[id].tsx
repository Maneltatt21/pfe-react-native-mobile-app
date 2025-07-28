import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { Vehicle } from "@/app/models/car.model";
import { useCarsStore } from "@/app/store/carsStore";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const unstable_settings = {
  drawer: null,
};

export default function VehicleDetailPage() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { fetchCar, deleteCar } = useCarsStore();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (typeof id === "string") {
        setLoading(true);
        const data = await fetchCar(id);
        setVehicle(data ?? null);
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [fetchCar, id]);

  const confirmDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce véhicule ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  };

  const handleDelete = async () => {
    if (!vehicle) return;
    try {
      await deleteCar(vehicle.id.toString()).then(() => {
        Alert.alert("Succès", "Véhicule supprimé avec succès.");
      });
      router.back();
    } catch (error) {
      console.error("Erreur de suppression :", error);
      Alert.alert("Erreur", "Impossible de supprimer le véhicule.");
    } finally {
      setDeleting(false);
    }
  };

  const goToEdit = () => {
    router.push(`/vehicles/${vehicle?.id}/edit`);
  };

  if (loading) {
    return (
      <Container>
        <BackHeader title="Frigo" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container>
        <BackHeader title="Frigo" />
        <Text style={{ color: theme.colors.text }}>Véhicule introuvable.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <BackHeader title="Détails Véhicule" />

      <View style={[styles.detailBox, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          ID:{" "}
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            {vehicle.id}
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Modèle:{" "}
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            {vehicle.model}
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Année:{" "}
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            {vehicle.year}
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Statut:{" "}
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            {vehicle.status === "active" ? "Disponible" : "Indisponible"}
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          N° d&apos;immatriculation:{" "}
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            {vehicle.registration_number}
          </Text>
        </Text>

        {vehicle.assigned_user ? (
          <>
            <View
              style={[
                styles.separator,
                { borderBottomColor: theme.colors.border },
              ]}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Chauffeur Assigné
            </Text>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Nom:{" "}
              <Text style={[styles.value, { color: theme.colors.primary }]}>
                {vehicle.assigned_user.name}
              </Text>
            </Text>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Email:{" "}
              <Text style={[styles.value, { color: theme.colors.primary }]}>
                {vehicle.assigned_user.email}
              </Text>
            </Text>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Rôle:{" "}
              <Text style={[styles.value, { color: theme.colors.primary }]}>
                {vehicle.assigned_user.role}
              </Text>
            </Text>
          </>
        ) : (
          <Text
            style={[styles.label, { marginTop: 16, color: theme.colors.text }]}
          >
            🚫 Ce véhicule n&apos;a pas de chauffeur assigné.
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <Button title="Mettre à jour" onPress={goToEdit} />
        <Button
          title={deleting ? "Suppression..." : "Supprimer"}
          onPress={confirmDelete}
          color="red"
          disabled={deleting}
        />
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
  separator: {
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
});
