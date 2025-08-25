import { useAuth } from "@/app/components/authProvider";
import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
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
} from "react-native";

export default function AddDriver() {
  // const router = useRouter();
  const { theme } = useTheme();
  const { register, isLoading: authLoading } = useAuth();
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

      if (!success) {
        setError("User already exists");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BackHeader title="Create Driver" />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <StatusBar style="dark" translucent />
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { backgroundColor: theme.colors.background },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.form, { backgroundColor: theme.colors.card }]}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Full Name
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
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.border}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange("fullName", value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading && !authLoading}
                />
              </View>
            </View>

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
                  placeholder="Enter your email"
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

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Password
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
                  placeholder="Enter your password"
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

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Confirm Password
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
                  placeholder="Confirm your password"
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
                  ? "Creating Account..."
                  : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  roleSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
  },
  roleOptionText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  signupButton: {
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  signinLink: {
    fontWeight: "600",
  },
});
