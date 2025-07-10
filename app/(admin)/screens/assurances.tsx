import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const assurances = [
  { id: "1", company: "Assurance Tunisienne", policyNumber: "AT-123456" },
  { id: "2", company: "Société d Assurance", policyNumber: "SA-987654" },
  { id: "3", company: "Assurances Globales", policyNumber: "AG-456789" },
];

export default function AssurancesPage() {
  return (
    <Container>
      <BackHeader title="Assurances" />
      <FlatList
        data={assurances}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.policy}>Policy #: {item.policyNumber}</Text>
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
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  company: {
    fontSize: 18,
    fontWeight: "500",
  },
  policy: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
