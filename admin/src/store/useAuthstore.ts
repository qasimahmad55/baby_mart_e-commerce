import { api } from '@/lib/api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
    _id: string,
    name: string,
    email: string,
    avatar: string,
    role: "admin" | "user" | "deliveryman"
}

type AuthState = {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    login: (credentials: { email: string, password: string }) => Promise<void>;

    register: (userData: {
        name: string,
        email: string,
        password: string,
        role: string,

    }) => Promise<void>;

    logout: () => void;
    checkIsAdmin: () => boolean;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: async (credentials) => {
                try {
                    const response = await api.post('/auth/login', credentials)
                    if (response.data.token) {
                        set({
                            user: response.data,
                            token: response.data.token,
                            isAuthenticated: true
                        })
                    }
                } catch (error) {
                    console.error("login error", error)
                    throw error
                }
            },
            register: async (userData) => { },
            logout: () => { },
            checkIsAdmin: () => { }
        }),
        {
            name: "auth-storage"
        }))

