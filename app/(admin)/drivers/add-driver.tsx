import { useAuth } from "@/app/components/authProvider";
import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useDriversStore } from "@/src/store/deriversStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from "react-native";

export default function AddDriver() {
  const { theme } = useTheme();
  const { register, isLoading: authLoading } = useAuth();
  const fetchDrivers = useDriversStore((state) => state.fetchDrivers);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "chauffeur",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // Clear error on input change
  };

  const getFriendlyErrorMessage = (error: string) => {
    switch (error) {
      case "Please fill in all fields":
        return "Please enter full name, email, password, confirm password, and select a role.";
      case "Invalid email format":
        return "Please enter a valid email address.";
      case "Password too short":
        return "Password must be at least 6 characters long.";
      case "Passwords do not match":
        return "Passwords do not match. Please ensure both passwords are identical.";
      case "User already exists":
        return "This email is already registered. Please use a different email.";
      default:
        return "Failed to create account. Please try again.";
    }
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !formData.role
    ) {
      setError("Please fill in all fields");
      return false;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      setError("Password too short");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.role
      );

      if (success) {
        // ✅ Notify user on success
        Alert.alert("Succès", "Le chauffeur a été créé avec succès !", [
          { text: "OK" },
        ]);

        // Optionally reset the form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "chauffeur",
        });
      } else {
        setError("User already exists");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
      await fetchDrivers();
    }
  };

  return (
    <Container>
      <BackHeader title="Créer un chauffeur" />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <StatusBar translucent />
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { backgroundColor: theme.colors.background },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.form, { backgroundColor: theme.colors.card }]}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Nom complet
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.colors.text}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Entrez le nom complet"
                  placeholderTextColor={theme.colors.border}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange("fullName", value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading && !authLoading}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Email
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.text}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Entrez votre adresse e-mail"
                  placeholderTextColor={theme.colors.border}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !authLoading}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Mot de passe
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.text}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Entrez un mot de passe"
                  placeholderTextColor={theme.colors.border}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !authLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Confirmer le mot de passe
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.text}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Confirmez le mot de passe"
                  placeholderTextColor={theme.colors.border}
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !authLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error */}
            {error && (
              <View
                style={[
                  styles.errorContainer,
                  {
                    backgroundColor: theme.colors.deleteButton
                      ? `${theme.colors.deleteButton}80`
                      : "rgba(255, 0, 0, 0.5)",
                  },
                ]}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color={theme.colors.deleteButton || "red"}
                  style={styles.errorIcon}
                />
                <Text
                  style={[
                    styles.errorText,
                    { color: theme.colors.deleteButton || "red" },
                  ]}
                >
                  {getFriendlyErrorMessage(error)}
                </Text>
              </View>
            )}

            {/* Signup Button */}
            <TouchableOpacity
              style={[
                styles.signupButton,
                { backgroundColor: theme.colors.primary },
                (isLoading || authLoading) && { opacity: 0.7 },
              ]}
              onPress={handleSignup}
              disabled={isLoading || authLoading}
            >
              <Text
                style={[
                  styles.signupButtonText,
                  { color: theme.colors.buttonText },
                ]}
              >
                {isLoading || authLoading
                  ? "Créer un chauffeur..."
                  : "Créer un chauffeur"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  form: {
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, height: 48, paddingHorizontal: 12, fontSize: 16 },
  eyeIcon: { padding: 12 },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  errorIcon: { marginRight: 8 },
  errorText: { fontSize: 14, flex: 1, textAlign: "center" },
  signupButton: {
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: { fontSize: 16, fontWeight: "600" },
});
