import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export const unstable_settings = {
  drawer: null,
};

export default function VehicleDetailPage() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();

  return (
    <Container>
      <BackHeader title="Frigo" />
      <View style={[styles.detailBox, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          ID :
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            {id}
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Type :
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            Frigo
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Modèle :
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            Earum
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Statut :
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            Disponible
          </Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          N° :
          <Text style={[styles.value, { color: theme.colors.primary }]}>
            456
          </Text>
        </Text>
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
});
