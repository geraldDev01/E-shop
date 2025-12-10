'use client'
import { useAuth } from '@/context/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMailOutline, IoCallOutline, IoLocationOutline, IoPersonOutline, IoCreateOutline, IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';
import { getOrders } from '@/api/orders';
import { Table } from '@/components/ui/Table';
import { DateTime } from 'luxon';
import { Column } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateProfile, UpdateProfileData } from '@/api/profile';
import { getDepartments, getMunicipalities } from '@/api/locations';

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

type FormValues = {
  full_name: string;
  phone: string;
  address: string;
  email: string;
  id_department: string;
  id_municipality: string;
};

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [departments, setDepartments] = useState<Array<{ id: number; description: string }>>([]);
  const [municipalities, setMunicipalities] = useState<Array<{ id: number; description: string }>>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

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

  useEffect(() => {
    const loadDepartments = async () => {
      const result = await getDepartments();
      if (result.success && result.departments) {
        setDepartments(result.departments);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    if (user?.profile?.department_id) {
      const loadMunicipalities = async () => {
        const result = await getMunicipalities(user.profile!.department_id!);
        if (result.success) {
          setMunicipalities(result.municipalities);
        }
      };
      loadMunicipalities();
    } else {
      setMunicipalities([]);
    }
  }, [user?.profile?.department_id]);

  const formik = useFormik<FormValues>({
    initialValues: {
      full_name: user?.profile?.full_name || '',
      phone: user?.profile?.phone || '',
      address: user?.profile?.address || '',
      email: user?.profile?.email || '',
      id_department: user?.profile?.department_id?.toString() || '',
      id_municipality: user?.profile?.municipality_id?.toString() || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      full_name: Yup.string()
        .required('El nombre es obligatorio')
        .min(3, 'Mínimo 3 caracteres'),
      phone: Yup.string()
        .required('El teléfono es obligatorio')
        .min(8, 'Mínimo 8 caracteres'),
      address: Yup.string()
        .required('La dirección es obligatoria')
        .min(5, 'Mínimo 5 caracteres'),
      email: Yup.string()
        .email('Email no válido')
        .required('El email es obligatorio'),
      id_department: Yup.string()
        .required('El departamento es obligatorio'),
      id_municipality: Yup.string()
        .required('El municipio es obligatorio'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      setApiSuccess(null);
      
      if (!user?.token) {
        setApiError('No se encontró el token de autenticación');
        setSubmitting(false);
        return;
      }

      try {
        const updateData: UpdateProfileData = {
          full_name: values.full_name,
          phone: values.phone,
          address: values.address,
          email: values.email,
          id_department: Number(values.id_department),
          id_municipality: Number(values.id_municipality),
        };

        const result = await updateProfile(user.token, updateData);
        
        if (result.success && result.profile) {
          setApiSuccess('Perfil actualizado correctamente');
          await refreshProfile();
          setIsEditing(false);
          setTimeout(() => setApiSuccess(null), 3000);
        } else {
          setApiError(result.message || 'Error al actualizar el perfil');
        }
      } catch (error) {
        console.error('Update profile error:', error);
        setApiError('Error al actualizar el perfil');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDepartmentChange = async (departmentId: string) => {
    formik.setFieldValue('id_department', departmentId);
    formik.setFieldValue('id_municipality', '');
    
    if (departmentId) {
      const result = await getMunicipalities(Number(departmentId));
      if (result.success) {
        setMunicipalities(result.municipalities);
      } else {
        setMunicipalities([]);
      }
    } else {
      setMunicipalities([]);
    }
  };

  useEffect(() => {
    if (isEditing && formik.values.id_department) {
      const loadMunicipalitiesForEdit = async () => {
        const result = await getMunicipalities(Number(formik.values.id_department));
        if (result.success) {
          setMunicipalities(result.municipalities);
        }
      };
      loadMunicipalitiesForEdit();
    }
  }, [isEditing, formik.values.id_department]);

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
    setApiError(null);
    setApiSuccess(null);
  };

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

  const renderField = (
    name: keyof FormValues,
    label: string,
    type: string,
    icon: React.ReactNode
  ) => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      {isEditing ? (
        <>
          <input
            id={name}
            type={type}
            {...formik.getFieldProps(name)}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-900 ${
              formik.touched[name] && formik.errors[name] 
                ? 'border-red-400' 
                : 'border-gray-200'
            } focus:border-[#d64d04] focus:ring-2 focus:ring-[#ffd6b3] outline-none transition-all`}
          />
          {formik.touched[name] && formik.errors[name] && (
            <p className="mt-2 text-sm text-red-500">{formik.errors[name]}</p>
          )}
        </>
      ) : (
        <div className="font-semibold text-lg text-gray-900 break-words">
          {formik.values[name] || 'No especificado'}
        </div>
      )}
    </div>
  );

  const renderSelectField = (
    name: 'id_department' | 'id_municipality',
    label: string,
    options: Array<{ id: number; description: string }>,
    icon: React.ReactNode,
    onChange?: (value: string) => void
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-2 text-gray-700">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
      </label>
      {isEditing ? (
        <>
          <select
            id={name}
            {...formik.getFieldProps(name)}
            onChange={(e) => {
              if (onChange) {
                onChange(e.target.value);
              } else {
                formik.handleChange(e);
              }
            }}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-900 ${
              formik.touched[name] && formik.errors[name] 
                ? 'border-red-400' 
                : 'border-gray-200'
            } focus:border-[#d64d04] focus:ring-2 focus:ring-[#ffd6b3] outline-none transition-all`}
          >
            <option value="">Seleccionar</option>
            {options.map(option => (
              <option key={option.id} value={String(option.id)}>
                {option.description}
              </option>
            ))}
          </select>
          {formik.touched[name] && formik.errors[name] && (
            <p className="mt-2 text-sm text-red-500">{formik.errors[name]}</p>
          )}
        </>
      ) : (
        <div className="font-semibold text-lg text-gray-900">
          {options.find(opt => String(opt.id) === formik.values[name])?.description || 'No especificado'}
        </div>
      )}
    </div>
  );

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#d64d04] text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                <IoCreateOutline className="text-xl" />
                Editar
              </button>
            )}
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

          {apiSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{apiSuccess}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {renderField('full_name', 'Nombre completo', 'text', <IoPersonOutline className="text-xl text-[#d64d04]" />)}
              {renderField('email', 'Correo electrónico', 'email', <IoMailOutline className="text-xl text-[#d64d04]" />)}
              {renderField('phone', 'Teléfono', 'tel', <IoCallOutline className="text-xl text-[#d64d04]" />)}
              {renderField('address', 'Dirección', 'text', <IoLocationOutline className="text-xl text-[#d64d04]" />)}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Ubicación</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderSelectField(
                  'id_department',
                  'Departamento',
                  departments,
                  <IoLocationOutline className="text-xl text-[#d64d04]" />,
                  handleDepartmentChange
                )}
                {renderSelectField(
                  'id_municipality',
                  'Municipio',
                  municipalities,
                  <IoLocationOutline className="text-xl text-[#d64d04]" />
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={formik.isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoCloseOutline className="text-xl" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-[#d64d04] text-white rounded-lg font-semibold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {formik.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <IoCheckmarkOutline className="text-xl" />
                      Guardar
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
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