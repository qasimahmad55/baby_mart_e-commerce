import Constants from 'expo-constants';
// import { Platform } from "react-native";

/**
 * Returns the correct API base URL depending on the runtime environment.
 * Dynamically detects the machine's IP during development using Expo Constants.
 */
const getBaseUrl = (): string => {
    // Get the Metro server host which contains the machine's IP
    const hostUri = Constants.expoConfig?.hostUri;
    
    // Extract the IP part (e.g., "192.168.1.5" from "192.168.1.5:8081")
    const LAN_IP = hostUri?.split(':').shift() || 'localhost';

    if (__DEV__) {
        // This works for both physical devices and emulators
        return `http://${LAN_IP}:8000/api`;
    }

    // Production URL (update when deploying)
    // For now, fallback to the same logic or a placeholder
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
