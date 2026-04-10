const DEFAULT_API_BASE_URL = "http://localhost:8000/api";

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const normalizeApiBaseUrl = (value?: string): string => {
    const raw = value?.trim();
    if (!raw) return DEFAULT_API_BASE_URL;

    const base = stripTrailingSlash(raw);
    return base.endsWith("/api") ? base : `${base}/api`;
};

export const getClientApiBaseUrl = (): string =>
    normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export const getServerApiBaseUrl = (): string =>
    normalizeApiBaseUrl(process.env.API_ENDPOINT || process.env.NEXT_PUBLIC_API_URL);
