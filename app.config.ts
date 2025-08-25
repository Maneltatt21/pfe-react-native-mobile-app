import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_IP_EMULATOR_DEVICE = "10.0.2.2";
  const APP_IP_REAL_DEVICE = "172.27.128.1";
  const BASE_URL = `http://${APP_IP_EMULATOR_DEVICE}:8000/api/v1`;

  return {
    ...config,
    name: "AGS-Parc",
    slug: "my-app",
    extra: {
      API_URL: process.env.API_URL || "https://default-api.com",
      APP_ENV: process.env.APP_ENV || "development",
      APP_IP_EMULATOR_DEVICE,
      APP_IP_REAL_DEVICE,
      APP_STORAGE_URL: `http://${APP_IP_EMULATOR_DEVICE}:8000/storage`,
      BASE_URL,
    },
  };
};
