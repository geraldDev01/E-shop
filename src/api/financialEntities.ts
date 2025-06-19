import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

export interface FinancialEntity {
  financial_id: number;
  financial_description: string;
  account_reference_name: string;
  account_reference_number: string;
  currency: string;
  is_active: string;
}

interface FinancialEntitiesResponse {
  status_code: number;
  message: string;
  data: FinancialEntity[];
}

export const getFinancialEntities = async () => {
  try {
    const response = await apiRequest<FinancialEntitiesResponse>({
      endpoint: '/public/financial-entities',
      method: 'GET',
    });
    return {
      success: response.status_code === 200,
      entities: response.data,
      message: response.message,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        entities: [],
        message: error.response?.data?.message || 'Error al obtener las entidades financieras',
      };
    }
    return {
      success: false,
      entities: [],
      message: 'Error al obtener las entidades financieras',
    };
  }
}; 