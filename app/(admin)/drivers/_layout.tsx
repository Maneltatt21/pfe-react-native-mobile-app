import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="chauffeurs" options={{ headerShown: false }} />
      <Stack.Screen name="add-driver" options={{ headerShown: false }} />
    </Stack>
  );
}
