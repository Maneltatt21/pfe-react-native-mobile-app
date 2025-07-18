import { useTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function Signup() {
  const router = useRouter();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "driver", // default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual signup logic here
      // For now, we'll simulate signup
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      Alert.alert(
        "Success",
        "Account created successfully! You can now sign in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: theme.colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Join us and get started
          </Text>
        </View>

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
                editable={!isLoading}
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
                editable={!isLoading}
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
                editable={!isLoading}
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
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              I am a
            </Text>
            <View style={styles.roleSelection}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                  formData.role === "driver" && {
                    borderColor: theme.colors.editButton,
                    backgroundColor: theme.colors.card,
                  },
                ]}
                onPress={() => handleInputChange("role", "driver")}
                disabled={isLoading}
              >
                <Ionicons
                  name="car-outline"
                  size={24}
                  color={
                    formData.role === "driver"
                      ? theme.colors.editButton
                      : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.roleOptionText,
                    { color: theme.colors.text },
                    formData.role === "driver" && {
                      color: theme.colors.editButton,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Driver
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleOption,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                  formData.role === "admin" && {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.card,
                  },
                ]}
                onPress={() => handleInputChange("role", "admin")}
                disabled={isLoading}
              >
                <Ionicons
                  name="shield-outline"
                  size={24}
                  color={
                    formData.role === "admin"
                      ? theme.colors.primary
                      : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.roleOptionText,
                    { color: theme.colors.text },
                    formData.role === "admin" && {
                      color: theme.colors.primary,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.signupButton,
              { backgroundColor: theme.colors.primary },
              isLoading && { backgroundColor: theme.colors.button },
            ]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.signupButtonText,
                { color: theme.colors.buttonText },
              ]}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.text }]}>
            Already have an account?{" "}
            <Text
              style={[styles.signinLink, { color: theme.colors.primary }]}
              onPress={() => router.replace("/")}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 8,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  roleOptionSelected: {},
  roleOptionText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  roleOptionTextSelected: {
    fontWeight: "600",
  },
  signupButton: {
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonDisabled: {},
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
