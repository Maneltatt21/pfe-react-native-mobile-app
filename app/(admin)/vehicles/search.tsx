import { useTheme } from "@/app/theme/ThemeProvider"; // ⬅️ import theme hook
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const carData = [
  { id: "1", type: "Frigo", model: "A1" },
  { id: "2", type: "Fourgon", model: "B2" },
  { id: "3", type: "Froid", model: "C3" },
  { id: "4", type: "Fract", model: "D4" },
  { id: "5", type: "Camion", model: "E5" },
];

export default function VehicleSearchScreen() {
  const { theme } = useTheme(); // ⬅️ get current theme
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredCars = carData.filter((car) =>
    car.type.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              borderBottomColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="Rechercher un type..."
          placeholderTextColor={theme.colors.text + "99"}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.result}>
            <Text style={[styles.resultText, { color: theme.colors.text }]}>
              {item.type} - {item.model}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.noResult, { color: theme.colors.text + "99" }]}>
            Aucun véhicule trouvé
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    marginLeft: 12,
    flex: 1,
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  result: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
  },
  noResult: {
    textAlign: "center",
    marginTop: 20,
  },
  backButton: {
    width: 30,
    alignItems: "flex-start",
  },
});
