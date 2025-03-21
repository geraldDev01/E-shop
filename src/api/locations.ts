import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

interface Location {
  id: number;
  description: string;
}

interface LocationResponse {
  status_code: number;
  message: string;
  data: Location[];
}

export const getDepartments = async () => {
  try {
    const response = await apiRequest<LocationResponse>({
      endpoint: '/public/departments',
      method: 'GET'
    });

    return {
      success: response.status_code === 200,
      departments: response.data,
      message: response.message
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        departments: [],
        message: error.response?.data?.message || 'Error al obtener los departamentos'
      };
    }
    return {
      success: false,
      departments: [],
      message: 'Error al obtener los departamentos'
    };
  }
};

export const getMunicipalities = async (departmentId: number) => {
  try {
    const response = await apiRequest<LocationResponse>({
      endpoint: `/public/municipalities?department_id=${departmentId}`,
      method: 'GET'
    });

    return {
      success: response.status_code === 200,
      municipalities: response.data,
      message: response.message
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        municipalities: [],
        message: error.response?.data?.message || 'Error al obtener los municipios'
      };
    }
    return {
      success: false,
      municipalities: [],
      message: 'Error al obtener los municipios'
    };
  }
}; 