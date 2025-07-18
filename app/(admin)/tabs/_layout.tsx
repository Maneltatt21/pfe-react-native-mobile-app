import { useTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AdminTabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.appBar,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="dashbord"
        options={{
          title: "Dashbord",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Setteings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
