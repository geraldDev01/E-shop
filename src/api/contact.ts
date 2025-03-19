import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

interface ContactFormData extends Record<string, unknown> {
  message: {
    name: string;
    phone: string;
    email: string;
    description: string;
  }
}

interface ContactResponse {
  status_code: number;
  message: string;
}

export const sendContactForm = async (data: ContactFormData) => {
  try {
    const response = await apiRequest<ContactResponse>({
      endpoint: '/public/contact-form',
      method: 'POST',
      data
    });

    return {
      success: response.status_code === 201,
      message: response.message
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al enviar el mensaje'
      };
    }
    return {
      success: false,
      message: 'Error al enviar el mensaje'
    };
  }
}; 