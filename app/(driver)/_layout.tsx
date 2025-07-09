import { Drawer } from 'expo-router/drawer';

export default function DriverDrawerLayout() {
  return (
     <Drawer
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
