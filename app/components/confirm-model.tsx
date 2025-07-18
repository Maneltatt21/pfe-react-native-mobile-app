// components/ConfirmModal.tsx
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
              paddingBottom: 20 + insets.bottom, // handle bottom safe area
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.colors.text }]}>
            {message}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.deleteButton },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[styles.cancelText, { color: theme.colors.buttonText }]}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.createButton },
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[styles.confirmText, { color: theme.colors.buttonText }]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent backdrop
  },
  container: {
    width: "85%",
    padding: 20,
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelText: {
    fontWeight: "600",
  },
  confirmText: {
    fontWeight: "600",
  },
});
