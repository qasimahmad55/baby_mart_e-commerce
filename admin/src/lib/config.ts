import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

//config of utility for admin api
interface AdminApiConfig {
    baseURL: string,
    isProduction: boolean
}
//get api config for admin
export const getAdminApiConfig = (): AdminApiConfig => {
    const apiUrl = import.meta.env.VITE_API_URL
    if (!apiUrl) {
        throw new Error("vite_api_url is not defined in .env")
    }

    const isProduction = import.meta.env.VITE_APP_ENV === "production" || import.meta.env.PROD === true

    return {
        baseURL: `${apiUrl}/api`,
        isProduction,
    }
}

//create configured axios instance
const createApiInstance = (): AxiosInstance => {
    const { baseURL } = getAdminApiConfig()
    const instance = axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        timeout: 60000
    })

    instance.interceptors.request.use(
        (config) => {
            //get token from localStorage
            const autuhData = localStorage.getItem("auth-storage")
            if (autuhData) {
                try {
                    const parsedData = JSON.parse(autuhData)
                    const token = parsedData.state?.token
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`
                    }
                } catch (error) {
                    console.error("Error parsing auth data", error)
                }
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )
    //add response interceptor for better error handling
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error) => {
            if (error.code === "ERR_NETWORK") {
                console.error("Network Error: Unable to connect to the server. Please check if the server is running")
            }
            //handle 401 unauthorized errors
            if (error.response?.status === 401) {
                //clear authdata and return to login page
                localStorage.removeItem("auth-storage")
                window.location.href = "/login"
            }
            return Promise.reject(error)
        }
    )
    return instance
}

//create and export the configured axios instance
export const adminApi = createApiInstance()

//admin api endpoints
export const ADMIN_API_ENDPOINTS = {
    //auth
    REGISTER: "/auth/register",
    LOGIN: "login",
    LOGOUT: "logout",
    //users
    //products
    //categories
} as const

//helper function to build query parameters

export const buildAdminQueryParams = (
    params: Record<string, string | number | boolean | undefined>
): string => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value))
        }
    })
    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ""
}

export default adminApi
