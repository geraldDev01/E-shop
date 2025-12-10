import { apiRequest } from '@/utils/api';
import { AxiosError } from 'axios';

interface OrderDetail {
  product_id: number;
  presentation_id: number;
  unit_price: number;
  quantity: number;
}

interface CreateOrderData {
  data: {
    customer_id: string;
    detail: OrderDetail[];
  }
}

interface TransferData {
  entity: string;
  reference: string;
  date: string;
  observations?: string;
  account_reference: string;
  currency: string;
  amount: number;
}

interface PayPalPaymentData {
  payment_method: "PAYPAL";
  reference_number: string;
  financial_entity: string;
  account_reference: string;
  currency: string;
  amount: string;
}

interface CreateOrderResponse {
  status_code: number;
  message: string;
  data: {
    id: number;
    // Add other response fields if needed
  };
}

interface OrderItem {
  id: number;
  product_description: string;
  presentation_description: string;
  quantity: number;
  unit_price: number;
  sub_total: number;
}

interface Order {
  id: number;
  created_at: string;
  total: number;
  status: string;
  detail: OrderItem[];
}

interface GetOrdersResponse {
  status_code: number;
  message: string;
  data: Order[];
}

export const createOrder = async (
  token: string, 
  orderData: CreateOrderData['data'],
  transferData?: TransferData,
  imageFile?: File,
  paypalPaymentData?: PayPalPaymentData
) => {
  try {
    let requestData: FormData | Record<string, unknown>;

    // If image file is provided, use FormData (bank transfer)
    if (imageFile && transferData) {
      const formData = new FormData();
      
      // Combine order data with payment object
      const combinedData = {
        ...orderData,
        payment: {
          payment_method: "TRANSFER",
          reference_number: transferData.reference,
          financial_entity: transferData.entity,
          account_reference: transferData.account_reference,
          currency: transferData.currency,
          amount: transferData.amount.toString()
        }
      };
      
      // Add data as JSON string
      formData.append('data', JSON.stringify(combinedData));
      
      // Add image file
      formData.append('image', imageFile);
      
      requestData = formData;
    } else if (paypalPaymentData) {
      // PayPal payment - include payment object in JSON request
      const combinedData = {
        ...orderData,
        payment: paypalPaymentData
      };
      requestData = { data: combinedData };
    } else {
      // Regular JSON request (no payment method specified)
      requestData = { data: orderData };
    }

    const response = await apiRequest<CreateOrderResponse>({
      endpoint: '/customer/orders',
      method: 'POST',
      data: requestData,
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
        message: error.response?.data?.message || 'Error al crear la orden'
      };
    }
    return {
      success: false,
      message: 'Error al crear la orden'
    };
  }
};

export const getOrders = async (token: string) => {
  try {
    const response = await apiRequest<GetOrdersResponse>({
      endpoint: '/customer/orders',
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
        message: error.response?.data?.message || 'Error al obtener las órdenes',
        data: []
      };
    }
    return {
      success: false,
      message: 'Error al obtener las órdenes',
      data: []
    };
  }
}; 