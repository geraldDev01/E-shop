import { apiRequest } from '@/utils/api';

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
  } catch (error) {
    return {
      success: false,
      categories: [],
      message: 'Error al obtener las categorías'
    };
  }
}; 