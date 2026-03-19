import { fetchWithConfig } from "./config";

export const fetchData = fetchWithConfig;


export {
    fetchWithConfig,
    getApiConfig,
    getAuthHeaders,
    buildQueryString,
    API_ENDPOINTS,
} from "./config";