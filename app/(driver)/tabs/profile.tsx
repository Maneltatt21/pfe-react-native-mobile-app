// app/(driver)/profile.tsx
import { useTheme } from "@/src/theme/ThemeProvider";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfileStore } from "@/src/store/profileStore";

export default function DriverProfile() {
  const { theme, toggleTheme } = useTheme();
  const { user, fetchProfile, updateProfile, isLoading } = useProfileStore();

  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    try {
      const updateData: { name: string; email: string; password?: string } = {
        name,
        email,
      };
      if (password.trim()) {
        updateData.password = password;
      }
      await updateProfile(updateData);
      Alert.alert("Succès", "Profil mis à jour avec succès !");
      setModalVisible(false);
      setPassword(""); // Clear password after update
    } catch (err) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />

        <Text style={[styles.name, { color: theme.colors.text }]}>
          {user?.name || "Nom inconnu"}
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            E-mail :
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {user?.email || "Non renseigné"}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.settingRow}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Mode sombre
            </Text>
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              thumbColor={
                theme.isDark ? theme.colors.primary : theme.colors.border
              }
              trackColor={{
                false: theme.colors.sidebar,
                true: theme.colors.sidebar,
              }}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.updateButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.updateText}>Mettre à jour le profil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for updating profile */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Mettre à jour le profil
            </Text>

            <TextInput
              style={[
                styles.input,
                { borderColor: theme.colors.border, color: theme.colors.text },
              ]}
              placeholder="Nom"
              placeholderTextColor={theme.colors.text + "99"}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.colors.border, color: theme.colors.text },
              ]}
              placeholder="E-mail"
              placeholderTextColor={theme.colors.text + "99"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.colors.success },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: theme.colors.text }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleUpdate}
                disabled={isLoading}
              >
                <Text style={{ color: "#fff" }}>
                  {isLoading ? "..." : "Enregistrer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 24 },
  name: { fontSize: 26, fontWeight: "700", marginBottom: 30 },
  infoRow: { width: "100%", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  value: { fontSize: 18 },
  content: { width: "100%" },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  updateButton: { paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  updateText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { width: "90%", borderRadius: 10, padding: 20 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
});
