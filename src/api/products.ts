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

interface ApiProductData {
  id: number;
  img_url: string | null;
  sku: string;
  name: string;
  description: string;
  price: string;
  id_clasificaion: number;
  clasification: string;
  presentations: Array<{
    presentation_id: number;
    presentation_description: string;
    quantity: string;
  }>;
}

interface SingleProductResponse {
  status_code: number;
  message: string;
  data: {
    product: ApiProductData;
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

    if (response.status_code !== 200) {
      return {
        success: false,
        product: null,
        message: response.message || 'Error al obtener el producto'
      };
    }

    // Check if data exists
    if (!response.data || !response.data.product) {
      return {
        success: false,
        product: null,
        message: 'El producto no contiene datos'
      };
    }

    // Transform API response to match Product interface
    const apiProduct = response.data.product;
    
    // Map presentations from API response
    const presentations: Presentation[] = (apiProduct.presentations || []).map((presentation) => ({
      presentation_id: presentation.presentation_id,
      presentation_description: presentation.presentation_description,
      quantity: presentation.quantity
    }));

    const product: Product = {
      id: apiProduct.id,
      id_clasificaion: apiProduct.id_clasificaion,
      clasification: apiProduct.clasification || '',
      sku: apiProduct.sku,
      name: apiProduct.name,
      description: apiProduct.description || '',
      img_url: apiProduct.img_url || '',
      price: apiProduct.price,
      presentations: presentations
    };

    return {
      success: true,
      product: product,
      message: response.message
    };
  } catch (error: unknown) {
    console.error('Error in getProductById:', error);
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