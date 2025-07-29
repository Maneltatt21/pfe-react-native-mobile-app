import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/app/theme/ThemeProvider";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const controlesTechniques = [
  { id: "1", vehicle: "Renault Clio", date: "2024-05-15", status: "Passed" },
  { id: "2", vehicle: "Peugeot 208", date: "2023-11-20", status: "Failed" },
  { id: "3", vehicle: "Toyota Corolla", date: "2024-02-10", status: "Passed" },
];

export default function ControleTechniquePage() {
  const { theme } = useTheme();
  return (
    <Container>
      <BackHeader title="Contrôle Technique" />
      <FlatList
        data={controlesTechniques}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.vehicle, { color: theme.colors.text }]}>
              {item.vehicle}
            </Text>
            <Text style={[styles.date, { color: theme.colors.text }]}>
              Date: {item.date}
            </Text>
            <Text
              style={[
                styles.status,
                { color: theme.colors.text },
                item.status === "Passed"
                  ? { color: theme.colors.primary }
                  : { color: theme.colors.deleteButton },
              ]}
            >
              Status:{item.status}
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
  vehicle: {
    fontSize: 18,
    fontWeight: "500",
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  passed: {},
  failed: {},
});
