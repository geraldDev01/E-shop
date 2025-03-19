export interface AuthResponse {
    status_code: number;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
        expires_at: string;
    }
}

export interface ApiResponse {
    status_code: number;
    message: string;
}

export interface ErrorResponse extends ApiResponse {
    errors?: string[];
}

export interface ApiResult {
    success: boolean;
    error?: string;
}

export interface AuthResult extends ApiResult {
    token?: string;
}

// Auth Credentials
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    full_name: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    id_deparment: null;
    id_municipality: null;
}

// Contact Form
export interface ContactFormData extends Record<string, unknown> {
    message: {
        name: string;
        phone: string;
        email: string;
        description: string;
    }
} 