
import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';


interface ServiceResponse {
  status_code: number;
  message: string;
  data: Customer[];
}

interface Customer {
    id: number;
    identification: string;
    fulll_name: string;
    email: string;
    phone: string;
    address: string;
    department_id: number;
    department_description: string;
    municipality_id: number;
    municipality_description: string;
    created_at: string;
  }

  
export const getAllCustomers = async () => {
    try {
        const response = await apiRequest<ServiceResponse>({
            endpoint: `/administration/customers`,
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
