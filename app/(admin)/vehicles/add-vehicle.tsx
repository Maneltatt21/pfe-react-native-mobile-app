import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
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
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [registration, setRegistration] = useState("");

  const handleSubmit = () => {
    if (!brand || !model || !registration) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    // Here you'd normally send data to your API or state manager
    Alert.alert("Succès", "Véhicule ajouté avec succès !");
    setBrand("");
    setModel("");
    setRegistration("");
  };

  return (
    <Container>
      <BackHeader title="Ajouter Véhicule" />
      <View style={styles.form}>
        <Text style={styles.label}>Marque</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
          placeholder="Ex: Renault"
        />

        <Text style={styles.label}>Modèle</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="Ex: Clio"
        />

        <Text style={styles.label}>Numéro d&apos;immatriculation</Text>
        <TextInput
          style={styles.input}
          value={registration}
          onChangeText={setRegistration}
          placeholder="Ex: TN-1234-AB"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Ajouter</Text>
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
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
