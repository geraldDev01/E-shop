
import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';
import { boolean } from 'yup';

interface ServiceResponse<T> {
    status_code: number;
    message: string;
    data: T;
}

interface UserData {
    id: number;
    full_name: string;
    email: string;
    rol_id: number;
    is_active: string;
}

interface FeeInfo {
    id: number;
    amount: string;
    department_id: string;
    municipality_id: string;
    name: string;
    department_description: string;
    municipality_description: string;
}


interface BaseItem {
    id: number;
    description: string;
    is_active: boolean;
}

export const getAllOrders = async () => {
    try {
        const response = await apiRequest<ServiceResponse<any>>({
            endpoint: `/administration/orders`,
            method: 'GET'
        });

        return {
            success: response.status_code === 200,
            data: response.data,
            message: response.message
        };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || 'Error al obtener el producto'
            };
        }
        return {
            success: false,
            data: null,
            message: 'Error al obtener el producto'
        };
    }
};


export const getOrderById = async (id: number) => {
    try {
        const response = await apiRequest<ServiceResponse<any>>({
            endpoint: `/administration/orders/${id}`,
            method: 'GET'
        });

        return {
            success: response.status_code === 200,
            data: response.data,
            message: response.message
        };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || 'Error al obtener el producto'
            };
        }
        return {
            success: false,
            data: null,
            message: 'Error al obtener el producto'
        };
    }
};


export const getAllUsers = async () => {
    try {
        const response = await apiRequest<ServiceResponse<UserData[]>>({
            endpoint: `/administration/users`,
            method: 'GET'
        });

        return {
            success: response.status_code === 200,
            data: response.data,
            message: response.message
        };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || 'Error al obtener el producto'
            };
        }
        return {
            success: false,
            data: null,
            message: 'Error al obtener el producto'
        };
    }
};

export const getAllFees = async () => {
    try {
        const response = await apiRequest<ServiceResponse<FeeInfo[]>>({
            endpoint: `/administration/fees-all`,
            method: 'GET'
        });

        return {
            success: response.status_code === 200,
            data: response.data,
            message: response.message
        };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                product: null,
                message: error.response?.data?.message || 'Error al obtener el producto'
            };
        }
        return {
            success: false,
            product: null,
            message: 'Error al obtener el producto'
        };
    }
};



export const getAllDepartments = async () => {
    try {
        const response = await apiRequest<ServiceResponse<BaseItem[]>>({
            endpoint: `/administration/departments`,
            method: 'GET'
        });

        return {
            success: response.status_code === 200,
            data: response.data,
            message: response.message
        };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                product: null,
                message: error.response?.data?.message || 'Error al obtener el producto'
            };
        }
        return {
            success: false,
            product: null,
            message: 'Error al obtener el producto'
        };
    }
};

