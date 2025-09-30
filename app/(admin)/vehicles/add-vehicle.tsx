// app/(admin)/vehicles/add-vehicle.tsx
import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { CreateCar } from "@/src/models/car.model";
import { useCarsStore } from "@/src/store/carsStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Picker } from "@react-native-picker/picker";

import { router } from "expo-router";
import React, { useRef, useState } from "react";
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
  const [firstPart, setFirstPart] = useState<string>(""); // 3 numbers
  const [secondPart, setSecondPart] = useState<string>(""); // 4 numbers
  const [type, setType] = useState<string>(""); // <-- vehicle type
  const { createCar, isLoading } = useCarsStore();

  const firstPartRef = useRef<TextInput>(null);
  const secondPartRef = useRef<TextInput>(null);

  // Handle first part input (3 numbers)
  const handleFirstPartChange = (text: string) => {
    const numbersOnly = text.replace(/[^0-9]/g, "").substring(0, 3);
    setFirstPart(numbersOnly);
    if (numbersOnly.length === 3) {
      secondPartRef.current?.focus();
    }
  };

  // Handle second part input (4 numbers)
  const handleSecondPartChange = (text: string) => {
    const numbersOnly = text.replace(/[^0-9]/g, "").substring(0, 4);
    setSecondPart(numbersOnly);
  };

  // Combine parts into full registration number
  const getFullRegistration = (): string => {
    return `${firstPart}-TN-${secondPart}`;
  };

  // Validate if all parts are complete
  const isRegistrationComplete = (): boolean => {
    return firstPart.length === 3 && secondPart.length === 4;
  };

  const handleSubmit = async () => {
    const yearNum = Number(year);

    if (!yearNum || !model.trim() || !isRegistrationComplete() || !type) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    const fullRegistration = getFullRegistration();

    const payload: CreateCar = {
      registration_number: fullRegistration,
      model: model.trim(),
      year: yearNum,
      type: type, // <-- added type
    };

    try {
      await createCar(payload);
      Alert.alert("Succès", "Véhicule ajouté avec succès !");
      setYear("");
      setModel("");
      setFirstPart("");
      setSecondPart("");
      setType(""); // reset type
      if (!isLoading) {
        router.replace("/");
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'ajouter le véhicule.");
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
                padding: 0,
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

          {/* Type */}
          <Text style={[styles.label, { color: theme.colors.text }]}>Type</Text>
          <View
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                padding: 0,
              },
            ]}
          >
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
              style={{ color: theme.colors.text }}
              dropdownIconColor={theme.colors.text}
            >
              <Picker.Item label="Sélectionnez un type" value="" />
              <Picker.Item label="Sec" value="sec" />
              <Picker.Item label="Frigo" value="frigo" />
            </Picker>
          </View>

          {/* Numéro d'immatriculation - Multi Input */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Numéro d&apos;immatriculation
          </Text>

          <View style={styles.registrationContainer}>
            <View style={styles.registrationPart}>
              <TextInput
                ref={firstPartRef}
                style={[
                  styles.registrationInput,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                  },
                ]}
                value={firstPart}
                onChangeText={handleFirstPartChange}
                placeholder="123"
                placeholderTextColor={theme.colors.text + "99"}
                keyboardType="number-pad"
                maxLength={3}
                returnKeyType="next"
                onSubmitEditing={() => secondPartRef.current?.focus()}
              />
              <Text
                style={[styles.registrationLabel, { color: theme.colors.text }]}
              >
                {firstPart.length}/3
              </Text>
            </View>

            <View style={styles.separatorContainer}>
              <Text style={[styles.separator, { color: theme.colors.text }]}>
                TN
              </Text>
            </View>

            <View style={styles.registrationPart}>
              <TextInput
                ref={secondPartRef}
                style={[
                  styles.registrationInput,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                  },
                ]}
                value={secondPart}
                onChangeText={handleSecondPartChange}
                placeholder="4567"
                placeholderTextColor={theme.colors.text + "99"}
                keyboardType="number-pad"
                maxLength={4}
                returnKeyType="done"
              />
              <Text
                style={[styles.registrationLabel, { color: theme.colors.text }]}
              >
                {secondPart.length}/4
              </Text>
            </View>
          </View>

          {isRegistrationComplete() && (
            <View style={styles.previewContainer}>
              <Text
                style={[
                  styles.previewLabel,
                  { color: theme.colors.text + "99" },
                ]}
              >
                Numéro complet:
              </Text>
              <Text style={[styles.previewValue, { color: theme.colors.text }]}>
                {getFullRegistration()}
              </Text>
            </View>
          )}

          <Text style={[styles.hint, { color: theme.colors.text + "99" }]}>
            Format: 3 chiffres + TN + 4 chiffres
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  isRegistrationComplete() && type
                    ? theme.colors.createButton
                    : theme.colors.createButton + "80",
              },
            ]}
            onPress={handleSubmit}
            disabled={isLoading || !isRegistrationComplete() || !type}
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
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  registrationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  registrationPart: {
    flex: 1,
    alignItems: "center",
  },
  registrationInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    minWidth: 80,
  },
  registrationLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "400",
  },
  separatorContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  separator: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  previewLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  previewValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hint: {
    fontSize: 12,
    marginBottom: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
