import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

interface Fee {
  id: number;
  amount: string;
}

interface FeesResponse {
  status_code: number;
  message: string;
  data: Fee[];
}

export const getFees = async (token: string, municipality_id: number) => {
  try {
    const response = await apiRequest<FeesResponse>({
      endpoint: `/public/fees/municipality_id=${municipality_id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      success: response.status_code === 200,
      fee: response.data[0]?.amount || '0',
      message: response.message
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        fee: '0',
        message: error.response?.data?.message || 'Error al obtener la tarifa de envío'
      };
    }
    return {
      success: false,
      fee: '0',
      message: 'Error al obtener la tarifa de envío'
    };
  }
}; 