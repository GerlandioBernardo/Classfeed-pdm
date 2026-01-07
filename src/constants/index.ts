// define various constants used throughout the application
import { ENV } from "../config/env";

export const COLORS = {
    primary: "#4A90E2",
    secondary: "#50C878",
    accent: "#FF6B6B",
    background: "#F5F7FA",
    surface: "#FFFFFF",
    text: {
        primary: "#1A1A1A",
        secondary: "#6B7280",
        light: "#9CA3AF",
    },
    border: "#E5E7EB",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const FONT_SIZES = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
};

export const BORDER_RADIUS = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
};

export const SHADOWS = {
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
};

export const BACKEND_CONFIG = {
    BASE_URL: ENV.BACKEND_URL,
    TIMEOUT: ENV.BACKEND_TIMEOUT,
};

export const STORAGE_KEYS = {
    AUTH_TOKEN: "@classfeed:auth_token",
    OTP_TOKEN: "@classfeed:otp_token",
    USER_DATA: "@classfeed:user_data",
    THEME: "@classfeed:theme",
};

export const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
};
