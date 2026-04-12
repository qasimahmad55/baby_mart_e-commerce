import { Platform } from 'react-native';
import { getClientApiBaseUrl } from './apiBaseUrl';

interface ApiConfig {
    baseUrl: string;
    isProduction: boolean;
}

export const getApiConfig = (): ApiConfig => {
    const baseUrl = getClientApiBaseUrl();

    const isProduction = false; // React Native doesn't have process.env.NODE_ENV reliably

    return {
        baseUrl,
        isProduction,
    };
};

export async function fetchWithConfig<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const { baseUrl } = getApiConfig();

    const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const defaultOptions: RequestInit = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options?.headers,
        },
    };

    try {
        const response = await fetch(url, mergedOptions);

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText} - ${endpoint}`
            );
        }

        const data: T = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        throw error;
    }
}

export const getAuthHeaders = (token?: string): Record<string, string> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

export const buildQueryString = (
    params: Record<string, string | number | boolean>
): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
};

export const API_ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    PRODUCTS: "/products",
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,
    CATEGORIES: "/categories",
    CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
    BRANDS: "/brands",
    BRAND_BY_ID: (id: string) => `/brands/${id}`,
    USERS: "/users",
    USER_BY_ID: (id: string) => `/users/${id}`,
    USER_PROFILE: "/users/profile",
    ORDERS: "/orders",
    ORDER_BY_ID: (id: string) => `/orders/${id}`,
    USER_ORDERS: (userId: string) => `/orders/user/${userId}`,
    CART: "/cart",
    ADD_TO_CART: "/cart/add",
    REMOVE_FROM_CART: "/cart/remove",
    STATS: "/stats",
    ANALYTICS: "/analytics",
} as const;
