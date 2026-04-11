import { Platform } from "react-native";

/**
 * Returns the correct API base URL depending on the runtime environment.
 * - Android emulator: 10.0.2.2 (maps to host machine's localhost)
 * - iOS simulator: localhost
 * - Physical device: use machine's LAN IP
 */
const getBaseUrl = (): string => {
    // When running on a physical device via Expo Go, localhost/10.0.2.2 won't work.
    // You MUST use your computer's LAN IP address.
    // Find it via: ipconfig (Windows) or ifconfig (Mac/Linux)
    const LAN_IP = "192.168.0.105"; // <-- UPDATE THIS to your machine's LAN IP

    if (__DEV__) {
        if (Platform.OS === "android") {
            // Check if running on emulator or physical device
            // For simplicity, use LAN IP which works on both
            return `http://${LAN_IP}:8000/api`;
        }
        if (Platform.OS === "ios") {
            return `http://${LAN_IP}:8000/api`;
        }
    }

    // Production URL (update when deploying)
    return `http://${LAN_IP}:8000/api`;
};

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const normalizeApiBaseUrl = (value?: string): string => {
    const raw = value?.trim();
    if (!raw) return getBaseUrl();
    const base = stripTrailingSlash(raw);
    return base.endsWith("/api") ? base : `${base}/api`;
};

export const getClientApiBaseUrl = (): string => getBaseUrl();

export const getServerApiBaseUrl = (): string => getBaseUrl();
