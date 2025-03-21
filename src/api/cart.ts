import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

interface AddToCartData {
  data: {
    product_id: number;
    presentation_id: number;
    quantity: number;
  }
}

interface AddToCartResponse {
  status_code: number;
  message: string;
  data: {
    id: number;
    total_items: number;
    sub_total: number | null;
    created_at: string;
  };
}

interface CartItem {
  id: number;
  id_presentation: number;
  presentation_description: string;
  product_id: number;
  product_description: string;
  unit_price: string;
  quantity: string;
  sub_total: string;
}

interface CartData {
  id: number;
  total_items: string;
  sub_total: string;
  created_at: string;
  detail: CartItem[];
}

interface GetCartResponse {
  status_code: number;
  message: string;
  data: CartData;
}

export const addToCart = async (token: string, cartData: AddToCartData['data']) => {
  try {
    const response = await apiRequest<AddToCartResponse>({
      endpoint: '/customer/cart',
      method: 'POST',
      data: { data: cartData },
      headers: {
        Authorization: `Bearer ${token}`
      }
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

export const getCart = async (token: string) => {
  try {
    const response = await apiRequest<GetCartResponse>({
      endpoint: '/customer/cart',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      success: response.status_code === 200,
      message: response.message,
      data: response.data
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el carrito',
        data: null
      };
    }
    return {
      success: false,
      message: 'Error al obtener el carrito',
      data: null
    };
  }
};

export const deleteCartItem = async (token: string, itemId: number) => {
  try {
    const response = await apiRequest<{ status_code: number; message: string }>({
      endpoint: `/customer/cart/${itemId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      success: response.status_code === 200,
      message: response.message
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar el producto'
      };
    }
    return {
      success: false,
      message: 'Error al eliminar el producto'
    };
  }
};