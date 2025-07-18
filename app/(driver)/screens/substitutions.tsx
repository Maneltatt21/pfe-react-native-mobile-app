import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/app/theme/ThemeProvider";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const substitutions = [
  {
    id: "1",
    originalVehicle: "Renault Clio",
    substituteVehicle: "Peugeot 208",
    date: "2024-04-10",
  },
  {
    id: "2",
    originalVehicle: "Toyota Corolla",
    substituteVehicle: "Hyundai Elantra",
    date: "2024-03-05",
  },
  {
    id: "3",
    originalVehicle: "Ford Focus",
    substituteVehicle: "Volkswagen Golf",
    date: "2024-01-20",
  },
];

export default function SubstitutionsPage() {
  const { theme } = useTheme();

  return (
    <Container>
      <BackHeader title="Substitutions" />
      <FlatList
        data={substitutions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.original, { color: theme.colors.text }]}>
              Original Vehicle: {item.originalVehicle}
            </Text>
            <Text style={[styles.substitute, { color: theme.colors.text }]}>
              Substitute Vehicle: {item.substituteVehicle}
            </Text>
            <Text style={[styles.date, { color: theme.colors.text }]}>
              Date: {item.date}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  original: {
    fontSize: 16,
    fontWeight: "600",
  },
  substitute: {
    fontSize: 16,
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    marginTop: 6,
  },
});
