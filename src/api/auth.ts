import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';
import { 
    AuthResponse, 
    AuthResult, 
    LoginCredentials, 
    RegisterCredentials,
    ErrorResponse 
} from '@/types/api';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export const login = async ({ email, password }: LoginCredentials): Promise<AuthResult> => {
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
        console.log("userData", userData);
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

export const logout = () => {
    // Remove the auth token cookie
    Cookies.remove('auth_token');
    
    // Redirect to login page
    redirect('/');
};