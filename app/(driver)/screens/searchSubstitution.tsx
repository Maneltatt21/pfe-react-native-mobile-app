import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

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

export default function SubstitutionsSearch() {
  const { theme } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredSubstitutions = substitutions.filter((sub) =>
    [sub.originalVehicle, sub.substituteVehicle].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const capitalizeFirstLetter = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  return (
    <Container>
      <View>
        <BackHeader title="Search" />
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.input,
              {
                borderBottomColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="Search by vehicle..."
            placeholderTextColor={theme.colors.text + "99"}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      <FlatList
        data={filteredSubstitutions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.original, { color: theme.colors.text }]}>
              Original Vehicle: {capitalizeFirstLetter(item.originalVehicle)}
            </Text>
            <Text style={[styles.substitute, { color: theme.colors.text }]}>
              Substitute Vehicle:{" "}
              {capitalizeFirstLetter(item.substituteVehicle)}
            </Text>
            <Text style={[styles.date, { color: theme.colors.text }]}>
              Date: {item.date}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingTop: 10 }}
        ListEmptyComponent={
          <Text style={[styles.noResult, { color: theme.colors.text + "99" }]}>
            No substitutions found
          </Text>
        }
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
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
  noResult: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
