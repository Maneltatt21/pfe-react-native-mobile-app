import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from ".";

type Theme = {
  colors: {
    background: string;
    text: string;
    primary: string;
    card: string;
    border: string;
    sidebar: string;
    appBar: string;
    button: string;
    buttonText: string;
    editButton: string;
    deleteButton: string;
    viewButton: string;
    createButton: string;
  };
  isDark: boolean;
};

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
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === "dark");
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        const savedSystemTheme = await AsyncStorage.getItem("useSystemTheme");
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark");
        }
        if (savedSystemTheme !== null) {
          setUseSystemTheme(savedSystemTheme === "true");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("theme", isDark ? "dark" : "light");
        await AsyncStorage.setItem("useSystemTheme", useSystemTheme.toString());
      } catch (error) {
        console.error("Error saving theme:", error);
      }
    };
    saveTheme();
  }, [isDark, useSystemTheme]);

  useEffect(() => {
    if (useSystemTheme) {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setIsDark(colorScheme === "dark");
      });
      return () => subscription.remove();
    }
  }, [useSystemTheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    setUseSystemTheme(false); // Override system theme on manual toggle
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

  const value = useMemo(
    () => ({ theme, toggleTheme, isDark, useSystemTheme, toggleSystemTheme }),
    [isDark, theme, useSystemTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
