// components/theme/ThemeProvider.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert, Appearance } from "react-native";
import { darkTheme, lightTheme } from ".";

type Theme = typeof lightTheme;

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  useSystemTheme: boolean;
  toggleSystemTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
  isDark: false,
  useSystemTheme: true,
  toggleSystemTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>(false); // Default to false (light)
  const [useSystemTheme, setUseSystemTheme] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // Track initialization

  // Load saved theme preferences on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedSystemTheme = await AsyncStorage.getItem("useSystemTheme");
        const savedTheme = await AsyncStorage.getItem("theme");

        if (savedSystemTheme !== null) {
          const useSystem = savedSystemTheme === "true";
          setUseSystemTheme(useSystem);

          if (!useSystem && savedTheme !== null) {
            // If not using system theme, load saved theme
            setIsDark(savedTheme === "dark");
          } else {
            // Use system theme if no manual theme is set
            setIsDark(Appearance.getColorScheme() === "dark");
          }
        } else {
          // Default to system theme if no preference is saved
          setIsDark(Appearance.getColorScheme() === "dark");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        Alert.alert(
          "Theme Error",
          "Failed to load theme preferences. Using default theme.",
          [{ text: "OK" }],
          { cancelable: true }
        );
      } finally {
        setIsInitialized(true); // Mark initialization complete
      }
    };
    loadTheme();
  }, []);

  // Save theme preferences when they change
  useEffect(() => {
    if (!isInitialized) return; // Skip saving until initialized
    const saveTheme = async () => {
      try {
        await AsyncStorage.multiSet([
          ["theme", isDark ? "dark" : "light"],
          ["useSystemTheme", useSystemTheme.toString()],
        ]);
      } catch (error) {
        console.error("Error saving theme:", error);
        Alert.alert(
          "Theme Error",
          "Failed to save theme preferences. Your settings may not persist.",
          [{ text: "OK" }],
          { cancelable: true }
        );
      }
    };
    saveTheme();
  }, [isDark, useSystemTheme, isInitialized]);

  // Listen for system theme changes when useSystemTheme is true
  useEffect(() => {
    if (useSystemTheme) {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setIsDark(colorScheme === "dark");
      });
      return () => subscription.remove();
    }
  }, [useSystemTheme]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    setUseSystemTheme(false); // Disable system theme on manual toggle
  };

  const toggleSystemTheme = () => {
    setUseSystemTheme((prev) => {
      const newSystemTheme = !prev;
      if (newSystemTheme) {
        setIsDark(Appearance.getColorScheme() === "dark");
      }
      return newSystemTheme;
    });
  };

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  const value = useMemo(
    () => ({ theme, toggleTheme, isDark, useSystemTheme, toggleSystemTheme }),
    [theme, isDark, useSystemTheme]
  );

  // Render nothing until initialized to prevent flickering
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
