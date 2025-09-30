import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  // Emulator (Android)
  const APP_IP_EMULATOR_DEVICE = "10.0.2.2";

  // Your computer’s LAN IP (for real device testing)
  const APP_IP_REAL_DEVICE = "172.18.224.1"; // removed leading space

  // Pick which IP to use
  const USE_EMULATOR = true; // change to false if testing on a real device

  const BASE_IP = USE_EMULATOR ? APP_IP_EMULATOR_DEVICE : APP_IP_REAL_DEVICE;

  return {
    ...config,
    name: "AGS-Parc",
    slug: "my-app",
    android: {
      package: "com.helmirmili.myapp",
    },

    extra: {
      eas: {
        projectId: "01c9ffbf-0daf-4f6e-9308-fc6f538a5060",
      },
      APP_ENV: process.env.APP_ENV || "development",
      APP_STORAGE_URL: `http://${BASE_IP}:8000/storage`,
      BASE_URL: `http://${BASE_IP}:8000/api/v1`,
    },
  };
};
