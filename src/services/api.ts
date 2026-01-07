import axios, { AxiosInstance, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_CONFIG, STORAGE_KEYS } from "../constants";

const api: AxiosInstance = axios.create({
    baseURL: BACKEND_CONFIG.BASE_URL,
    timeout: BACKEND_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

// interceptor para token jwt
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// interceptor para controle de erro
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
        }
        return Promise.reject(error);
    },
);

export default api;
