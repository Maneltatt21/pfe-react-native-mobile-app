import { useCarsStore } from "@/app/store/carsStore";
import { useTheme } from "@/app/theme/ThemeProvider";
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

export default function VehicleSearchScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { cars } = useCarsStore();

  // 🔍 Filter logic - checks both brand and model
  const filteredCars = cars.filter((car) =>
    `${car.registration_number} ${car.model}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* 🔙 Header with search */}
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
          placeholder="Rechercher un véhicule..."
          placeholderTextColor={theme.colors.text + "99"}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 🚘 Result List */}
      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.result, { borderBottomColor: theme.colors.border }]}
            onPress={() =>
              router.push({
                pathname: "/vehicles/[id]",
                params: {
                  id: item.id,
                },
              })
            }
          >
            <Text style={[styles.resultText, { color: theme.colors.text }]}>
              {item.registration_number} - {item.model}
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
    fontSize: 16,
  },
  backButton: {
    width: 30,
    alignItems: "flex-start",
  },
});
