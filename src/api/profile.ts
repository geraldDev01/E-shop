import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

export interface UserProfile {
  id: number;
  identification: string | null;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  department_id: number | null;
  department_description: string | null;
  municipality_id: number | null;
  municipality_description: string | null;
}

interface ProfileResponse {
  status_code: number;
  message: string;
  data: UserProfile;
}

export const getUserProfile = async (token: string) => {
  try {
    const response = await apiRequest<ProfileResponse>({
      endpoint: '/customer/profile',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      success: response.status_code === 200,
      message: response.message,
      profile: response.data
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el perfil'
      };
    }
    return {
      success: false,
      message: 'Error al obtener el perfil'
    };
  }
};

export interface UpdateProfileData extends Record<string, unknown> {
  full_name: string;
  phone: string;
  address: string;
  email: string;
  id_department: number;
  id_municipality: number;
}

export const updateProfile = async (token: string, data: UpdateProfileData) => {
  try {
    const response = await apiRequest<ProfileResponse>({
      endpoint: '/customer/profile',
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { data }
    });

    return {
      success: response.status_code === 200,
      message: response.message,
      profile: response.data
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar el perfil'
      };
    }
    return {
      success: false,
      message: 'Error al actualizar el perfil'
    };
  }
}; 