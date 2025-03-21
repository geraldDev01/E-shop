
import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';
import { boolean } from 'yup';


interface ServiceResponse {
    status_code: number;
    message: string;
    data: ArticleInfo[];
}

interface NewResponse {
    status_code: number;
    message: string;
    data: any;
}

interface ArticleInfo {
    id: number;
    id_clasificaion: number;
    clasification: string;
    sku: string;
    name: string;
    description: string;
    img_url: string;
    price: string;
    cost: string;
}


interface BaseItem {
    id: number;
    description: string;
    is_active: boolean;
}

export const getAllProducts = async () => {
    try {
        const response = await apiRequest<ServiceResponse>({
            endpoint: `/inventory/products`,
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


export const addProduct = async (productData: any) => {
    try {

        const response = await apiRequest<NewResponse>({
            endpoint: '/inventory/products',
            method: 'POST',
            data: { data: productData },
            headers: {
                "Content-Type": "multipart/form-data", // ✅ Necesario para subir archivos
            },
        });
        
        return {
            success: response.status_code === 201,
            message: response.message,
            data: response.data
        };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al agregar al carrito'
            };
        }
        return {
            success: false,
            message: 'Error al agregar al carrito'
        };
    }
};



export const getAllCategories = async () => {
    try {
        const response = await apiRequest<ServiceResponse>({
            endpoint: `/inventory/categories`,
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


export const getAllPresentations = async () => {
    try {
        const response = await apiRequest<ServiceResponse>({
            endpoint: `/inventory/presentations`,
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
