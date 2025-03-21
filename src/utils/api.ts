import axios, { AxiosRequestConfig, Method } from 'axios';

const API_KEY = 'mombashop123def456ghi789jkl';
const BASE_URL = 'http://34.228.123.113:3000/api/v1';

interface ApiRequestConfig {
  endpoint: string;
  method?: Method;
  data?: Record<string, unknown> | null;
  headers?: Record<string, string>;
}

export const apiRequest = async <T>({ 
  endpoint, 
  method = 'GET', 
  data = null, 
  headers = {} 
}: ApiRequestConfig): Promise<T> => {
  const config: AxiosRequestConfig = {
    url: `${BASE_URL}${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...headers
    },
    ...(method !== 'DELETE' && data && { data })
  };

  const response = await axios(config);
  return response.data;
}; 