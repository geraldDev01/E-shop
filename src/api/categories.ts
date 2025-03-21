import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

interface Category {
  id: number;
  description: string;
}

interface CategoriesResponse {
  status_code: number;
  message: string;
  data: Category[];
}

export const getCategories = async () => {
  try {
    const response = await apiRequest<CategoriesResponse>({
      endpoint: '/public/categories',
      method: 'GET'
    });

    return {
      success: response.status_code === 200,
      categories: response.data,
      message: response.message
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        categories: [],
        message: error.response?.data?.message || 'Error al obtener las categorías'
      };
    }
    return {
      success: false,
      categories: [],
      message: 'Error al obtener las categorías'
    };
  }
}; 