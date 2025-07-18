import { useTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ROUTES } from "../app/config/routes";

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual authentication logic here
      // For now, we'll simulate login based on email domain
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      if (email.toLowerCase().includes("admin")) {
        router.replace(ROUTES.ADMIN.DASHBOARD);
      } else {
        router.replace(ROUTES.CHAUFFEUR.HOME);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        backgroundColor={theme.colors.background} // status bar background
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: theme.colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Sign in to your account
          </Text>
        </View>

        <View style={[styles.form, { backgroundColor: theme.colors.card }]}>
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
                value={email}
                onChangeText={setEmail}
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
                value={password}
                onChangeText={setPassword}
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

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: theme.colors.primary },
              isLoading && { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.loginButtonText,
                { color: theme.colors.buttonText },
              ]}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.border },
              ]}
            />
            <Text style={[styles.dividerText, { color: theme.colors.text }]}>
              or continue with
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.border },
              ]}
            />
          </View>

          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                },
              ]}
              onPress={() => {
                setEmail("admin@example.com");
                setPassword("password");
              }}
              disabled={isLoading}
            >
              <Ionicons
                name="shield-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.roleButtonText, { color: theme.colors.text }]}
              >
                Demo Admin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                },
              ]}
              onPress={() => {
                setEmail("driver@example.com");
                setPassword("password");
              }}
              disabled={isLoading}
            >
              <Ionicons
                name="car-outline"
                size={24}
                color={theme.colors.editButton}
              />
              <Text
                style={[styles.roleButtonText, { color: theme.colors.text }]}
              >
                Demo Driver
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.text }]}>
            Don&apos;t have an account?{" "}
            <Text
              style={[styles.signupLink, { color: theme.colors.primary }]}
              onPress={() => router.push("/signup")}
            >
              Sign up
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
  loginButton: {
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {},
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  roleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  signupLink: {
    fontWeight: "600",
  },
});
