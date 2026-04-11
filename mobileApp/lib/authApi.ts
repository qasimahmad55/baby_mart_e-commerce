import { getClientApiBaseUrl } from "./apiBaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = getClientApiBaseUrl();

type ApiError = {
    message: string;
    code: string | number;
};

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: ApiError;
};

/**
 * Gets the auth token from AsyncStorage (React Native replacement for document.cookie)
 */
const getAuthToken = async (): Promise<string | undefined> => {
    try {
        const token = await AsyncStorage.getItem("auth_token");
        return token || undefined;
    } catch {
        return undefined;
    }
};

const authApi = {
    post: async <T = unknown>(url: string, body: unknown): Promise<ApiResponse<T>> => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${baseURL}${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                let errorMessage = "An error occurred";
                try {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.message || `HTTP error! status: ${response.status}`;
                } catch {
                    errorMessage = `HTTP error! status: ${response.status}`;
                }

                return {
                    success: false,
                    error: {
                        message: errorMessage,
                        code: response.status === 0 ? "ERR_NETWORK" : response.status,
                    },
                };
            }

            const data = await response.json();
            return { success: true, data: data as T };
        } catch {
            return {
                success: false,
                error: {
                    message:
                        "Unable to connect to the server. Please check if the server is running.",
                    code: "ERR_NETWORK",
                },
            };
        }
    },

    put: async <T = unknown>(url: string, body: unknown): Promise<ApiResponse<T>> => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${baseURL}${url}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                let errorMessage = "An error occurred";
                try {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.message || `HTTP error! status: ${response.status}`;
                } catch {
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                return {
                    success: false,
                    error: {
                        message: errorMessage,
                        code: response.status === 0 ? "ERR_NETWORK" : response.status,
                    },
                };
            }

            const data = await response.json();
            return { success: true, data: data as T };
        } catch (error: unknown) {
            console.error("authApi: Network Error:", url, error);
            return {
                success: false,
                error: {
                    message:
                        "Unable to connect to the server. Please check if the server is running.",
                    code: "ERR_NETWORK",
                },
            };
        }
    },

    get: async <T = unknown>(url: string): Promise<ApiResponse<T>> => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${baseURL}${url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (!response.ok) {
                let errorMessage = "An error occurred";
                try {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.message || `HTTP error! status: ${response.status}`;
                } catch {
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                return {
                    success: false,
                    error: {
                        message: errorMessage,
                        code: response.status === 0 ? "ERR_NETWORK" : response.status,
                    },
                };
            }

            const data = await response.json();
            return { success: true, data: data as T };
        } catch (error: unknown) {
            console.error("authApi: Network Error:", url, error);
            return {
                success: false,
                error: {
                    message:
                        "Unable to connect to the server. Please check if the server is running.",
                    code: "ERR_NETWORK",
                },
            };
        }
    },

    delete: async <T = unknown>(url: string): Promise<ApiResponse<T>> => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${baseURL}${url}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (!response.ok) {
                let errorMessage = "An error occurred";
                try {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.message || `HTTP error! status: ${response.status}`;
                } catch {
                    errorMessage = `HTTP error! status: ${response.status}`;
                }
                return {
                    success: false,
                    error: {
                        message: errorMessage,
                        code: response.status === 0 ? "ERR_NETWORK" : response.status,
                    },
                };
            }

            const data = await response.json();
            return { success: true, data: data as T };
        } catch (error: unknown) {
            console.error("authApi: Network Error:", url, error);
            return {
                success: false,
                error: {
                    message:
                        "Unable to connect to the server. Please check if the server is running.",
                    code: "ERR_NETWORK",
                },
            };
        }
    },
};

export default authApi;
