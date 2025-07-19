import { useTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
import { useAuth } from "./components/authProvider";
import { ROUTES } from "./config/routes";

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login, user, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Navigate based on user role when user state updates
  useEffect(() => {
    if (user && !authLoading) {
      const destination =
        user.role === "admin" ? ROUTES.ADMIN.DASHBOARD : ROUTES.CHAUFFEUR.HOME;
      router.replace(destination);
    }
  }, [user, authLoading, router]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid credentials");
      }
      // Navigation is handled in useEffect
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getFriendlyErrorMessage = (error: string) => {
    switch (error) {
      case "Please fill in all fields":
        return "Please enter both email and password.";
      case "Invalid credentials":
        return "Incorrect email or password.";
      case "Login failed. Please try again.":
        return "Something went wrong.";
      default:
        return error; // Fallback to original error if no mapping exists
    }
  };
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={
          theme.colors.background === "#fff" ? "dark-content" : "light-content"
        }
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
                editable={!loading && !authLoading}
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
                editable={!loading && !authLoading}
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

          {error && (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor: theme.colors.deleteButton
                    ? `${theme.colors.deleteButton}80` // 0.5 opacity (80 in hex = 0.5)
                    : "rgba(255, 0, 0, 0.5)", // Fallback to red with 0.5 opacity
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
              styles.loginButton,
              { backgroundColor: theme.colors.primary },
              (loading || authLoading) && { opacity: 0.7 },
            ]}
            onPress={handleLogin}
            disabled={loading || authLoading}
          >
            <Text
              style={[
                styles.loginButtonText,
                { color: theme.colors.buttonText },
              ]}
            >
              {loading || authLoading ? "Signing In..." : "Sign In"}
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
              disabled={loading || authLoading}
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
              disabled={loading || authLoading}
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
  loginButton: {
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
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

// TODO: Remove or secure demo credentials (admin@example.com, driver@example.com) in production
