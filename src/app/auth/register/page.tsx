'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IoMailOutline, IoKeyOutline, IoPersonOutline, IoPhonePortraitOutline, IoLocationOutline, IoPersonAddOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { register } from '@/api/auth';
import { useAuth } from '@/context/auth/AuthContext';
import { getDepartments, getMunicipalities } from '@/api/locations';

type FormValues = {
  full_name: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  password_confirmation: string;
  id_department: string;
  id_municipality: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: number; description: string }>>([]);
  const [municipalities, setMunicipalities] = useState<Array<{ id: number; description: string }>>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  useEffect(() => {
    const loadDepartments = async () => {
      const result = await getDepartments();
      console.log('Departments result:', { success: result.success, count: result.departments?.length, departments: result.departments });
      if (result.success && result.departments) {
        setDepartments(result.departments);
      } else {
        console.error('Failed to load departments:', result.message);
      }
    };
    loadDepartments();
  }, []);

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

  const formik = useFormik({
    initialValues: {
      full_name: '',
      phone: '',
      address: '',
      email: '',
      password: '',
      password_confirmation: '',
      id_department: '',
      id_municipality: '',
    },
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
      password: Yup.string()
        .min(8, 'Mínimo 8 caracteres')
        .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una minúscula')
        .matches(/[0-9]/, 'Debe contener al menos un número')
        .matches(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial')
        .required('La contraseña es obligatoria'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
        .required('Confirma tu contraseña'),
      id_department: Yup.string()
        .required('El departamento es obligatorio'),
      id_municipality: Yup.string()
        .required('El municipio es obligatorio'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        const result = await register({
          ...values,
          id_department: values.id_department ? Number(values.id_department) : null,
          id_municipality: values.id_municipality ? Number(values.id_municipality) : null,
        });
        
        if (result.success && result.token) {
          authLogin(result.token);
          router.push('/');
        } else {
          setApiError(result.error || 'Error en el registro');
        }
      } catch (error) {
        console.error('Register error:', error);
        setApiError('Error en el registro');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const renderField = (
    name: keyof FormValues,
    label: string,
    type: string,
    icon: React.ReactNode,
    extra?: React.ReactNode
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-2 text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          id={name}
          type={type}
          {...formik.getFieldProps(name)}
          className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 bg-white text-gray-900 ${
            formik.touched[name] && formik.errors[name] 
              ? 'border-red-400' 
              : 'border-gray-200'
          } focus:border-[#d64d04] focus:ring-2 focus:ring-[#ffd6b3] outline-none transition-all`}
        />
        {extra}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-2 text-sm text-red-500">{formik.errors[name]}</p>
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
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
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
          className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 bg-white text-gray-900 ${
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
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-2 text-sm text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7f0] via-white to-orange-50 px-4 transition-colors duration-300">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-gray-200">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"></div>
          <IoPersonAddOutline className="w-16 h-16 text-[#d64d04] mx-auto relative z-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Crear Cuenta</h1>
        <p className="text-gray-500 mb-6 text-center">Crea tu cuenta para comenzar a comprar.</p>
        {apiError && (
          <p className="mb-4 text-center text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
            {apiError}
          </p>
        )}
        <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('full_name', 'Nombre Completo', 'text', <IoPersonOutline />)}
            {renderField('phone', 'Teléfono', 'tel', <IoPhonePortraitOutline />)}
            {renderField('email', 'Email', 'email', <IoMailOutline />)}
            {renderField('address', 'Dirección', 'text', <IoLocationOutline />)}
            {renderField('password', 'Contraseña', showPassword ? 'text' : 'password', <IoKeyOutline />,
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            )}
            {renderField('password_confirmation', 'Confirmar Contraseña', showPasswordConfirm ? 'text' : 'password', <IoKeyOutline />,
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPasswordConfirm((v) => !v)}
                tabIndex={-1}
              >
                {showPasswordConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            )}
            {renderSelectField(
              'id_department',
              'Departamento',
              departments,
              <IoLocationOutline />,
              handleDepartmentChange
            )}
            {renderSelectField(
              'id_municipality',
              'Municipio',
              municipalities,
              <IoLocationOutline />
            )}
          </div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#d64d04] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="font-semibold text-[#d64d04] hover:underline">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
