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