import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/app/theme/ThemeProvider";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddVehiculePage() {
  const { theme } = useTheme(); // 👈 get current theme
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [registration, setRegistration] = useState("");

  const handleSubmit = () => {
    if (!brand || !model || !registration) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    Alert.alert("Succès", "Véhicule ajouté avec succès !");
    setBrand("");
    setModel("");
    setRegistration("");
  };

  return (
    <Container>
      <BackHeader title="Ajouter Véhicule" />
      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Marque</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
            },
          ]}
          value={brand}
          onChangeText={setBrand}
          placeholder="Ex: Renault"
          placeholderTextColor={theme.colors.text + "99"}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Modèle</Text>
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
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.createButton },
          ]}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
            Ajouter
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
