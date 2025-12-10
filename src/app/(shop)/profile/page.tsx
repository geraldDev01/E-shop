'use client'
import { useAuth } from '@/context/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { getOrders } from '@/api/orders';
import { Table } from '@/components/ui/Table';
import { DateTime } from 'luxon';
import { Column } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';

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
  success: boolean;
  message: string;
  data: Order[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.replace('/auth/login');
    }
  }, [user, router]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.token) return;
      
      try {
        const result = await getOrders(user.token) as GetOrdersResponse;
        if (result.success) {
          setOrders(result.data);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user?.token]);

  if (!user || !user.profile) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
      </div>
    );
  }

  type OrderDisplay = {
    id: number;
    created_at: string;
    total: number;
    status: string;
    address: string;
  };
  
  const columns: Column<OrderDisplay, keyof OrderDisplay>[] = [
    {
      header: 'Orden #',
      accessor: 'id',
      render: (value) => `#${String(value).padStart(4, '0')}`
    },
    {
      header: 'Fecha',
      accessor: 'created_at',
      render: (value) => {
        const date = DateTime.fromISO(String(value));
        if (!date.isValid) {
          return 'Fecha inválida';
        }
        return date
          .setLocale('es')
          .toLocaleString({
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
      }
    },
    {
      header: 'Dirección',
      accessor: 'address',
      render: (value) => value || 'No especificada'
    },
    {
      header: 'Total',
      accessor: 'total',
      render: (value) => `$${Number(value).toFixed(2)}`
    },
    {
      header: 'Estado',
      accessor: 'status',
      render: (value) => {
        const statusText = String(value);
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            statusText.includes('Pendiente') ? 'bg-yellow-100 text-yellow-800' :
            statusText.includes('Completado') ? 'bg-green-100 text-green-800' :
            statusText.includes('Proceso') ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {statusText}
          </span>
        );
      }
    }
  ];

  // Transform orders to OrderDisplay type
  const displayOrders: OrderDisplay[] = orders.map(({ 
    id, 
    created_at, 
    total, 
    status
  }) => ({
    id,
    created_at,
    total,
    status,
    address: user.profile?.address || 'No especificada'
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Card */}
      <div className="card rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-full md:w-auto">
          <Avatar
            name={user.profile.full_name}
            size="xl"
            variant="profile"
          />
          <div className="text-center md:hidden mt-4">
            <p className="text-lg font-bold text-gray-900">{user.profile.full_name}</p>
            <p className="text-sm text-gray-500">{user.profile.email}</p>
          </div>
        </div>
        {/* Info */}
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IoMailOutline className="text-xl text-[#d64d04]" />
                <span className="text-sm text-gray-500">Nombre completo</span>
              </div>
              <div className="font-semibold text-lg text-gray-900">{user.profile.full_name}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IoMailOutline className="text-xl text-[#d64d04]" />
                <span className="text-sm text-gray-500">Correo electrónico</span>
              </div>
              <div className="font-semibold text-lg text-gray-900 break-all">{user.profile.email}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IoCallOutline className="text-xl text-[#d64d04]" />
                <span className="text-sm text-gray-500">Teléfono</span>
              </div>
              <div className="font-semibold text-lg text-gray-900">{user.profile.phone || 'No especificado'}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IoLocationOutline className="text-xl text-[#d64d04]" />
                <span className="text-sm text-gray-500">Dirección</span>
              </div>
              <div className="font-semibold text-lg text-gray-900">{user.profile.address || 'No especificada'}</div>
            </div>
          </div>
          {user.profile.department_description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600">
                {user.profile.department_description}
                {user.profile.municipality_description && 
                  `, ${user.profile.municipality_description}`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>
        <Table 
          columns={columns}
          data={displayOrders}
          isLoading={isLoading}
          emptyMessage="No has realizado ningún pedido aún"
        />
      </div>
    </div>
  );
}