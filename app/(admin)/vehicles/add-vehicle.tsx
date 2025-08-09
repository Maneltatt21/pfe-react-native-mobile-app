// app/(admin)/vehicles/add-vehicle.tsx
import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { CreateCar } from "@/src/models/car.model";
import { useCarsStore } from "@/src/store/carsStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Picker } from "@react-native-picker/picker";

import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddVehicleScreen() {
  const { theme } = useTheme();
  const [year, setYear] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [registration, setRegistration] = useState<string>("");
  const { createCar, isLoading } = useCarsStore();

  const handleSubmit = async () => {
    const yearNum = Number(year);
    if (!yearNum || !model.trim() || !registration.trim()) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    const payload: CreateCar = {
      registration_number: registration.trim(),
      model: model.trim(),
      year: yearNum,
    };

    try {
      await createCar(payload);
      Alert.alert("Succès", "Véhicule ajouté avec succès !");
      setYear("");
      setModel("");
      setRegistration("");
      if (!isLoading) {
        router.replace("/");
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible d’ajouter le véhicule.");
    }
  };

  return (
    <Container>
      <BackHeader title="Ajouter Véhicule" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Année */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Année
          </Text>
          <View
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                padding: 0, // remove padding from input box, picker has its own
              },
            ]}
          >
            <Picker
              selectedValue={year}
              onValueChange={(itemValue) => setYear(itemValue)}
              style={{ color: theme.colors.text }}
              dropdownIconColor={theme.colors.text}
            >
              <Picker.Item label="Sélectionnez une année" value="" />
              {Array.from({ length: 20 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <Picker.Item
                    key={y}
                    label={y.toString()}
                    value={y.toString()}
                  />
                );
              })}
            </Picker>
          </View>

          {/* Modèle */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Modèle
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
              },
            ]}
            value={model}
            onChangeText={setModel}
            placeholder="Ex: Clio"
            placeholderTextColor={theme.colors.text + "99"}
          />

          {/* Numéro d'immatriculation */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Numéro d&apos;immatriculation
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
              },
            ]}
            value={registration}
            onChangeText={setRegistration}
            placeholder="Ex: TN-1234-AB"
            placeholderTextColor={theme.colors.text + "99"}
            autoCapitalize="characters"
          />

          {/* Bouton Ajouter */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.createButton },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text
              style={[styles.buttonText, { color: theme.colors.buttonText }]}
            >
              {isLoading ? "En cours…" : "Ajouter"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "500", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
});
