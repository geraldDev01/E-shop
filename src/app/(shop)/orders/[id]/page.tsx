'use client';
import { useAuth } from '@/context/auth/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { getOrders } from '@/api/orders';
import { IoArrowBackOutline, IoLocationOutline, IoCalendarOutline, IoReceiptOutline } from 'react-icons/io5';

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

export default function OrderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : null;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user === null) {
      router.replace('/auth/login');
      return;
    }

    if (!orderId) {
      setError('ID de orden no válido');
      setIsLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        // First, try to get order from sessionStorage (if navigated from profile page)
        const storedOrder = sessionStorage.getItem(`order_${orderId}`);
        if (storedOrder) {
          const parsedOrder = JSON.parse(storedOrder) as Order;
          setOrder(parsedOrder);
          setIsLoading(false);
          // Clean up sessionStorage after use
          sessionStorage.removeItem(`order_${orderId}`);
          return;
        }

        // Fallback: Fetch all orders and find the one with matching ID
        if (!user?.token) {
          setError('No se encontró el token de autenticación');
          setIsLoading(false);
          return;
        }

        const result = await getOrders(user.token);
        if (result.success && result.data) {
          const foundOrder = result.data.find((o: Order) => o.id === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            setError('Orden no encontrada');
          }
        } else {
          setError(result.message || 'Error al cargar la orden');
        }
      } catch (err) {
        console.error('Error loading order:', err);
        setError('Error al cargar la orden');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId, user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="card rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Orden no encontrada'}</p>
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 px-6 py-2 bg-[#d64d04] text-white rounded-lg font-semibold hover:bg-orange-600 transition-all mx-auto"
          >
            <IoArrowBackOutline className="text-xl" />
            Volver al Perfil
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = DateTime.fromISO(order.created_at)
    .setLocale('es')
    .toLocaleString({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const getStatusColor = (status: string) => {
    if (status.includes('Pendiente')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('Completado')) return 'bg-green-100 text-green-800';
    if (status.includes('Proceso')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/profile')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#d64d04] transition-colors mb-4"
        >
          <IoArrowBackOutline className="text-xl" />
          <span className="font-semibold">Volver a Mi Perfil</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Detalle de Orden</h1>
      </div>

      {/* Order Info Card */}
      <div className="card rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Orden #{String(order.id).padStart(4, '0')}
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <IoCalendarOutline className="text-xl text-[#d64d04]" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <div className="flex items-center gap-2">
              <IoReceiptOutline className="text-xl text-[#d64d04]" />
              <span className="text-2xl font-bold text-gray-900">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {user?.profile?.address && (
          <div className="flex items-start gap-3">
            <IoLocationOutline className="text-xl text-[#d64d04] mt-1" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Dirección de entrega</p>
              <p className="font-semibold text-gray-900">{user.profile.address}</p>
              {user.profile.department_description && (
                <p className="text-sm text-gray-600">
                  {user.profile.department_description}
                  {user.profile.municipality_description && 
                    `, ${user.profile.municipality_description}`
                  }
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Items Table */}
      <div className="card rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presentación
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Unitario
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.detail.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product_description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.presentation_description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${Number(item.unit_price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                    ${Number(item.sub_total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                  Total:
                </td>
                <td className="px-6 py-4 text-right text-lg font-bold text-[#d64d04]">
                  ${Number(order.total).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
