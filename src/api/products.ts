import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

export interface Presentation {
  presentation_id: number;
  presentation_description: string;
  quantity: string;
}

export interface Product {
  id: number;
  id_clasificaion: number;
  clasification: string;
  sku: string;
  name: string;
  description: string;
  img_url: string;
  price: string;
  presentations: Presentation[];
}

interface ProductsResponse {
  status_code: number;
  message: string;
  data: Product[];
}

interface SingleProductResponse {
  status_code: number;
  message: string;
  data: {
    product: Product;
  };
}

export const getProducts = async () => {
  try {
    const response = await apiRequest<ProductsResponse>({
      endpoint: '/public/products',
      method: 'GET'
    });

    return {
      success: response.status_code === 200,
      products: response.data,
      message: response.message
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        products: [],
        message: error.response?.data?.message || 'Error al obtener los productos'
      };
    }
    return {
      success: false,
      products: [],
      message: 'Error al obtener los productos'
    };
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await apiRequest<SingleProductResponse>({
      endpoint: `/public/products/${id}`,
      method: 'GET'
    });

    return {
      success: response.status_code === 200,
      product: response.data.product,
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