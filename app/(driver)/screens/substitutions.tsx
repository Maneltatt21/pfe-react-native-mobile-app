import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const router = useRouter();

  return (
    <Container>
      <BackHeader title="Substitutions" />
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => router.push("/(driver)/screens/searchSubstitution")}
        >
          <Ionicons
            name="search"
            size={18}
            color={theme.colors.text}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[styles.searchPlaceholder, { color: theme.colors.text }]}
          >
            Rechercher un véhicule...
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: theme.colors.createButton },
          ]}
          onPress={() => router.push("/(driver)/screens/searchSubstitution")}
        >
          <Ionicons name="add" size={20} color={theme.colors.buttonText} />
          <Text
            style={[styles.addButtonText, { color: theme.colors.buttonText }]}
          >
            Ajouter
          </Text>
        </TouchableOpacity>
      </View>
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
    borderWidth: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
  },
  addButtonText: {
    fontWeight: "600",
    marginLeft: 6,
  },
  searchPlaceholder: {
    fontSize: 14,
  },
});
