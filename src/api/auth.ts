import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

interface AuthResponse {
    status_code: number;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
        expires_at: string;
    }
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResult {
    success: boolean;
    token?: string;
    error?: string;
}

interface RegisterCredentials {
    full_name: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    id_deparment: null;
    id_municipality: null;
}

interface AuthResult {
    success: boolean;
    token?: string;
    error?: string;
}

interface ErrorResponse {
    status_code: number;
    message: string;
    errors?: string[];
}

export const login = async ({ email, password }: LoginCredentials): Promise<LoginResult> => {
    try {
        const response = await apiRequest<AuthResponse>({
            endpoint: '/auth/sign-In',
            method: 'POST',
            data: { email, password }
        });
  
        if (response.status_code === 200) {
            return { 
                success: true, 
                token: response.data.access_token 
            };
        }

        return {
            success: false,
            error: response.message || "Error en la autenticación"
        };

    } catch (error) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                error: error.response?.data?.message || "Error en la autenticación"
            };
        }
        return {
            success: false,
            error: "Error en la autenticación"
        };
    }
};

export const register = async (userData: RegisterCredentials): Promise<AuthResult> => {
    try {
        const response = await apiRequest<AuthResponse>({
            endpoint: '/auth/sign-up',
            method: 'POST',
            data: { user: userData }
        });

        if (response.status_code === 201) {
            return { 
                success: true,
                token: response.data.access_token
            };
        }

        return {
            success: false,
            error: response.message
        };

    } catch (error) {
        if (error instanceof AxiosError) {
            const errorData = error.response?.data as ErrorResponse;
            return {
                success: false,
                error: errorData?.errors?.[0] || errorData?.message || "Error en el registro"
            };
        }
        return {
            success: false,
            error: "Error en el registro"
        };
    }
};